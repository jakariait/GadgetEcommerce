import React from "react";
import ImageComponent from "./ImageComponent.jsx";

const ProductBrand = ({ product }) => {
  return (
    <div>
      {product?.brand && (
        <div className="flex items-center gap-3 mt-4">
          {/* Brand Logo */}
          {product.brand.logo && (
            <ImageComponent
              imageName={product.brand.logo}
              className="w-10 h-10 object-contain rounded-md"
              altName={product.brand.name}
            />
          )}

          {/* Brand Name */}
          <h2 className="text-lg font-semibold text-gray-800">
            {product.brand.name}
          </h2>
        </div>
      )}
    </div>
  );
};

export default ProductBrand;
