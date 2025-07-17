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

  let [heroImage, setHeroImage] = useState([]);
  console.log(heroImage);

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

  const handleRemoveImage = async (indexToRemove) => {
    const imageToDelete = formData.heroImage[indexToRemove]; // Get the image URL at the given index
    console.log(imageToDelete); // Debug log (optional)
    console.log(id);

    try {
      const res = await api.patch(
        `/api/product/delete-image/${id}`, // Calls the backend API with the product ID
        { imageToDelete } // Sends image name/URL to delete
      );

      // Update the local component state with the updated image array returned from backend
      setFormData((prev) => ({
        ...prev,
        heroImage: res.data.heroImage,
      }));

      alert("Image removed successfully");
    } catch (error) {
      console.error("Error deleting image:", error); // Logs error for debugging
      alert("Failed to remove image");
    }
  };

  // Remove image from new images array
  const removeFromHeroImage = (index) => {
    setHeroImage((prev) => prev.filter((_, i) => i !== index));
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
            ["sequence", "Sequence"],
            ["colour", "Colour"],
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
            ["sellPrice", "Selling Price"],
            ["costPrice", "Cost Price"],
            ["warranty", "Warranty"],
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
            <label className="form-label d-block">Hero Image</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={convertToBase64HeroImage}
              className="form-control"
            />
            <div className="row mt-4">
              <div className="col-md-6">
                <h5>Uploaded Images</h5>
                {formData.heroImage?.length > 0 && (
                  <div className="mt-2 d-flex flex-wrap gap-2">
                    {formData.heroImage.map((img, index) => (
                      <div
                        key={index}
                        className="position-relative border rounded shadow-sm me-2 mb-2"
                        style={{ width: 100, height: 100, overflow: "hidden" }}
                      >
                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="position-absolute top-0 end-0 bg-danger text-white rounded-circle d-flex align-items-center justify-content-center shadow"
                          style={{
                            width: "20px",
                            height: "20px",
                            fontSize: "12px",
                            cursor: "pointer",
                            zIndex: 2,
                          }}
                        >
                          ×
                        </button>

                        {/* Image */}
                        <img
                          src={img}
                          alt={`Hero ${index}`}
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                            borderRadius: "0.25rem",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-md-6">
                <h5>Newly Added Images</h5>
                <div className="d-flex flex-wrap gap-2">
                  {heroImage?.map((img, index) => (
                    <div
                      key={index}
                      className="position-relative border rounded"
                      style={{ width: 100, height: 100, overflow: "hidden" }}
                    >
                      <button
                        type="button"
                        onClick={() => removeFromHeroImage(index)}
                        className="position-absolute top-0 end-0 bg-danger text-white rounded-circle"
                        style={{
                          width: "20px",
                          height: "20px",
                          fontSize: "12px",
                          zIndex: 2,
                        }}
                      >
                        ×
                      </button>
                      <img
                        src={img}
                        alt="New"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
