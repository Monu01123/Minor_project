import React, { useEffect, useState } from "react";
import "../instructor/dashboard.css";
import axiosInstance from "../../axiosconfig";
import Navbar from "../Home/NavBar";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddOrUpdateCategory = async (e) => {
    e.preventDefault();
    const categoryData = { name, description };

    try {
        // Fetch the token from localStorage (if not already done in the axios instance config)
        const token = JSON.parse(localStorage.getItem("auth"))?.token;
        
        // Include Authorization header with Bearer token
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        if (editId) {
            await axiosInstance.put(`/categories/${editId}`, categoryData, { headers });
        } else {
            await axiosInstance.post("/categories", categoryData, { headers });
        }

        fetchCategories();
        resetForm();
    } catch (error) {
        console.error("Error saving category:", error);
    }
};


  const handleEditCategory = (category) => {
    setName(category.name);
    setDescription(category.description);
    setEditId(category.category_id);
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axiosInstance.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditId(null);
  };

  return (
    <>
    <Navbar />
      <div className="category-management">
        <h2>Category Management</h2>
        <form onSubmit={handleAddOrUpdateCategory}>
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <button type="submit">
            {editId ? "Update Category" : "Add Category"}
          </button>
        </form>

        <h3>Categories List</h3>
        <ul>
          {categories.map((category) => (
            <li key={category.category_id}>
              <span>{category.name}</span>
              <span>{category.description}</span>
              <div>
                <button onClick={() => handleEditCategory(category)}>
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.category_id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default CategoryManagement;
