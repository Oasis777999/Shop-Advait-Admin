import React, { useState } from "react";
import api from "../apis/api";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  let [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    sku: "",
    shortDesc: "",
    status: false,
    sellPrice: "",
    costPrice: "",
    sequence: "",
    length: "",
    breadth: "",
    height: "",
    weight: "",
    colour: "",
    warranty: "",
    heroImage:""
  });
  
  const [ heroImage, setHeroImage ] = useState("");
  const navigate = useNavigate();

  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  function converToBase64HeroImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    const maxSize = 200 * 1024;

    if (file.size > maxSize) {
      alert("File size must be less than or equal to 200 KB.");
      setHeroImage("");
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setHeroImage(reader.result);
    };
    reader.onerror = (error) => {
      console.log("Error : ", error);
    };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting:", formData);

    try {      
      // Add hero Image in the form Data section
      formData = {
        ...formData,
        heroImage
      }

      const res = await api.post("/api/product/add", formData);
      alert("Product added successfully");
      navigate("/productlist"); // or wherever your list page is

      setFormData({
        name: "",
        category: "",
        brand: "",
        sku: "",
        shortDesc: "",
        status: false,
        sellPrice: "",
        costPrice: "",
        sequence: "",
        length: "",
        breadth: "",
        height: "",
        weight: "",
        colour: "",
        warranty: "",
      });
    } catch (err) {
      console.error("Add product error:", err.response?.data || err.message);
      alert(`Error: ${err.response?.data?.message || "Failed to add product"}`);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Add New Product</h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {[
            ["name", "Product Name"],
            ["category", "Category"],
            ["brand", "Brand"],
            ["sku", "SKU"],
            ["shortDesc", "Short Description"],
            ["sellPrice", "Selling Price"],
            ["costPrice", "Cost Price"],
            ["sequence", "Sequence"],
            ["colour", "Colour"],
            ["warranty", "Warranty"],
          ].map(([key, label]) => (
            <div className="col-md-6 mb-3" key={key}>
              <label className="form-label">{label}</label>
              <input
                type="text"
                className="form-control"
                name={key}
                value={formData[key]}
                onChange={handleChange}
              />
            </div>
          ))}

          {[
            ["length", "Length (cm)"],
            ["breadth", "Breadth (cm)"],
            ["height", "Height (cm)"],
            ["weight", "Weight (gm)"],
          ].map(([key, label]) => (
            <div className="col-md-3 mb-3" key={key}>
              <label className="form-label">{label}</label>
              <input
                type="number"
                className="form-control"
                name={key}
                value={formData[key]}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="col-md-3 mb-3">
            <label className="form-label d-block">Status</label>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleChange}
              />
              <label className="form-check-label">Active</label>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label d-block">Hero Image</label>
            <input
              type="file"
              className="form-control"
              name="heroImage"
              accept="image/*"
              onChange={converToBase64HeroImage}
              required
            />
            {heroImage && (
              <img
                src={heroImage}
                alt="Hero Image"
                className="mt-2 rounded shadow-sm border"
                height={100}
                width={100}
                style={{ objectFit: "cover" }}
              />
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
