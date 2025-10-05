import React from 'react';
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import RequirePermission from "../component/componentAdmin/RequirePermission.jsx";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import BrandManagement from "../component/componentAdmin/BrandManagement.jsx";

const BrandsPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb pageDetails="BRAND" title="Brand Management" />
      <RequirePermission permission="brand">
        <BrandManagement/>
      </RequirePermission>
    </LayoutAdmin>
  );
};

export default BrandsPage;