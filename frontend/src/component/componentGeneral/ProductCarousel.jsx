import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import CarouselStore from "../../store/CarouselStore.js";
import ImageComponent from "./ImageComponent.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GeneralInfoStore from "../../store/GeneralInfoStore.js";

const ProductCarousel = () => {
  const {
    CarouselStoreList,
    CarouselStoreListLoading,
    CarouselStoreListError,
  } = CarouselStore();

  const { GeneralInfoList } = GeneralInfoStore();

  const [carouselProducts, setCarouselProducts] = useState([]);
  const [sideImages, setSideImages] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (Array.isArray(CarouselStoreList) && CarouselStoreList.length > 0) {
      if (CarouselStoreList.length > 2) {
        setCarouselProducts(CarouselStoreList.slice(0, -2));
        setSideImages(CarouselStoreList.slice(-2));
      } else {
        setCarouselProducts(CarouselStoreList);
        setSideImages([]);
      }
    }
  }, [CarouselStoreList]);

  const settings = {
    dots: false, // Disable dots
    infinite: carouselProducts.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: carouselProducts.length > 1,
    autoplaySpeed: 6000,
    pauseOnHover: false,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  useEffect(() => {
    if (sliderRef.current && carouselProducts.length > 1) {
      sliderRef.current.slickPlay();
    }
  }, [carouselProducts]);

  if (CarouselStoreListError) {
    return (
      <div className="primaryTextColor  container md:mx-auto text-center p-3">
        <h1 className={"p-44"}>
          Something went wrong! Please try again later.
        </h1>
      </div>
    ); // Display error message
  }
  return (
    <div className="product-carousel xl:container xl:mx-auto pt-4 pb-4 px-3">
      {CarouselStoreListLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Skeleton height={400} width={"100%"} />
          </div>
          <div className="flex flex-row lg:flex-col gap-4 lg:justify-center">
            <Skeleton height={192} width={"100%"} />
            <Skeleton height={192} width={"100%"} />
          </div>
        </div>
      ) : (
        <div className="grid  grid-cols-1 lg:grid-cols-3 gap-4">
          <div
            className={`${sideImages.length === 2 ? "lg:col-span-2" : "lg:col-span-3"} relative`}
          >
            <Slider ref={sliderRef} {...settings}>
              {carouselProducts.map((product, index) => (
                <div key={index} className="relative" >
                  <ImageComponent
                    imageName={product.imgSrc}
                    className="w-full h-full  object-cover"
                    skeletonHeight={400}
                    altName={GeneralInfoList?.CompanyEmail}
                  />
                </div>
              ))}
            </Slider>
          </div>
          {sideImages.length === 2 && (
            <div className="grid grid-cols-2 md:flex md:flex-col gap-2 items-center justify-center">
              <div>
                <ImageComponent
                  imageName={sideImages[0].imgSrc}
                  className="w-full h-full object-cover rounded"
                  skeletonHeight={192}
                  altName={GeneralInfoList?.CompanyEmail}
                />
              </div>
              <div>
                <ImageComponent
                  imageName={sideImages[1].imgSrc}
                  className="w-full h-full object-cover rounded"
                  skeletonHeight={192}
                  altName={GeneralInfoList?.CompanyEmail}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Custom Arrow Components
const CustomPrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black text-white p-2 rounded-full z-10"
  >
    <ChevronLeft size={30} />
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black text-white p-2 rounded-full z-10"
  >
    <ChevronRight size={30} />
  </button>
);

export default ProductCarousel;
