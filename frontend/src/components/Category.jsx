import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { setCategories, setLoading, setError } from '../utils/slices/categorySlice';

const Category = () => {
  const dispatch = useDispatch();
  const { categories, status, error } = useSelector(state => state.categories);
  const [activeCategoryId, setActiveCategoryId] = useState(null);  // State to track the active category ID

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        dispatch(setLoading());
        const response = await axios.get('http://localhost:8080/categories');
        // Store both category names and IDs
        const categoryData = response.data.map(category => ({
          id: category.category_id,
          name: category.name
        }));
        dispatch(setCategories(categoryData));
      } catch (err) {
        dispatch(setError(err.message));
      }
    };

    fetchCategories();
  }, [dispatch]);

  const handleCategoryClick = (categoryId) => {
    setActiveCategoryId(categoryId);  // Set the clicked category ID as active
  };

  if (status === 'loading') {
    return <p>Loading categories...</p>;
  }

  if (status === 'failed') {
    return <p>Error: {error}</p>;
  }

  return (
    <div className='bg-white shadow-2xl rounded-lg p-3 max-w-screen-lg mx-auto flex items-center mt-4 mb-2 border border-gray-300'>
      <div className='mx-auto'>
        {categories.map((category) => (
          <Link key={category.id} to={`/courses/${category.id}`}>
            <button
              onClick={() => handleCategoryClick(category.id)}
              className={`m-1 p-2 rounded-lg font-sans text-sm font-bold ${
                activeCategoryId === category.id ? 'bg-[#2D2F31] text-white' : 'bg-gray-200 text-black hover:bg-gray-300'
              }`}
            >
              {category.name}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Category;
