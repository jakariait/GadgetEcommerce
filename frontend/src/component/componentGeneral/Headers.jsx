import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {  MdClose } from "react-icons/md";
import { CiShoppingCart } from "react-icons/ci";
import { IoPersonOutline } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosLogOut } from "react-icons/io";
import Skeleton from "react-loading-skeleton";

import GeneralInfoStore from "../../store/GeneralInfoStore";
import useCartStore from "../../store/useCartStore";
import useAuthUserStore from "../../store/AuthUserStore";

import ImageComponent from "./ImageComponent";
import MenuBar from "./MenuBar";
import MobileMenu from "./MobileMenu";
import Cart from "./Cart";
import HeaderSearch from "./HeaderSearch.jsx";

const Headers = () => {
  const navigate = useNavigate();
  const { GeneralInfoList, GeneralInfoListLoading, GeneralInfoListError } =
    GeneralInfoStore();
  const { cart } = useCartStore();
  const { user, logout } = useAuthUserStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartMenuOpen, setIsCartMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const cartButtonRef = useRef(null);
  const cartMenuRef = useRef(null);
  const headerRef = useRef(null);

  const prevCartCount = useRef(
    cart.reduce((total, item) => total + item.quantity, 0),
  );

  const avatarClass = `
  w-10 h-10 md:w-14 md:h-14
  rounded-full object-cover border-white border-4
  flex items-center justify-center
  primaryBgColor accentTextColor
  transition-all duration-300 ease-in-out
`;

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const handleScroll = () => {
      const headerTop = header.offsetTop;
      const isScrolled = window.scrollY > headerTop;

      if (isScrolled && !isSticky) {
        setHeaderHeight(header.offsetHeight);
      }
      setIsSticky(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isSticky]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close mobile menu
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }

      // Close cart menu
      if (
        cartMenuRef.current &&
        !cartMenuRef.current.contains(event.target) &&
        cartButtonRef.current &&
        !cartButtonRef.current.contains(event.target)
      ) {
        setIsCartMenuOpen(false);
      }

      // Close user dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isMenuOpen || isCartMenuOpen || isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, isCartMenuOpen, isDropdownOpen]);

  useEffect(() => {
    const currentCartCount = cart.reduce(
      (total, item) => total + item.quantity,
      0,
    );
    if (currentCartCount > prevCartCount.current) {
      setIsCartMenuOpen(true);
    }
    prevCartCount.current = currentCartCount;
  }, [cart]);

  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (GeneralInfoListError) {
    return (
      <div className="primaryTextColor container md:mx-auto text-center p-3">
        <h1>Something went wrong! Please try again later.</h1>
      </div>
    );
  }

  if (GeneralInfoListLoading) {
    return (
      <div className="xl:container xl:mx-auto p-3">
        <Skeleton height={40} />
        <Skeleton height={60} />
        <Skeleton height={40} />
      </div>
    );
  }

  return (
    <div>
      <div
        ref={headerRef}
        className={`w-full z-40 ${
          isSticky ? "fixed top-0 left-0 bg-white shadow-lg" : ""
        }`}
      >
        {/* Header Main */}
        <div
          className="border-b border-gray-200 md:px-3 primaryBgColor text-white"
        >
          <div className="xl:container xl:mx-auto py-3 px-3 flex gap-6 items-center justify-between">
            <div
              ref={hamburgerRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-2xl cursor-pointer lg:hidden"
            >
              <GiHamburgerMenu />
            </div>

            <Link to="/">
              <ImageComponent
                imageName={GeneralInfoList?.PrimaryLogo}
                className="w-30"
              />
            </Link>

            <HeaderSearch />

            <div className={" gap-3 hidden md:flex"}>
              <Link className={"hover:secondaryTextColor"} to="/blog">
                Blog
              </Link>
              <Link className={"hover:secondaryTextColor"} to="/track-order">
                Track Order
              </Link>
            </div>

            {/* Right Icons */}
            <div className="flex items-center justify-center gap-2 relative">
              {/* Cart */}
              <div
                ref={cartButtonRef}
                onClick={() => setIsCartMenuOpen(!isCartMenuOpen)}
                className="relative  "
              >
                <div
                  className={
                    "flex flex-col border-white border-2 p-2 rounded-full justify-center items-center"
                  }
                >
                  {/* Shopping Cart Icon */}
                  <CiShoppingCart className="w-7 h-7 cursor-pointer hover:secondaryTextColor" />
                </div>

                {/* Cart Quantity Badge */}
                {totalQuantity > 0 && (
                  <span className="absolute top-0 right-0 -mt-2 -mr-2 md:mr-0 secondaryBgColor rounded-full h-6 w-6 flex items-center justify-center text-xs accentTextColor">
                    {totalQuantity}
                  </span>
                )}
              </div>

              {/* User / Dropdown */}
              {user ? (
                <div className="relative">
                  <button
                    ref={buttonRef}
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    {user?.userImage &&
                    typeof user.userImage === "string" &&
                    user.userImage.trim() !== "" ? (
                      <ImageComponent
                        imageName={user.userImage}
                        className={avatarClass}
                      />
                    ) : (
                      <span className={avatarClass}>
                        {(user?.fullName &&
                          user.fullName.trim().charAt(0).toUpperCase()) ||
                          "U"}
                      </span>
                    )}
                  </button>

                  {isDropdownOpen && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-50 top-full right-0 mt-5 bg-white shadow-lg rounded-md p-2"
                    >
                      <div className="flex flex-col items-center gap-2 p-3">
                        <button className="primaryBgColor px-2 py-2 rounded w-42 accentTextColor cursor-pointer">
                          <Link
                            to="/user/home"
                            className={"flex items-center gap-2 "}
                          >
                            <IoPersonOutline className="w-6 h-6 hover:secondaryTextColor" />
                          </Link>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="bg-red-500 w-42 text-white px-2 py-2 cursor-pointer rounded flex items-center gap-2"
                        >
                          <IoIosLogOut className="text-2xl" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link className={"hidden md:block"} to="/login">
                  <div className="flex items-center border-white border-2 p-2 rounded-full gap-2 flex-col">
                    <IoPersonOutline className="w-7 h-7 hover:secondaryTextColor" />
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
        {/* MenuBar (Desktop) */}
        <div className="hidden lg:block bg-white">
          <MenuBar />
        </div>
      </div>

      {isSticky && <div style={{ height: headerHeight }} />}

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-opacity-50"
          onClick={() => setIsMenuOpen(false)}
        />
        <div
          ref={menuRef}
          className="relative bg-white w-64 h-full shadow-lg transform transition-transform"
          style={{
            transform: isMenuOpen ? "translateX(0)" : "translateX(-100%)",
          }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <Link to="/">
                <ImageComponent
                  imageName={GeneralInfoList?.PrimaryLogo}
                  className="w-30"
                />
              </Link>
              <button onClick={() => setIsMenuOpen(false)}>
                <MdClose className="text-3xl" />
              </button>
            </div>
            <div className="space-y-2">
              <MobileMenu />
            </div>
            <div className="mt-4">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="primaryBgColor accentTextColor px-4 py-2 rounded-lg w-full"
                >
                  Log Out
                </button>
              ) : (
                <Link to="/login">
                  <div className="inline-flex items-center gap-3">
                    <IoPersonOutline className="w-10 h-10 primaryBgColor rounded-full text-white p-2" />
                    <span className="text-sm">Login / Register</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Menu */}
      <div
        className={`fixed inset-0 z-50  transition-opacity duration-300 ${
          isCartMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Background Overlay */}
        <div
          className="absolute inset-0 bg-opacity-50"
          onClick={() => setIsCartMenuOpen(false)}
        />

        {/* Slide-In Cart from Right */}
        <div
          ref={cartMenuRef}
          className="fixed top-0 right-0 h-full w-[350px] bg-white shadow-lg transition-transform duration-300 ease-in-out"
          style={{
            transform: isCartMenuOpen ? "translateX(0)" : "translateX(100%)",
          }}
        >
          <div className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between text-lg mb-4">
              <h1>Your Cart</h1>
              <h1>
                {totalQuantity} {totalQuantity <= 1 ? "item" : "items"}
              </h1>
              <button
                onClick={() => setIsCartMenuOpen(false)}
                className={"cursor-pointer"}
              >
                <MdClose className="text-2xl" />
              </button>
            </div>

            {/* Cart Items Scrollable Section */}
            <div className="flex-1 overflow-y-auto space-y-2">
              <Cart onCloseCartMenu={() => setIsCartMenuOpen(false)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Headers;
