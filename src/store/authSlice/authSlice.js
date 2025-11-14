import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from 'axios'

const initialState ={
isAuthenticated : false,
isLoading:true,
user:null
}

  

export const registerUser = createAsyncThunk ('/auth/register',

async(registerData)=>{
    const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        registerData,
        {
            withCredentials:true,
        }           
    )
    return response.data;
}
)

//login user
export const loginUser = createAsyncThunk ('/auth/login', 

async(loginData)=>{
    const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        loginData,
        {
            withCredentials:true,
        }           
    )
    return response.data;
}
)   

//middleware asyncthunk
export const checkAuth = createAsyncThunk ('/auth/checkAuth',

async()=>{
    const response = await axios.get(
        "http://localhost:5000/api/auth/checkAuth",
        {
            withCredentials:true,
            headers:{
                'cache-control': 'no-store,no-cache,proxy-validate,must-revalidate',
            }
        }           
    )
    return response.data;
}
)

const authSlice  =  createSlice({
name:"auth",
initialState,
reducers:{
setUsers:(state,action)=>{
}
},
extraReducers: (builder) =>{
builder
.addCase(registerUser.pending,(state)=>{
    state.isLoading = true;
}).addCase(registerUser.fulfilled,(state,action)=>{
    state.isLoading =false;
    state.user = action.payload;
    state.isAuthenticated = false;
}).addCase(registerUser.rejected,(state)=>{
    state.isLoading = false;
    state.user = null;
    state.isAuthenticated = null;
})
.addCase(loginUser.pending,(state)=>{
    state.isLoading = true;
}).addCase(loginUser.fulfilled,(state,action)=>{
    state.isLoading =false;
    state.user  = action.payload.user;
    state.isAuthenticated = true;
}).addCase(loginUser.rejected,(state)=>{
    state.isLoading = false;
    state.user = null;
    state.isAuthenticated = false;
}).addCase(checkAuth.pending,(state)=>{
    state.isLoading = true;
}).addCase(checkAuth.fulfilled,(state,action)=>{
    state.isLoading =false;
    state.user  = action.payload.user;
    state.isAuthenticated = true;
}).addCase(checkAuth.rejected,(state)=>{
    state.isLoading = false;
    state.user = null;
    state.isAuthenticated = false;
})
}

})

export const {setUsers} = authSlice.actions;
export default authSlice.reducer;