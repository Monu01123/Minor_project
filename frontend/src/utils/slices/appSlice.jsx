import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
    name : 'app',
    initialState : {
        loginPage : false,
        signUpPage : false,
    },
    reducers : {
        toggleLoginPage : (state,action)=>{
            state.loginPage = !state.loginPage;
        },
        toggleSignUpPage : (state,action)=>{
            state.signUpPage = !state.signUpPage;
        },
    },
})

export const {toggleLoginPage,toggleSignUpPage}=appSlice.actions
export default appSlice.reducer