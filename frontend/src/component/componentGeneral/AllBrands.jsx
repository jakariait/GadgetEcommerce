import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ImageComponent from "./ImageComponent.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BrandCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition duration-200 flex flex-col items-center p-1 animate-pulse">
      <div className="w-24 h-24 bg-gray-300 rounded-md mb-4"></div>
      <div className="h-6 w-20 bg-gray-300 rounded"></div>
    </div>
  );
};

const AllBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isScrollable, setIsScrollable] = useState(false);
  const scrollContainerRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get(`${API_URL}/brands`);
        setBrands(res.data.data || []);
      } catch (err) {
        setError("Failed to fetch brands");
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, [API_URL]);

  useEffect(() => {
    const checkScrollable = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        setIsScrollable(scrollWidth > clientWidth);
      }
    };

    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, [brands, loading]);

  const scroll = (scrollOffset) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += scrollOffset;
    }
  };

  return (
    <div className="xl:container xl:mx-auto pb-4 px-3">
      <div className="flex items-center gap-4 my-6">
        <div className="flex-grow h-px bg-gray-400"></div>
        <h2 className="text-lg pl-10 pr-10 font-bold secondaryTextColor whitespace-nowrap uppercase tracking-widest">
          All Brands
        </h2>
        <div className="flex-grow h-px bg-gray-400"></div>
        {isScrollable && (
          <div className="flex gap-2">
            <button
              onClick={() => scroll(-200)}
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll(200)}
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
      <div
        ref={scrollContainerRef}
        className="grid grid-flow-col  auto-cols-max gap-3 overflow-x-auto scrollbar-hide pb-4 mb-4"
        style={{
          gridTemplateRows: "repeat(2, minmax(0, 1fr))",
          maxHeight: "400px",
        }}
      >
        {loading ? (
          Array.from({ length: 20 }).map((_, index) => (
            <BrandCardSkeleton key={index} />
          ))
        ) : error ? (
          <p className="text-center py-10 text-red-500 col-span-full">
            {error}
          </p>
        ) : (
          brands.map((brand) => (
            <Link
              to={`/shop?page=1&limit=20&brand=${brand.slug}`}
              key={brand._id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition duration-200 flex flex-col items-center p-3"
            >
              <ImageComponent
                imageName={brand.logo}
                altName={brand.name}
                className={"w-24 h-24 object-contain mb-4"}
                skeletonHeight={100}
              />
              <h3 className="text-lg font-medium">{brand.name}</h3>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default AllBrands;
