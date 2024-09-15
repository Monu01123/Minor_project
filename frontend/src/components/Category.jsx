import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setCategories, setLoading, setError } from '../utils/slices/categorySlice';

const Category = () => {
  const dispatch = useDispatch();
  const { categories, status, error } = useSelector(state => state.categories);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        dispatch(setLoading());  // Set loading state
        const response = await axios.get('http://localhost:8080/categories');
        const categoryNames = response.data.map(category => category.name); // Extract only category names
        dispatch(setCategories(categoryNames));  // Dispatch action to set categories
      } catch (err) {
        dispatch(setError(err.message));  // Dispatch error action
      }
    };

    fetchCategories();
  }, [dispatch]);

  if (status === 'loading') {
    return <p>Loading categories...</p>;
  }

  if (status === 'failed') {
    return <p>Error: {error}</p>;
  }

  return (
    <div className='bg-white shadow-2xl rounded-lg p-3 max-w-screen-lg mx-auto flex items-center mt-4 mb-2 border border-gray-300'>
      <div className='mx-auto'>
        {categories.map((category, index) => (
          <button
            key={index}
            className='bg-gray-200 text-black m-1 p-2 rounded-lg font-sans text-sm font-bold hover:bg-gray-300'
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Category;
