import React, { useEffect, useRef, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FiMinus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useCartStore from "../../store/useCartStore.js";
import LiveStatsNotification from "./LiveStatsNotification.jsx";
import ImageComponent from "./ImageComponent.jsx";
import ProductBrand from "./ProductBrand.jsx";

const ProductAddToCart = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const MAX_QUANTITY = 5; // Set the limit for Cart Quantity
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  const [selectedVariant, setSelectedVariant] = useState(null);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);

    // Push event to Google Tag Manager
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "add_to_cart",
      ecommerce: {
        currency: "BDT", // or your preferred currency
        value:
          selectedVariant?.discount > 0
            ? selectedVariant.discount * quantity
            : selectedVariant?.price
              ? selectedVariant.price * quantity
              : product.finalDiscount > 0
                ? product.finalDiscount * quantity
                : product.finalPrice * quantity,
        items: [
          {
            item_id: product.productId,
            item_name: product.name,
            currency: "BDT",
            discount:
              selectedVariant?.discount > 0
                ? selectedVariant.price - selectedVariant.discount
                : product.finalPrice - product.finalDiscount,
            item_variant: selectedVariant?.size?.name || "Default",
            price:
              selectedVariant?.discount > 0
                ? selectedVariant.discount
                : selectedVariant?.price ||
                  product.finalDiscount ||
                  product.finalPrice,
            quantity,
          },
        ],
      },
    });
  };

  // Handle Quantity Change
  const handleQuantityChange = (type) => {
    if (type === "increase" && quantity < MAX_QUANTITY) {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const formatPrice = (price) => {
    if (isNaN(price)) return price;
    return price.toLocaleString();
  };

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]); // Default to first variant when product is fetched
    }
  }, [product]);

  const handleSizeChange = (sizeName) => {
    const newVariant = product.variants.find(
      (variant) => variant.size.name === sizeName,
    );
    setSelectedVariant(newVariant);
  };

  // Function to sanitize/remove editor-specific tags like ql-ui
  const cleanHtml = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Remove Quill editor-only UI elements
    doc.querySelectorAll(".ql-ui").forEach((el) => el.remove());

    return doc.body.innerHTML;
  };

  return (
    <div>
      <div>
        <div className="flex flex-col gap-3 md:col-span-4 lg:col-span-3 xl:col-span-4 pt-4 md:pt-0">
          {/*<LiveStatsNotification />*/}

          {/* Product Brand Section */}
          <ProductBrand product={product} />

          <h2 className="text-xl md:text-2xl  ">
            {product.name}
          </h2>

          <div className="flex text-center flex-col gap-2">
            {/* Without Variant Price Display */}
            {!product.variants?.length && (
              <div className="grid grid-cols-2 gap-2 items-center ">
                {product.finalDiscount > 0 ? (
                  <>
                    <div className="text-red-800 bg-gray-100 px-2 py-1 rounded-lg">
                      Offer Price: Tk.{" "}
                      {formatPrice(Number(product.finalDiscount))}
                    </div>

                    <div className=" bg-gray-100 px-2 py-1 rounded-lg">
                      Regular Price: Tk.{" "}
                      {formatPrice(Number(product.finalPrice))}
                    </div>

                    {/*<div className={"bg-gray-100 px-2 py-1 rounded-lg"}>*/}
                    {/*  You Save: Tk{" "}*/}
                    {/*  {formatPrice(*/}
                    {/*    Number(product.finalPrice - product.finalDiscount),*/}
                    {/*  )}*/}
                    {/*</div>*/}
                  </>
                ) : (
                  <div className="text-black font-medium bg-gray-100 px-2 py-1 rounded-lg">
                    Price: Tk. {formatPrice(Number(product.finalPrice))}
                  </div>
                )}
                {/*Product Code*/}
                {product.productCode && (
                  <div className={"bg-gray-100  px-2 py-1 rounded-lg"}>
                    <strong>Product Code:</strong> {product.productCode}
                  </div>
                )}
                {/* Reward Points */}
                {product.rewardPoints && (
                  <div className={"bg-gray-100  px-2 py-1 rounded-lg"}>
                    Purchase & Earn: {product.rewardPoints} points.
                  </div>
                )}
              </div>
            )}

            {/*With Variant Price Display */}
            {selectedVariant && (
              <div className="grid grid-cols-2 gap-2 items-center">
                {selectedVariant.discount > 0 ? (
                  <>
                    <div className="text-red-800 bg-gray-100 px-2 py-1 rounded-lg">
                      Offer Price: Tk.{" "}
                      {formatPrice(Number(selectedVariant.discount))}
                    </div>
                    <div className="bg-gray-100 px-2 py-1 rounded-lg">
                      Regular Price:{" "}
                      <span className="line-through">
                        Tk. {formatPrice(Number(selectedVariant.price))}
                      </span>
                    </div>
                    {/*<div className="bg-gray-100 px-2 py-1 rounded-lg">*/}
                    {/*  You Save: Tk{" "}*/}
                    {/*  {formatPrice(*/}
                    {/*    Number(selectedVariant.price - selectedVariant.discount),*/}
                    {/*  )}*/}
                    {/*</div>*/}
                  </>
                ) : (
                  <div className="text-black bg-gray-100 px-2 py-1 rounded-lg">
                    Price: Tk. {formatPrice(Number(selectedVariant.price))}
                  </div>
                )}
                {/*Product Code*/}
                {product.productCode && (
                  <div className={"bg-gray-100  px-2 py-1 rounded-lg"}>
                    <strong>Product Code:</strong> {product.productCode}
                  </div>
                )}
                {/* Reward Points */}
                {product.rewardPoints && (
                  <div className={"bg-gray-100  px-2 py-1 rounded-lg"}>
                    Purchase & Earn: {product.rewardPoints} points.
                  </div>
                )}
              </div>
            )}
          </div>


          {/*Short Description*/}
          {product.shortDesc && (
            <div
              className="rendered-html"
              dangerouslySetInnerHTML={{
                __html: cleanHtml(product.shortDesc),
              }}
            />
          )}

          {/* With Variant Price Display */}
          {product.variants?.length > 0 && (
            <div className={"flex gap-4 items-center"}>
              <h2 className="text-lg">Size</h2>
              <div className="flex gap-2 flex-wrap justify-center ">
                {product.variants.map((variant) => (
                  <button
                    key={variant.size.name}
                    onClick={() => handleSizeChange(variant.size.name)}
                    className={`px-2 py-1 rounded transition-all cursor-pointer  ${
                      selectedVariant?.size.name === variant.size.name
                        ? "primaryBgColor text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {variant.size.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/*Cart Quantity, Add to Cart and Wish List Button */}
          <div
            className={
              "flex gap-2  md:gap-6 xl:gap-15 items-center justify-baseline mt-2"
            }
          >
            {/*Cart Quantity Button*/}
            <div className={"rounded flex items-center justify-between"}>
              <button
                className={
                  "primaryBgColor accentTextColor px-2 py-2 md:py-3 rounded-l cursor-pointer"
                }
                onClick={() => handleQuantityChange("decrease")}
                disabled={
                  selectedVariant?.stock === 0 || product.finalStock === 0
                }
              >
                <FiMinus />
              </button>
              <span className={"px-3 py-1 md:py-2 bg-gray-200"}>
                {quantity}
              </span>
              <button
                className={
                  "primaryBgColor accentTextColor px-2 py-2 md:py-3 rounded-r cursor-pointer"
                }
                onClick={() => handleQuantityChange("increase")}
                disabled={
                  quantity >= MAX_QUANTITY ||
                  selectedVariant?.stock === 0 ||
                  product.finalStock === 0
                } // Disable when limit is reached or out of stock
              >
                <FaPlus />
              </button>
            </div>
            {/*Add to Cart Button*/}
            {selectedVariant?.stock === 0 || product.finalStock === 0 ? (
              <button className="text-red-600 w-44 font-semibold" disabled>
                Stock Out
              </button>
            ) : (
              <button
                className="primaryBgColor accentTextColor px-2 py-1 md:py-2 rounded w-44 cursor-pointer"
                onClick={handleAddToCart}
              >
                ADD TO CART
              </button>
            )}

            {/*Cash On Delivery Order Button*/}
            {selectedVariant?.stock !== 0 && product.finalStock !== 0 && (
              <button
                className="primaryBgColor w-44 accentTextColor px-2 py-1 md:py-2 rounded cursor-pointer"
                onClick={() => {
                  addToCart(product, quantity, selectedVariant);
                  navigate("/checkout");
                }}
              >
                BUY NOW
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAddToCart;
