import React from "react";
import GeneralInfoStore from "../../store/GeneralInfoStore.js";
import { FaPhone, FaEnvelope } from "react-icons/fa";

const FooterContact = () => {
  const { GeneralInfoList } = GeneralInfoStore();


  return (
    <div className={"py-4"}>
      <div className="flex items-center mb-2">
        <FaPhone className="mr-2" />
        <a href={`tel:${GeneralInfoList?.PhoneNumber[0]}`}>
          <span>Phone: {GeneralInfoList?.PhoneNumber[0]}</span>
        </a>
      </div>
      <div className="flex items-center">
        <FaEnvelope className="mr-2" />
        <a href={`mailto:${GeneralInfoList?.CompanyEmail[0]}`}>
          <span>Email: {GeneralInfoList?.CompanyEmail[0]}</span>
        </a>
      </div>
    </div>
  );
};

export default FooterContact;
