import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import ProductOptionManager from "../component/componentAdmin/ProductOptionManager.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const ProductOptionListPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="PRODUCT OPTION" title="View all Product Option" />
      <RequirePermission permission="product_size" >
        <ProductOptionManager />
      </RequirePermission >
    </LayoutAdmin>
  );
};

export default ProductOptionListPage;
