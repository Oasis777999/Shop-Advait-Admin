import React, { useEffect, useState } from "react";
import api from "../apis/api";
import { generateInvoicePDF } from "./InvoicePage";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/api/order/list"); // You should have this backend route
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        alert("Failed to load orders");
      }
    };

    fetchOrders();
  }, []);

const handleStatusChange = async (id, newStatus) => {
  try {
    await api.put(`/api/order/update-status/${id}`, { status: newStatus });
    alert("order status updated")

    setOrders((prev) =>
      prev.map((order) =>
        order._id === id ? { ...order, status: newStatus } : order
      )
    );
  } catch (error) {
    console.error("Status update failed", error);
    alert("Status update failed");
  }
};


  const statusColor = (status) => {
    switch (status) {
      case "New Order":
        return "secondary";
      case "In-Process":
        return "warning";
      case "Out for Delivery":
        return "info";
      case "Delivered":
        return "success";
      case "Cancelled":
        return "danger";
      default:
        return "primary";
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">All Orders</h3>

      {orders.length === 0 ? (
        <p className="text-muted">No orders placed yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Order ID</th>
                <th>Product Name</th>
                <th>Customer</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Placed On</th>
                <th>Total Amount</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={order._id}>
                  <td>{idx + 1}</td>
                  <td>{order._id}</td>
                  <td>{order.product.map((item) => item.name).join(", ")}</td>
                  <td>
                    {order.billingData?.name} <br />
                    <small>{order.billingData?.phone}</small>
                  </td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <select
                      className={`form-select form-select-sm border border-${statusColor(
                        order.status
                      )}`}
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                    >
                      <option value="New Order">New Order</option>
                      <option value="In-Process">In-Process</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.sellTotalPrice} ₹</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-dark"
                      onClick={() => generateInvoicePDF(order)}
                    >
                      <i className="bi bi-download me-1"></i> Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
