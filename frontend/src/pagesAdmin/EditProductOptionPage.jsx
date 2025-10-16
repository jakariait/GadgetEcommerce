import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import EditProductOption from "../component/componentAdmin/EditProductOption.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";

const EditProductOptionPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="PRODUCT OPTION" title="View all Product Option" />
      <RequirePermission permission="product_size">
        <EditProductOption />
      </RequirePermission>
    </LayoutAdmin>
  );
};

export default EditProductOptionPage;
