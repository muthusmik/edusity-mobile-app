import { createSlice,  } from '@reduxjs/toolkit';


export const geoLocationSlice=createSlice({
    name:"geoLocationPicker",
    initialState:{
        latitude:"",
        longitude:"",
        countryCode:"",
        currencyType:""
       
    },
    reducers:{
        latitudeSet:(state,action)=>{
            state.latitude=action.payload;
        },
        longitudeSet:(state,action)=>{
            state.longitude=action.payload;   
        },
        countryCodeSet:(state,action)=>{
            state.countryCode=action.payload;
        },
        currencyTypeSet:(state,action)=>{
            state.currencyType=action.payload;
        },
      
    }  
});

export const {latitudeSet,longitudeSet,countryCodeSet,currencyTypeSet}=geoLocationSlice.actions;

export default geoLocationSlice.reducer;