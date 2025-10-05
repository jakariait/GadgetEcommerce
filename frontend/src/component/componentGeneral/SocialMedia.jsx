import React from "react";
import {
  FaFacebookF,
  FaFacebookMessenger,
  FaLinkedin,
  FaPinterest,
  FaTelegramPlane,
  FaTiktok,
  FaViber,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { CiInstagram } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import useSocialMediaLinkStore from "../../store/SocialMediaLinkStore.js";

const SocialMedia = () => {
  const { socialMediaLinks } = useSocialMediaLinkStore();
  return (
    <div>
      <div className={"flex gap-2 text-lg"}>
        {socialMediaLinks?.facebook && (
          <a
            href={socialMediaLinks.facebook}
            target="_blank"
            data-no-instant
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={"bg-white p-[7px] rounded-full"}
          >
            <FaFacebookF className="text-blue-600" />
          </a>
        )}
        {socialMediaLinks?.instagram && (
          <a
            href={socialMediaLinks.instagram}
            target="_blank"
            data-no-instant
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={"bg-white p-[7px] rounded-full"}
          >
            <CiInstagram className="text-pink-500" />
          </a>
        )}
        {socialMediaLinks?.tiktok && (
          <a
            href={socialMediaLinks.tiktok}
            target="_blank"
            data-no-instant
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={"bg-white p-[7px] rounded-full"}
          >
            <FaTiktok className={"text-[#00F2EA]"} />
          </a>
        )}
        {socialMediaLinks?.twitter && (
          <a
            href={socialMediaLinks.twitter}
            target="_blank"
            data-no-instant
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={"bg-white p-[7px] rounded-full"}
          >
            <FaXTwitter className="text-black" />
          </a>
        )}
        {socialMediaLinks?.whatsapp && (
          <a
            href={socialMediaLinks.whatsapp}
            target="_blank"
            data-no-instant
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={"bg-white p-[7px] rounded-full"}
          >
            <FaWhatsapp className="text-green-500" />
          </a>
        )}
        {socialMediaLinks?.messenger && (
          <a
            href={socialMediaLinks.messenger}
            target="_blank"
            data-no-instant
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={"bg-white p-[7px] rounded-full"}
          >
            <FaFacebookMessenger className="text-blue-500" />
          </a>
        )}
        {socialMediaLinks?.youtube && (
          <a
            href={socialMediaLinks.youtube}
            target="_blank"
            data-no-instant
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={"bg-white p-[7px] rounded-full"}
          >
            <FaYoutube className="text-red-600" />
          </a>
        )}
        {socialMediaLinks?.linkedin && (
          <a
            href={socialMediaLinks.linkedin}
            target="_blank"
            data-no-instant
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={"bg-white p-[7px] rounded-full"}
          >
            <FaLinkedin className="text-blue-700" />
          </a>
        )}

        {socialMediaLinks?.pinterest && (
          <a
            href={socialMediaLinks.pinterest}
            target="_blank"
            data-no-instant
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={"bg-white p-[7px] rounded-full"}
          >
            <FaPinterest className="text-red-600" />
          </a>
        )}
        {socialMediaLinks?.telegram && (
          <a
            href={socialMediaLinks.telegram}
            target="_blank"
            data-no-instant
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={"bg-white p-[7px] rounded-full"}
          >
            <FaTelegramPlane className="text-blue-400" />
          </a>
        )}

        {socialMediaLinks?.viber && (
          <a
            href={socialMediaLinks.viber}
            target="_blank"
            data-no-instant
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={"bg-white p-[7px] rounded-full"}
          >
            <FaViber className="text-purple-600" />
          </a>
        )}
      </div>
    </div>
  );
};

export default SocialMedia;
