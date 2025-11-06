import { FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import useAuthAdminStore from "../../store/AuthAdminStore.js";
import { useNavigate } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useProductStore from "../../store/useProductStore.js";
import useOrderStore from "../../store/useOrderStore.js";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import RequirePermission from "./RequirePermission.jsx";
import { CircularProgress } from "@mui/material";
import getMenuConfig from "./menuConfig.jsx";

const accordionStyles = {
  background: "transparent",
  boxShadow: "none",
  width: "100%",
  color: "white",
  "& .MuiAccordionSummary-root": {
    backgroundColor: "transparent",
    minHeight: "auto",
    padding: "0",
  },
  "& .MuiAccordionDetails-root": {
    backgroundColor: "transparent",
    paddingLeft: "0",
  },
  "& .MuiSvgIcon-root": {
    color: "white",
  },
};

export default function SidebarMenu() {
  const { totalProductsAdmin } = useProductStore();
  const { logout } = useAuthAdminStore();
  const { totalByStatus, fetchTotalOrdersByAllStatuses } = useOrderStore();
  const { loading } = useAuthAdminStore();

  const location = useLocation();

  useEffect(() => {
    fetchTotalOrdersByAllStatuses();
  }, [location.pathname, fetchTotalOrdersByAllStatuses]);

  const pendingCount = totalByStatus.pending;
  const approvedCount = totalByStatus.approved;
  const intransitCount = totalByStatus.intransit;
  const deliveredCount = totalByStatus.delivered;
  const returnedCount = totalByStatus.returned;
  const cancelledCount = totalByStatus.cancelled;

  const totalOrders = Object.values(totalByStatus).reduce(
    (acc, count) => acc + count,
    0,
  );

  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="w-64 mt-100 flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  const menuConfig = getMenuConfig({
    totalProductsAdmin,
    totalOrders,
    pendingCount,
    approvedCount,
    intransitCount,
    deliveredCount,
    returnedCount,
    cancelledCount,
  });

  const renderMenuItem = (item, index) => {
    const itemContent = item.children ? (
      <Accordion style={{ boxShadow: "none" }} sx={accordionStyles}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel${index}-content`}
          id={`panel${index}-header`}
          className="p-2 flex items-center"
        >
          <Typography component="span">
            <div className="flex items-center gap-2">
              {item.icon} <span>{item.label}</span>
            </div>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul className={"space-y-2 pl-4"}>
            {item.children.map((child, childIndex) =>
              child.permission ? (
                <RequirePermission
                  key={childIndex}
                  permission={child.permission}
                  fallback={true}
                >
                  <li>
                    <Link to={child.to}>{child.label}</Link>
                  </li>
                </RequirePermission>
              ) : (
                <li key={childIndex}>
                  <Link to={child.to}>{child.label}</Link>
                </li>
              ),
            )}
          </ul>
        </AccordionDetails>
      </Accordion>
    ) : (
      <Link to={item.to} className="flex items-center gap-2">
        {item.icon}
        <span>{item.label}</span>
      </Link>
    );

    const listItemClass = item.children
      ? "space-x-2 px-2 rounded-md cursor-pointer"
      : "flex items-center space-x-2 p-2 rounded-md cursor-pointer";

    return item.permission ? (
      <RequirePermission
        key={index}
        permission={item.permission}
        match={item.match}
        fallback={true}
      >
        <li className={listItemClass}>{itemContent}</li>
      </RequirePermission>
    ) : (
      <li key={index} className={listItemClass}>
        {itemContent}
      </li>
    );
  };

  return (
    <div className="w-fit p-4 h-screen overflow-y-auto ">
      {menuConfig.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <ul className="space-y-1">
            {section.items.map((item, itemIndex) =>
              renderMenuItem(item, `${sectionIndex}-${itemIndex}`),
            )}
          </ul>
        </div>
      ))}

      {/* Logout and Others */}
      <div>
        <ul>
          <li className="flex items-center space-x-2 p-2 rounded-md text-red-500 cursor-pointer">
            <button
              onClick={handleLogout}
              className={"flex items-center space-x-2 cursor-pointer"}
            >
              <FaSignOutAlt /> <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
