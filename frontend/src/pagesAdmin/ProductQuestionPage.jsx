import React from "react";
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import ProductQuestions from "../component/componentAdmin/ProductQuestions.jsx";

const ProductQuestionPage = () => {
  return (
    <LayoutAdmin>
      <Breadcrumb
        title={"View And Approve Product Question"}
        pageDetails={"PRODUCT QUESTION"}
      />
      <ProductQuestions />
    </LayoutAdmin>
  );
};

export default ProductQuestionPage;
