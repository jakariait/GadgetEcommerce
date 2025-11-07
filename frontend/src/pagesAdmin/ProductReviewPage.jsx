import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import ProductReview from "../component/componentAdmin/ProductReview.jsx";

const ProductReviewPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb
        title={"View And Approve Product Review"}
        pageDetails={"PRODUCT REVIEW"}
      />
      <ProductReview />
    </LayoutAdmin>
  );
};

export default ProductReviewPage;
