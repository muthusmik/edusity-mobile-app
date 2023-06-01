import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, PermissionsAndroid, Platform, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { COLORS, FONTS, icons, images } from '../constants';
import { RFValue } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo';
import { useIsFocused } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import * as RNLocalize from "react-native-localize";
import { latitudeSet, longitudeSet, countryCodeSet, currencyTypeSet } from '../store/redux/geoLocation';
import { useDispatch } from 'react-redux';
import { getModeForUsageLocation } from 'typescript';
import axios from 'axios';

const SplashScreen = (props) => {

  const [authLoaded, setAuthLoaded] = useState(false);
  const [animationLoaded, setAnimationLoaded] = useState(false);
  const navigation = useNavigation();
  const [network, setNetwork] = useState('')
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const unsubscribe = () => {
    NetInfo.addEventListener(state => {
      setNetwork(state)
      if (state.isConnected) {
        setAuthLoaded(true);
        setAnimationLoaded(true);
      }
      else {
        navigation.navigate("NetworkError");
      }
    })
  }

  const getLocation = async () => {
    // const locale = RNLocalize.getCountry();
    // const currency = RNLocalize.getCurrencies()[0];
    Geolocation.getCurrentPosition(
      async (position) => {
        dispatch(latitudeSet(position.coords.latitude));
        dispatch(longitudeSet(position.coords.longitude));
        const response = await axios.get(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
        );
        if (response?.data?.countryCode) {
          const currencyResponse = await axios.get(
            `https://restcountries.com/v3/alpha/${response?.data?.countryCode}`
          );
          dispatch(countryCodeSet(response.data.countryCode))
          dispatch(currencyTypeSet(Object.keys(currencyResponse.data[0].currencies)[0]))
        }
        // const currencyResponse = await axios.get(
        //   `https://restcountries.com/v3/alpha/${response?.data?.countryCode}`
        // );
        // dispatch(countryCodeSet(response.data.countryCode))
        // dispatch(currencyTypeSet(Object.keys(currencyResponse.data[0].currencies)[0]))
        unsubscribe();
      },
      (error) => {
        console.log("Error in getting Location details.......error code", error.code, "error message", error.message);
        console.log("Inside error of splash screen Country code..............................", RNLocalize.getLocales()[1] ? RNLocalize.getLocales()?.[1]?.countryCode : RNLocalize.getLocales()?.[0]?.countryCode);
        console.log("Inside error of splash screen Currencies..............................", RNLocalize.getCurrencies()[1] ? RNLocalize.getCurrencies()?.[1] : RNLocalize.getCurrencies()?.[0]);
        dispatch(countryCodeSet(RNLocalize.getLocales()[1] ? RNLocalize.getLocales()?.[1]?.countryCode : RNLocalize.getLocales()?.[0]?.countryCode));
        dispatch(currencyTypeSet(RNLocalize.getCurrencies()[1] ? RNLocalize.getCurrencies()?.[1] : RNLocalize.getCurrencies()?.[0]));
        unsubscribe();
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        const PermissionLocation = async () => {
          if (Platform.OS == 'android') {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: 'Location Access Required',
                message: 'This App needs to Access your location',
              },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.log("Location Access provided");
              getLocation();
            } else {
              unsubscribe();
              // navigation.navigate('Login');
              console.log("cancelled")
            }
          } else if (Platform.OS == 'ios') {
            getLocation();
          }
        }
        PermissionLocation()
      }, 4000);
    }
  }, [isFocused]);

  const onAnimationFinish = () => {
    setAnimationLoaded(true);
  };

  useEffect(() => {
    const navigateHandler = async () => {
      // await  AsyncStorage.removeItem("loginToken");
      if (authLoaded && animationLoaded) {
        let Token = await AsyncStorage.getItem("loginToken");
        if (Token) {
          props.navigation.replace('Home', { screen: 'DashBoard' });
        } else {
          ;
          props.navigation.replace('Home', { screen: 'Search' });
        }
      }
    }
    navigateHandler();
  }, [authLoaded, animationLoaded, props.navigation]);

  return (
    <View style={styles.root}>
      <Image
        source={icons.Edusitylogo}
        resizeMode="contain"
        style={{
          width: '50%',
          height: '10%',
        }}
      />
      <Text style={{ color: COLORS.black, fontSize: RFValue(15), fontFamily: "Roboto-Black" }}>Edusity-Virtual for Greater Learning...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white
  },
});

export default SplashScreen;