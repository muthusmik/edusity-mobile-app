// React Native Geolocation
// https://aboutreact.com/react-native-geolocation/
 
// import React in our code
import React, {useState, useEffect} from 'react';
 
// import all the components we are going to use
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Platform,
  Button,
} from 'react-native';
 
//import all the components we are going to use.
import Geolocation from '@react-native-community/geolocation';
import { useDispatch } from 'react-redux';
import Geocoder from 'react-native-geocoding';
import { COLORS } from '../constants';
import { useNavigation } from '@react-navigation/native';
import { latitudeSet,longitudeSet } from '../store/redux/geoLocation';
 
const GeolocationFetcher =props=> {
    const [
        currentLongitude,
        setCurrentLongitude
      ] = useState('...');
      const [
        currentLatitude,
        setCurrentLatitude
      ] = useState('...');
      const [
        locationStatus,
        setLocationStatus
      ] = useState('');
     const navigation=useNavigation();
     const dispatch=useDispatch();
      useEffect(() => {
        const requestLocationPermission = async () => {
          if (Platform.OS === 'ios') {
            getOneTimeLocation();
            // subscribeLocationLocation();
          } else {
            try {
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                  title: 'Location Access Required',
                  message: 'This App needs to Access your location',
                },
              );
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                //To Check, If Permission is granted
                getOneTimeLocation();
                 subscribeLocationLocation();
              } else {
                setLocationStatus('Permission Denied');
                // navigation.navigate('Login');
                console.log("cancelled")
              }
            } catch (err) {
              console.warn(err);
            }
          }
        };
        requestLocationPermission();
        return () => {
          Geolocation.clearWatch(watchID);
          // props.navigation.replace('Login',{position});
        };
      }, []);
     
      const getOneTimeLocation = () => {
        // setLocationStatus('Getting Location ...');
        Geolocation.getCurrentPosition(
          //Will give you the current location
          (position) => {
            console.log("inside getlocation")
            dispatch(longitudeSet(position.coords.longitude));
            dispatch(latitudeSet(position.coords.latitude));
            setLocationStatus('You are Here');
     
            //getting the Longitude from the location json
            const currentLongitude = 
              JSON.stringify(position.coords.longitude);
     
            //getting the Latitude from the location json
            const currentLatitude = 
              JSON.stringify(position.coords.latitude);
     
            //Setting Longitude state
            setCurrentLongitude(currentLongitude);
            
            //Setting Longitude state
            setCurrentLatitude(currentLatitude);
            // props.navigation.replace('Login',position);
          },
          (error) => {
            console.log(error.message);
          },
          {
            enableHighAccuracy: false,
            timeout: 30000,
            maximumAge: 1000
          },
        );
    //    
    
    }
     
      const subscribeLocationLocation = () => {
        watchID = Geolocation.watchPosition(
          (position) => {
            //Will give you the location on location change
            
            setLocationStatus('You are Here');
            console.log(position);
     
            //getting the Longitude from the location json        
            const currentLongitude =
              JSON.stringify(position.coords.longitude);
     
            //getting the Latitude from the location json
            const currentLatitude = 
              JSON.stringify(position.coords.latitude);
     
            //Setting Longitude state
            setCurrentLongitude(currentLongitude);
     
            //Setting Latitude state
            setCurrentLatitude(currentLatitude);
          },
          (error) => {
            setLocationStatus(error.message);
          },
          {
            enableHighAccuracy: false,
            maximumAge: 1000
          },
        );
      };
     
      return (
        <SafeAreaView style={{flex: 1}}>
        
        </SafeAreaView>
      );
    };
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boldText: {
    fontSize: 25,
    color: 'red',
    marginVertical: 16,
  },
});
 
export default GeolocationFetcher;
