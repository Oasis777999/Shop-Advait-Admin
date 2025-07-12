import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../apis/api";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/api/product/list");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err.message);
        alert("Failed to load product list.");
      }
    };

    fetchProducts();
  }, []);

  const handleUpdate = (id) => {
    navigate(`/updateproduct/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      const res = await api.delete(`/api/product/delete/${id}`);
      if (res.status === 200) {
        alert("Product deleted successfully");
        setProducts((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      console.error("Delete error:", err.message);
      alert("Error occurred while deleting the product");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Product List</h3>
        <button className="btn btn-primary" onClick={() => navigate("/addproduct")}>
          <i className="bi bi-plus-circle me-2"></i> Add Product
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Product ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Selling Price</th>
              <th>Cost Price</th>
              <th>Warranty</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((prod, index) => (
                <tr key={prod._id}>
                  <td>{index + 1}</td>
                  <td>{prod._id}</td>
                  <td>{prod.name}</td>
                  <td>{prod.category}</td>
                  <td>{prod.brand}</td>
                  <td>{prod.sellPrice} ₹</td>
                  <td>{prod.costPrice} ₹</td>
                  <td>{prod.warranty} Years</td>
                  <td>
                    <span className={`badge ${prod.status ? "bg-success" : "bg-secondary"}`}>
                      {prod.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleUpdate(prod._id)}
                    >
                      <i className="bi bi-pencil-square"></i> Update
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(prod._id)}
                    >
                      <i className="bi bi-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-muted">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
