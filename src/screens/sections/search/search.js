import React, { useEffect, useState } from 'react';
import {
    View,
    ImageBackground,
    StatusBar, StyleSheet, KeyboardAvoidingView, ToastAndroid, BackHandler
} from 'react-native';
import LoaderKit from 'react-native-loader-kit';
import { images, icons, COLORS, FONTS, SIZES } from "../../../constants";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userLoginHanlder } from '../../../store/redux/userLogin';
import SearchScreen from './searchScreen';
import CourseList from './courseListSearch';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { courseListHandler } from '../../../store/redux/courseList';
import { cartHandler } from '../../../store/redux/cart';
import { useIsFocused } from "@react-navigation/core";
import NetInfo from '@react-native-community/netinfo';
import { getWishListDataHandler } from '../../../store/redux/getWishListData';

function handleBackButton() {
    console.log("BackHandler Function inside the search.js");
    BackHandler.exitApp();
    return true;
}

const Search = ({ navigation }) => {
    const dispatch = useDispatch();
    const allCourses = useSelector((state) => state.courseList?.data.data)
    const cartData = useSelector((state) => state.cartList?.data.data)
    const [isSearchLoader, setIsSearchLoader] = useState(false);
    const cartCount = useSelector((state) => state.cartList?.data.data);
    const [network, setNetwork] = useState('')
    const isFocused = useIsFocused();

    const initialLoading = async () => {
        let token = await AsyncStorage.getItem("loginToken");
        if (token) {
            dispatch(cartHandler(token)).then(unwrapResult)
                .then((originalPromiseResult) => {
                    // console.log("Inside the cartHandler............. ", originalPromiseResult)
                    dispatch(userLoginHanlder(token)).then(unwrapResult)
                        .then((originalPromiseResult) => {
                            // console.log("Inside the userLoginHanlder............. ", originalPromiseResult)
                            dispatch(getWishListDataHandler(token)).then((originalPromiseResult) => {
                                // console.log("Inside the getWishListDataHandler............. ", originalPromiseResult)
                            }).catch((rejectedValueOrSerializedError) => {
                                // console.log("Inside the catch of getWishListDataHandler............. ", rejectedValueOrSerializedError)
                                ToastAndroid.showWithGravity("Something went wrong, please try again later!", ToastAndroid.CENTER, ToastAndroid.LONG)
                            })
                        })
                        .catch((rejectedValueOrSerializedError) => {
                            ToastAndroid.showWithGravity("Something went wrong, please try again later!", ToastAndroid.CENTER, ToastAndroid.LONG)
                            // console.log("Inside the catch of userLoginHanlder............", rejectedValueOrSerializedError);
                        })
                })
                .catch((rejectedValueOrSerializedError) => {
                    ToastAndroid.showWithGravity("Something went wrong, please try again later!", ToastAndroid.CENTER, ToastAndroid.LONG)
                    // console.log("Inside the catch of cartHandler", rejectedValueOrSerializedError);
                })
        }

        dispatch(courseListHandler(token)).then(unwrapResult)
            .then((originalPromiseResult) => {
                console.log("Inside the response of courseListHandler..........", originalPromiseResult)
                if (originalPromiseResult == "error") {
                    console.log("Inside if condition...........", typeof (originalPromiseResult));
                    navigation.navigate("ServerError");
                }
                setIsSearchLoader(false);
            })
            .catch((rejectedValueOrSerializedError) => {
                navigation.navigate("ServerError");
                // ToastAndroid.showWithGravity("Something went wrong, please try again later!", ToastAndroid.CENTER, ToastAndroid.LONG)
                console.log("Inside the catch of courseListHandler................", rejectedValueOrSerializedError);
                setIsSearchLoader(false);
            })
    }

    useEffect(() => {
        if (isFocused) {
            setIsSearchLoader(true);
            NetInfo.refresh().then(state => {
                setNetwork(state.isConnected)
                if (state.isConnected) {
                    initialLoading();
                }
                else {
                    setIsSearchLoader(false);
                    navigation.navigate("NetworkError");
                }
            })
        }
    }, [isFocused, network])

    useEffect(() => {
        navigation.addListener("blur", () => { BackHandler.removeEventListener("hardwareBackPress", handleBackButton); })
        navigation.addListener("focus", () => { BackHandler.addEventListener("hardwareBackPress", handleBackButton); })
    }, [handleBackButton])

    return (
        <KeyboardAvoidingView style={styles.mainContainer}>
            <StatusBar
                animated={true}
                backgroundColor={COLORS.primary}
                style={{ marginBottom: "2%" }}
            />
            {Platform.OS == 'ios' ? <View style={{ backgroundColor: COLORS.primary, height: "1%" }} /> : null}
            {
                (!allCourses || isSearchLoader) ?
                    <View style={{ height: "100%", width: "100%", }}>
                        <ImageBackground source={images.LoginBgImage} resizeMode="repeat" style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center" }}>
                            <LoaderKit
                                style={{ width: 50, height: 50 }}
                                name={'BallPulse'}
                                size={50}
                                color={COLORS.primary}
                            />
                        </ImageBackground>
                    </View> :
                    <View style={{ height: "100%", width: "100%", position: 'relative' }}>
                        <View style={{ height: "11%", width: "100%", zIndex: 100 }}>
                            <SearchScreen isSearchLoader={isSearchLoader} setIsSearchLoader={setIsSearchLoader} cartCount={cartCount} />
                        </View>
                        <View style={{ width: "100%", paddingBottom: "6%", height: "92%" }}>
                            <CourseList allCourses={allCourses} cartData={cartData} />
                        </View>
                    </View>
            }

        </KeyboardAvoidingView>

    );
}
const styles = StyleSheet.create({
    mainContainer: {
        height: "100%",
        width: "100%",
    },
    listItem: {
        flex: 1,
        marginTop: ".5%",
        padding: 22,
        backgroundColor: COLORS.white,
        width: '100%',
        flexDirection: 'row',
        height: 130,
        lineHeight: "1.5",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderColor: "#FFF",
        paddingTop: 2,
        borderWidth: 1,
        borderRadius: 10,
    },
});
export default Search;