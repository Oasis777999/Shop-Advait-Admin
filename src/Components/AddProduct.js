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
    heroImage: [],
    boxContent: [],
  });

  const [heroImage, setHeroImage] = useState([]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleBoxContentChange = (e) => {
    const { value, checked } = e.target;

    setFormData((prev) => {
      if (checked) {
        return {
          ...prev,
          boxContent: [...prev.boxContent, value],
        };
      } else {
        return {
          ...prev,
          boxContent: prev.boxContent.filter((item) => item !== value),
        };
      }
    });
  };

  function convertToBase64HeroImage(e) {
    const files = Array.from(e.target.files);
    const maxSize = 200 * 1024;

    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        if (file.size > maxSize) {
          reject(`${file.name} exceeds 200 KB.`);
          return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    });

    Promise.all(promises)
      .then((base64Images) => {
        setHeroImage((prevImages) => [...prevImages, ...base64Images]); // Make sure heroImage is an array state
      })
      .catch((error) => {
        alert(error);
        console.log("Conversion Error:", error);
        setHeroImage([]);
      });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting:", formData);

    try {
      // Add hero Image in the form Data section
     const submitData = {
        ...formData,
        heroImage,
      };

      const res = await api.post("/api/product/add", submitData);
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
        heroImage: [],
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

          <div className="col-md-12 mb-3">
            <label className="form-label d-block">Box Content</label>
            <div className="row">
              {["Device", "SIM Card", "Cable", "User Manual", "Adaptor"].map(
                (item) => (
                  <div className="form-check col-md-2" key={item}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`box-${item}`}
                      value={item}
                      checked={formData.boxContent.includes(item)}
                      onChange={handleBoxContentChange}
                    />
                    <label className="form-check-label" htmlFor={`box-${item}`}>
                      {item}
                    </label>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label d-block">Hero Image</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={convertToBase64HeroImage}
            />
            {heroImage?.length > 0 && (
              <div className="mt-2 flex gap-2 flex-wrap">
                {heroImage.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Hero ${index}`}
                    className="rounded shadow-sm border"
                    height={100}
                    width={100}
                    style={{ objectFit: "cover" }}
                  />
                ))}
              </div>
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
