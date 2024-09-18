import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name : "user",
    initialState : {
        username : null,
    },
    reducers : {
        updateusername : (state,action)=>{
            state.username = action.payload;
        }
    }
})