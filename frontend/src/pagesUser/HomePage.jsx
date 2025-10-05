import React from "react";
import Layout from "../component/componentGeneral/Layout.jsx";
import ProductCarousel from "../component/componentGeneral/ProductCarousel.jsx";
import Feature from "../component/componentGeneral/Feature.jsx";
import ProductByFlag from "../component/componentGeneral/ProductByFlag.jsx";
import AllBrands from "../component/componentGeneral/AllBrands.jsx";

const HomePage = () => {
  return (
    <Layout>
      <ProductCarousel />
      <Feature />
      <AllBrands/>
      <ProductByFlag />
    </Layout>
  );
};

export default HomePage;
