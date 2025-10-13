import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useCategoryStore from "../../store/useCategoryStore.js";
import useSubCategoryStore from "../../store/useSubCategoryStore.js";
import useChildCategoryStore from "../../store/useChildCategoryStore.js";
import ImageComponent from "./ImageComponent.jsx";

const FeatureCategory = () => {
  const {
    categories,
    fetchCategories,
    loading: categoryLoading,
  } = useCategoryStore();
  const {
    subCategories,
    fetchSubCategories,
    loading: subCategoryLoading,
  } = useSubCategoryStore();
  const {
    childCategories,
    fetchChildCategories,
    loading: childCategoryLoading,
  } = useChildCategoryStore();
  const [allCategories, setAllCategories] = useState([]);
  const apiURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    fetchChildCategories();
  }, []);

  useEffect(() => {
    const combined = [
      ...categories.map((c) => ({ ...c, type: "category" })),
      ...subCategories.map((sc) => ({ ...sc, type: "subcategory" })),
      ...childCategories.map((cc) => ({ ...cc, type: "childcategory" })),
    ];
    setAllCategories(combined);
  }, [categories, subCategories, childCategories]);

  const getLink = (item) => {
    switch (item.type) {
      case "category":
        return `/shop?category=${item.name}`;
      case "subcategory":
        return `/shop?subcategory=${item.slug}`;
      case "childcategory":
        return `/shop?childCategory=${item.slug}`;
      default:
        return "/shop";
    }
  };

  return (
    <div className="xl:container xl:mx-auto pb-6 px-3">
      <div>
        <div className="flex items-center gap-4 my-6">
          <div className="flex-grow h-px bg-gray-400"></div>
          <h2 className="text-lg pl-10 pr-10 font-bold secondaryTextColor whitespace-nowrap uppercase tracking-widest">
            Feature Category
          </h2>
          <div className="flex-grow h-px bg-gray-400"></div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {allCategories.map((item, index) => (
          <Link to={getLink(item)} key={index}>
            <div className="flex flex-col items-center bg-white rounded-2xl shadow hover:shadow-lg transition duration-200  p-3">
              <ImageComponent
                imageName={
                  item.categoryImage ||
                  item.subCategoryImage ||
                  item.childCategoryImage
                }
                altName={item.name}
                className={"w-24 h-24 object-contain  mb-4"}
              />
              <p className="text-center">{item.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeatureCategory;
