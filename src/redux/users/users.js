import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    userData: null,
    cartupdate:null,
    address:null,
    access: { expires: null, token: null },
    refresh: { expires: null, token: null },
    cartCount:0,
    lastpath:"/"
};


export const userSlice = createSlice({
    name: "userReducer",
    initialState,
    reducers: {
        setUser: (
            state,
            action
        ) => {
            return {
                ...state,
                userData: action.payload.user,
                access: action.payload.access,
                refresh: action.payload.refresh,
            };
        },
        
    },
});
// Action creators are generated for each case reducer function
export const {
    setUser,
   

} = userSlice.actions;
export default userSlice.reducer;