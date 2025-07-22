import React, { useEffect, useState } from "react";
import api from "../apis/api";

const Profile = () => {
  const [customer, setCustomer] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerRes = await api.get(`/api/customer/profile/${id}`);
        setCustomer(customerRes.data);
      } catch (error) {
        console.error("Error loading profile or orders:", error);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (!customer)
    return <div className="container mt-5 text-center">Loading profile...</div>;

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div
        className="card shadow-lg border-0 rounded-4 p-4 bg-white"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        {/* Profile Image and Name */}
        <div className="text-center">
          <img
            src="https://via.placeholder.com/150"
            alt="Customer"
            className="img-fluid rounded-circle border shadow-sm"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
          <h4 className="mt-3 mb-0 text-primary fw-semibold">
            {customer.name}
          </h4>
          <hr />
        </div>

        {/* Profile Details */}
        <div className="px-2">
          <div className="mb-3">
            <label className="form-label fw-bold text-muted">Email:</label>
            <div className="d-flex align-items-center">
              <i className="bi bi-envelope-fill me-2 text-secondary"></i>
              <span>{customer.email}</span>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold text-muted">Mobile:</label>
            <div className="d-flex align-items-center">
              <i className="bi bi-telephone-fill me-2 text-secondary"></i>
              <span>{customer.mobile}</span>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold text-muted">Address:</label>
            <div className="d-flex align-items-start">
              <i className="bi bi-geo-alt-fill me-2 text-secondary mt-1"></i>
              <span>{customer.address}</span>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold text-muted">City:</label>
            <div className="d-flex align-items-center">
              <i className="bi bi-building me-2 text-secondary"></i>
              <span>{customer.city}</span>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold text-muted">State:</label>
            <div className="d-flex align-items-center">
              <i className="bi bi-globe2 me-2 text-secondary"></i>
              <span>{customer.state}</span>
            </div>
          </div>

          <div>
            <label className="form-label fw-bold text-muted">Pincode:</label>
            <div className="d-flex align-items-center">
              <i className="bi bi-mailbox me-2 text-secondary"></i>
              <span>{customer.pincode}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
