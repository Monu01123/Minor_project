import { configureStore } from "@reduxjs/toolkit";
import appReducer from './slices/appSlice'
import categoryReducer from './slices/categorySlice';
import userReducer from './slices/userSlice'
const store=configureStore({
    reducer : {
        app : appReducer,
        categories: categoryReducer,
        user : userReducer,
    },
})

export default store