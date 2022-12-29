import { createSlice,  } from '@reduxjs/toolkit';


export const geoLocationSlice=createSlice({
    name:"geoLocationPicker",
    initialState:{
        latitude:"Chennai",
        longitude:"Coimbatore",
       
    },
    reducers:{
        latitudeSet:(state,action)=>{
            state.latitude=action.payload;
        },
        longitudeSet:(state,action)=>{
            state.longitude=action.payload;   
        },
      
    }  
});

export const {latitudeSet,longitudeSet}=geoLocationSlice.actions;

export default geoLocationSlice.reducer;