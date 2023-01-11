import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    StatusBar,
    Pressable,
    BackHandler,
} from 'react-native';

import LoaderKit from 'react-native-loader-kit'
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch, } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { unwrapResult } from '@reduxjs/toolkit';
import { userLoginHanlder } from '../../../store/redux/userLogin';
import { cartHandler } from '../../../store/redux/cart';
import { images, icons, COLORS, FONTS, SIZES } from '../../../constants';
import { ActivityIndicator } from 'react-native-paper';
import StudentDashboard from './studentDashboard';
import Icon from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectDropdown from 'react-native-select-dropdown';
import { useIsFocused } from "@react-navigation/core";
import Toast from 'react-native-simple-toast';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import NetInfo from '@react-native-community/netinfo';

const Dashboard = () => {
    // console.log("iam inside DashBoard");
    const dispatch = useDispatch();
    const navigation = useNavigation();
    // const logiParam = route.params;
    const [loader, setLoader] = useState(false);
    const [userName, setUserName] = useState();
    const [drop, setDrop] = useState(false);
    // console.log("As params=---->", logiParam)
    const LoginData = useSelector(state => state.userLoginHandle.data)
    // console.log("LoginReduxData->", LoginData?.data?.role);
    const isFocused = useIsFocused();
    const [network, setNetwork] = useState('')





    useEffect(() => {
        // console.log("done and dusted..........", LoginData)
        if (LoginData) {
            if (LoginData?.data?.LastName) {
                setUserName(LoginData?.data?.firstName + LoginData?.data?.LastName)
            } else {
                setUserName(LoginData?.data?.firstName)
            }
        }
    }, [LoginData]);


    useEffect(() => {
        if (isFocused) {
            // console.log("dashbord return")
            NetInfo.fetch().then(state => {
                setNetwork(state.isConnected)
                if (state.isConnected) {
                    initialLoading();
                }
                else {
                    navigation.navigate("NetworkError");
                }
            })
            const initialLoading = async () => {
                let token = await AsyncStorage.getItem("loginToken");
                if (token) {
                    setLoader(true);
                    dispatch(userLoginHanlder(token)).then(unwrapResult)
                        .then((originalPromiseResult) => {
                            // console.log("successfully returned to login with response ", originalPromiseResult);
                            if (originalPromiseResult.data) {
                                const param = originalPromiseResult.data;
                                navigation.navigate('Home', {
                                    screen: 'Dashboard',
                                });
                                dispatch(cartHandler(token)).then(unwrapResult)
                                    .then((originalPromiseResult) => { console.log("cartDataaaa", originalPromiseResult.data) })
                                setLoader(false);
                            } else {
                                setLoader(false);
                                Toast.show("Something Went Wrong please try again!", Toast.LONG);
                                navigation.navigate('Login');
                            }
                        })
                        .catch((rejectedValueOrSerializedError) => {
                            console.log(" Inside catch", rejectedValueOrSerializedError);
                        })
                } else {
                    // console.log("No Token")
                    setLoader(false);
                    navigation.navigate('Login');
                    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
                    return () => {
                        BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
                    };
                    // Toast.show("Please fill the laid details to proceed!", Toast.LONG);
                }
            }
        }
    }, [isFocused,network])

    // useEffect(() => {
    //     BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    //     return () => {
    //       BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
    //     };
    //   }, []);


    function handleBackButtonClick() {
        // console.log("navigation done")
        navigation.navigate('Home', { screen: 'Search' });
        return true;
    }

    return (

        (LoginData?.data?.role)
            ?
            <View>
                {/* {console.log("iside render dashbord")} */}
                <SafeAreaView style={{
                    backgroundColor: COLORS.lightGray, height: "100%"
                }}>
                    <StatusBar
                        animated={true}
                        backgroundColor={COLORS.primary}
                    />
                    <View style={{ height: "8%", flexDirection: "row", backgroundColor: COLORS.primary, borderBottomStartRadius: 30, borderBottomEndRadius: 30 }}>
                        <TouchableOpacity style={{ borderWidth: 0,flexDirection:"column",justifyContent:"center",marginLeft:"5%" }} onPress={() => navigation.goBack()}>
                            <MCIcon name="keyboard-backspace" size={RFValue(25)} color={COLORS.white} />
                        </TouchableOpacity>
                        <View style={{ flexDirection: "column", width: "70%",justifyContent:"center",marginLeft:"2%" }}>
                            <Text style={{ color: COLORS.white, fontSize: RFValue(16, 580), ...FONTS.robotoregular, }}>DashBoard</Text>
                        </View>
                        {/* <Pressable style={{ flexDirection: "column", justifyContent: "flex-end", padding: "5%" }} onPressIn={() => setDrop(!drop)}>
                            <Text style={{ color: COLORS.white, fontSize: RFValue(13), ...FONTS.robotoregular, }}> {userName} <Icon name='chevron-down' size={RFValue(10)} color={COLORS.white} /> </Text>
                           { (drop)?<View style={{height:"50%",backgroundColor:COLORS.white}}>
                                <Text style={{color:COLORS.black}}>Log Out</Text>
                            </View>:null}                       
                        </Pressable> */}

                    </View>



                    {(LoginData.data.role == 1) ? <View style={styles.container}>
                        <View style={{ height: "100%", width: "100%", alignItems: "center", marginTop: "80%" }}>
                            <Text style={{ color: COLORS.black, justifyContent: "center", fontSize: RFValue(15, 580), ...FONTS.robotoregular, lineHeight: 100 }}>Welcoming  Instructor {LoginData.data.firstName} {LoginData.data.LastName} to </Text>
                            <Text style={{ color: "#8830c4", justifyContent: "center", fontSize: RFValue(40, 580), ...FONTS.robotoregular, ...FONTS.largeTitle }}>Edusity</Text>

                        </View>
                    </View> : (LoginData.data.role == 2 && userName) ? <StudentDashboard username={userName} /> : null}
                </SafeAreaView>
            </View>
            :
            <View style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center" }}>
                {/* {console.log("error render")} */}
                <LoaderKit
                    style={{ width: 50, height: 50 }}
                    name={'BallPulse'} // Optional: see list of animations below
                    size={50} // Required on iOS
                    color={COLORS.primary} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
                />
            </View>

    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.back,
    },

});
export default Dashboard;