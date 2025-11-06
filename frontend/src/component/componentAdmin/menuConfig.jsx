import {
  FaHome,
  FaPalette,
  FaLink,
  FaSearch,
  FaCog,
  FaThLarge,
  FaBoxes,
  FaList,
  FaTags,
  FaCreditCard,
  FaUsers,
  FaEnvelope,
  FaUserFriends,
  FaSlidersH,
  FaFileAlt,
  FaQuestionCircle,
  FaUserShield,
  FaShoppingBag,
  FaInfo,
  FaClipboardList,
  FaBlog,
} from "react-icons/fa";

const getMenuConfig = ({
  totalProductsAdmin,
  totalOrders,
  pendingCount,
  approvedCount,
  intransitCount,
  deliveredCount,
  returnedCount,
  cancelledCount,
}) => [
  {
    items: [
      {
        label: "Dashboard",
        icon: <FaHome />,
        to: "/admin/dashboard",
        permission: "dashboard",
      },
    ],
  },
  {
    items: [
      {
        label: "General Info",
        icon: <FaThLarge />,
        to: "/admin/general-info",
        permission: "website_theme_color",
      },
      {
        label: "Website Theme Color",
        icon: <FaPalette />,
        to: "/admin/color-updater/",
        permission: "general_info",
      },
      {
        label: "Social Media Links",
        icon: <FaLink />,
        to: "/admin/social-link-updater",
        permission: "website_theme_color",
      },
      {
        label: "Home Page SEO",
        icon: <FaSearch />,
        to: "/admin/homepage-seo",
        permission: "home_page_seo",
      },
      {
        label: "Brand",
        icon: <FaSearch />,
        to: "/admin/brands",
        permission: "brand",
      },
    ],
  },
  {
    items: [
      {
        label: "Config",
        icon: <FaCog />,
        permission: [
          "setup_config",
          "product_size",
          "product_flag",
          "scroll_text",
          "delivery_charges",
          "manage_coupons",
        ],
        match: "any",
        children: [
          {
            label: "Setup Your Config",
            to: "/admin/configsetup",
            permission: "setup_config",
          },
          {
            label: "Add New Product Option",
            to: "/admin/add-product-option",
            permission: "product_size",
          },
          {
            label: "View All Product Option",
            to: "/admin/product-options",
            permission: "product_size",
          },
          {
            label: "Product Flags",
            to: "/admin/product-flags",
            permission: "product_flag",
          },
          {
            label: "Scroll Text",
            to: "/admin/scroll-text",
            permission: "scroll_text",
          },
          {
            label: "Delivery Charges",
            to: "/admin/deliverycharge",
            permission: "delivery_charges",
          },
          {
            label: "Coupon",
            to: "/admin/coupon",
            permission: "manage_coupons",
          },
        ],
      },
      {
        label: "Category",
        icon: <FaThLarge />,
        permission: "category",
        children: [
          { label: "Add New Category", to: "/admin/addnewcategory" },
          { label: "View All Categories", to: "/admin/categorylist" },
        ],
      },
      {
        label: "Subcategory",
        icon: <FaBoxes />,
        permission: "sub_category",
        children: [
          { label: "Add New Sub Category", to: "/admin/addnewsubcategory" },
          { label: "View All SubCategories", to: "/admin/subcategorylist" },
        ],
      },
      {
        label: "Child Category",
        icon: <FaList />,
        permission: "child_category",
        children: [
          {
            label: "Add New Child Category",
            to: "/admin/addnewchildcategory",
          },
          {
            label: "View All Child Categories",
            to: "/admin/childcategorylist",
          },
        ],
      },
      {
        label: "Manage Products",
        icon: <FaTags />,
        permission: [
          "add_products",
          "delete_products",
          "view_products",
          "edit_products",
        ],
        match: "any",
        children: [
          {
            label: "Add New Product",
            to: "/admin/addnewproduct",
            permission: "add_products",
          },
          {
            label: `View All Products(${totalProductsAdmin})`,
            to: "/admin/viewallproducts",
            permission: "view_products",
          },
        ],
      },
      {
        label: "Manage Orders",
        icon: <FaShoppingBag />,
        permission: "view_orders",
        children: [
          { label: `All Orders (${totalOrders})`, to: "/admin/allorders" },
          {
            label: `Pending Orders (${pendingCount})`,
            to: "/admin/pendingorders",
          },
          {
            label: `Approved Orders (${approvedCount})`,
            to: "/admin/approvedorders",
          },
          {
            label: `In Transit Orders (${intransitCount})`,
            to: "/admin/intransitorders",
          },
          {
            label: `Delivered Orders (${deliveredCount})`,
            to: "/admin/deliveredorders",
          },
          {
            label: `Returned Orders (${returnedCount})`,
            to: "/admin/returnedorders",
          },
          {
            label: `Cancelled Orders (${cancelledCount})`,
            to: "/admin/cancelledorders",
          },
        ],
      },
      {
        label: "Incomplete Order",
        icon: <FaClipboardList />,
        to: "/admin/incomplete-order",
        permission: "incomplete_orders",
      },
      {
        label: "Gateway & API",
        icon: <FaCreditCard />,
        permission: ["bkash_api", "steadfast_api"],
        match: "any",
        children: [
          {
            label: "bKash",
            to: "/admin/bkash-config",
            permission: "bkash_api",
          },
          {
            label: "Steadfast",
            to: "/admin/steadfast-config",
            permission: "steadfast_api",
          },
        ],
      },
      {
        label: "Customers",
        icon: <FaUsers />,
        to: "/admin/customers",
        permission: "view_customers",
      },
      {
        label: "Product Question",
        icon: <FaUsers />,
        to: "/admin/product-questions",
      },
    ],
  },
  {
    items: [
      {
        label: "Contact Request",
        icon: <FaEnvelope />,
        to: "/admin/contact-request",
        permission: "contact_request",
      },
      {
        label: "Subscribed Users",
        icon: <FaUserFriends />,
        to: "/admin/subscribed-users",
        permission: "subscribed_users",
      },
      {
        label: "Blogs",
        icon: <FaBlog />,
        to: "/admin/blogs",
        permission: "blogs",
      },
    ],
  },
  {
    items: [
      {
        icon: <FaSlidersH />,
        label: "Sliders & Banners",
        to: "/admin/sliders-banners",
        permission: "sliders-banners",
      },
      {
        icon: <FaFileAlt />,
        label: "Terms & Policies",
        to: "/admin/terms-policies",
        permission: "about_terms-policies",
      },
      {
        icon: <FaQuestionCircle />,
        label: "FAQs",
        to: "/admin/faqs",
        permission: "faqs",
      },
      {
        icon: <FaInfo />,
        label: "About Us",
        to: "/admin/about-us",
        permission: "about_terms-policies",
      },
    ],
  },
  {
    items: [
      {
        icon: <FaUserShield />,
        label: "System Users",
        to: "/admin/adminlist",
        permission: "admin-users",
      },
    ],
  },
];

export default getMenuConfig;
