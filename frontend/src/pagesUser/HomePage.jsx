import React from "react";
import Layout from "../component/componentGeneral/Layout.jsx";
import ProductCarousel from "../component/componentGeneral/ProductCarousel.jsx";
import Feature from "../component/componentGeneral/Feature.jsx";
import ProductByFlag from "../component/componentGeneral/ProductByFlag.jsx";
import AllBrands from "../component/componentGeneral/AllBrands.jsx";
import FeatureCategory from "../component/componentGeneral/FeatureCategory.jsx";
import MarqueeModern from "../component/componentGeneral/MarqueeModern.jsx";

const HomePage = () => {
  return (
    <Layout>
      <ProductCarousel />
      <MarqueeModern />

      <Feature />
      <AllBrands />
      <FeatureCategory />
      <ProductByFlag />
    </Layout>
  );
};

export default HomePage;
