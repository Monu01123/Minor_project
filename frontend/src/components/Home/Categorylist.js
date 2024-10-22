import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./HomePage.css"; 

function HomePage() {
  const [categories, setCategories] = useState([]);
  const location = useLocation(); 

  useEffect(() => {
    axios
      .get("http://localhost:8080/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

 
  const isActiveCategory = (categoryId) => {
    return location.pathname.includes(`/category/${categoryId}`);
  };

  return (
    <>
      <div className="category-container">
        {categories.map((category) => (
          <Link
            key={category.category_id}
            to={`/category/${category.category_id}`}
            className={`category-button ${isActiveCategory(category.category_id) ? "active" : ""}`}
          >
            <div className="category-text">{category.name}</div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default HomePage;
