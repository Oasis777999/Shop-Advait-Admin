import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../apis/api";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
  });

  console.log("Got Image", formData.heroImage);

  const [heroImage, setHeroImage] = useState([]);

  // Fetch product by ID on component mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/product/${id}`);
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        alert("Failed to load product details");
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: newValue });
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

    // Add hero Image in the form Data section
    formData = {
      ...formData,
      heroImage: heroImage,
    };

    try {
      await api.put(`/api/product/update/${id}`, formData);
      alert("Product updated successfully");
      navigate("/productlist"); // or wherever your list page is
    } catch (err) {
      console.error("Update product error:", err);
      alert("Failed to update product");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Update Product</h3>
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
              accept="image/*"
              multiple
              onChange={convertToBase64HeroImage}
            />
            {formData.heroImage?.length > 0 && (
              <div className="mt-2 flex gap-2 flex-wrap">
                {formData.heroImage.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Hero ${index}`}
                    className="rounded shadow-sm border m-1"
                    height={100}
                    width={100}
                    style={{ objectFit: "cover" }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-success">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
