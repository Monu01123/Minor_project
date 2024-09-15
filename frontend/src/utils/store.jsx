import { configureStore } from "@reduxjs/toolkit";
import appReducer from './slices/appSlice'
import categoryReducer from './slices/categorySlice';
const store=configureStore({
    reducer : {
        app : appReducer,
        categories: categoryReducer,
    },
})

export default store