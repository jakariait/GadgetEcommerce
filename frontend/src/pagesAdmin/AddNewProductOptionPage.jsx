import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import AddProductOption from "../component/componentAdmin/AddProductOption.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const AddNewProductOptionPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="PRODUCT OPTION" title="Add New Product Option" />
      <RequirePermission permission="product_size" >
        <AddProductOption />
      </RequirePermission >
    </LayoutAdmin>
  );
};

export default AddNewProductOptionPage;
