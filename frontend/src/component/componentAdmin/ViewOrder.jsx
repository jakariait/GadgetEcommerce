import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useGeneralInfoStore from "../../store/GeneralInfoStore";
import ImageComponent from "../componentGeneral/ImageComponent.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useRef } from "react";
import OrderStatusUpdate from "./OrderStatusUpdate.jsx";
import CourierStats from "./CourierStats.jsx";
import RequirePermission from "./RequirePermission.jsx";

// Import your VITE API URL
const apiUrl = import.meta.env.VITE_API_URL;

const ViewOrder = () => {
  const printRef = useRef(null);

  const handlePrint = () => {
    const content = document.getElementById("print-area");
    if (!content) return;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
    <html>
      <head>
        <title>Print Invoice</title>
        <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 12pt;      /* good size for print */
          line-height: 1;     /* comfortable line height */
          margin: 20px;
        }

        h1 {
          font-size: 24px;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 10px;
          border: 1px solid #ddd;
          text-align: left;
        }
        img{
        width: 100px;
        }
         #firstRow, #secondRow{
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
         }
          #thirdRow{
            display: flex;
            justify-content: space-between;
            margin-top: 20px;

          }
          button{
          display: none;
          }
          #thirdRowRight, #secondRowRight{
          text-align: right;
          }
        </style>
      </head>
      <body>
        ${content.innerHTML}
      </body>
    </html>
  `);
    doc.close();

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    };
  };

  const { GeneralInfoList } = useGeneralInfoStore();

  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return { color: "orange", text: "Pending" };
      case "intransit":
        return { color: "blue", text: "In Transit" };
      case "approved":
        return { color: "teal", text: "Approved" };
      case "delivered":
        return { color: "green", text: "Delivered" };
      case "cancelled":
        return { color: "red", text: "Cancelled" };
      case "returned":
        return { color: "purple", text: "Returned" }; // Text for returned
      default:
        return { color: "gray", text: "Unknown" };
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "unpaid":
        return { color: "orange", text: "Unpaid" };

      case "paid":
        return { color: "green", text: "Paid" };

      default:
        return { color: "gray", text: "Unknown" };
    }
  };

  // Helper function to display human-readable payment method
  const getPaymentMethodText = (paymentMethod) => {
    switch (paymentMethod) {
      case "cash_on_delivery":
        return "Cash on Delivery";
      case "bkash":
        return "bKash";
      case "nagad":
        return "Nagad";
      case "card":
        return "Card";
      default:
        return "Unknown Method";
    }
  };

  const getDeliveryMethodText = (paymentMethod) => {
    switch (paymentMethod) {
      case "home_delivery":
        return "Home Delivery";
      default:
        return "Unknown Method";
    }
  };

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not authenticated.");
        setLoading(false);
        return;
      }

      const res = await axios.get(`${apiUrl}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrder(res.data.order);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch order details.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!order) return <div className="p-4">Order not found.</div>;

  const orderStatusColor = getStatusColor(order?.orderStatus);
  const paymentStatusColor = getPaymentStatusColor(order?.paymentStatus);

  return (
    <div>
      <div id="print-area" ref={printRef} className=" p-4 shadow rounded-lg">
        <div id="firstRow" className={"flex justify-between items-center mb-5"}>
          <h1 className={"text-2xl"}>{GeneralInfoList?.CompanyName}</h1>
          <div>
            <ImageComponent
              imageName={GeneralInfoList?.PrimaryLogo}
              className={"w-30"}
            />
          </div>
          <div className={"text-2xl"}>
            <h1>Invoice</h1>
          </div>
        </div>
        <div id="secondRow" className="flex justify-between">
          {/* Shipping Info Section */}
          <div>
            <h2 className="font-bold text-xl">Shipping Info:</h2>
            <div className="flex flex-col gap-0.5">
              <p>{order?.shippingInfo?.fullName}</p>
              <p>{order?.shippingInfo?.mobileNo}</p>
              <p>{order?.shippingInfo?.email}</p>
              <p>{order?.shippingInfo?.address}</p>
            </div>
          </div>

          {/* Order Details Section */}
          <div id="secondRowRight" className="flex flex-col gap-2">
            <div className="flex justify-between flex-col gap-0.5 text-right">
              <p>
                <strong>Order No:</strong> {order?.orderNo}
              </p>
              <p>
                <strong>Order Date:</strong>{" "}
                {order?.orderDate
                  ? new Date(order.orderDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color: orderStatusColor.color,
                  }}
                >
                  {orderStatusColor.text}
                </span>
              </p>
              <p>
                <strong>Payment Method:</strong>{" "}
                {getPaymentMethodText(order?.paymentMethod)}
              </p>
              <p>
                <strong>Payment Status:</strong>{" "}
                <span
                  style={{
                    backgroundColor: paymentStatusColor.backgroundColor,
                    color: paymentStatusColor.color,
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                  className={"text-sm"}
                >
                  {paymentStatusColor.text}
                </span>
              </p>
              {order?.paymentId && (
                <p>
                  <strong>Payment ID:</strong>{" "}
                  <span className="text-sm">{order?.paymentId}</span>
                </p>
              )}

              {order?.transId && (
                <p>
                  <strong>Transaction ID:</strong> {order?.transId}
                </p>
              )}

              <p>
                <strong>Delivery Method:</strong>{" "}
                {getDeliveryMethodText(order?.deliveryMethod)}
              </p>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="mt-6">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>SL</TableCell>
                  <TableCell>Item</TableCell>
                  <TableCell>Variant</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Unit Cost</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(order?.items || []).map((item, index) => {
                  const product = item?.productId;
                  const variant = product?.variants?.[0];
                  const price = item?.price || 0;
                  const quantity = item?.quantity || 0;
                  const totalPrice = price * quantity;

                  return (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div>
                          <div>{product?.name || "N/A"}</div>
                          <div>
                            Category: {product?.category?.name || "N/A"}
                          </div>
                          <div>Code: {product?.productCode || "N/A"}</div>
                        </div>
                      </TableCell>
                      <TableCell>{variant?.sizeName || "N/A"}</TableCell>
                      <TableCell>{quantity}</TableCell>
                      <TableCell>{price.toFixed(2)}</TableCell>
                      <TableCell>{totalPrice.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div id="thirdRow" className="mt-6 p-1 flex justify-between ">
          <div>
            <h1>Billing Address:</h1>
            <div>
              <p>{order?.shippingInfo?.fullName}</p>
              <p>{order?.shippingInfo?.address}</p>
            </div>
          </div>
          <div id="thirdRowRight" className="flex flex-col gap-2 items-end">
            <p>
              Sub-total: Tk.{(order?.subtotalAmount || 0).toFixed(2)}
            </p>
            {order?.promoDiscount ? (
              <p>
                Promo Discount: Tk.{(order?.promoDiscount || 0).toFixed(2)}
              </p>
            ) : null}

            {order?.rewardPointsUsed ? (
              <p>Reward Points Used: {order?.rewardPointsUsed}</p>
            ) : null}

            {order?.vat ? (
              <p>VAT/TAX: {(order?.vat || 0).toFixed(2)}</p>
            ) : null}

            <p>
              Delivery Charge: {(order?.deliveryCharge || 0).toFixed(2)}
            </p>
            {order?.specialDiscount ? (
              <p>
                Special Discount Amount:{" "}
                {(order?.specialDiscount || 0).toFixed(2)}
              </p>
            ) : null}
            <p className={"text-2xl"}>
              Total Order Amount: {(order?.totalAmount || 0).toFixed(2)}
            </p>
            {order?.advanceAmount ? (
              <p className={"text-red-500"}>
                Advance: {(order?.advanceAmount || 0).toFixed(2)}
              </p>
            ) : null}

            <p className={"text-2xl"}>
              Total Due Amount: {(order?.dueAmount || 0).toFixed(2)}
            </p>
            <div className="flex justify-end mb-4">
              <button
                onClick={handlePrint}
                className="primaryBgColor accentTextColor cursor-pointer font-bold py-2 px-4 rounded"
              >
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <RequirePermission permission="edit_orders">
          {order?._id && (
            <OrderStatusUpdate orderId={order._id} onUpdate={fetchOrder} />
          )}
        </RequirePermission>
      </div>
      <div className="mt-6">
        {order?.shippingInfo?.mobileNo && (
          <CourierStats phone={order.shippingInfo.mobileNo} />
        )}
      </div>
    </div>
  );
};

export default ViewOrder;
