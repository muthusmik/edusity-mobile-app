import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    TouchableOpacity, BackHandler, Image, Dimensions, useWindowDimensions, TextInput, Alert
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Colors } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { icons, COLORS, FONTS, } from '../../../constants';
import LoaderKit from 'react-native-loader-kit';
import { Avatar } from '@rneui/themed';
import General from './general';
import Notifications from './notification';
import AddCard from './addCard';
import PaymentMethods from './paymentMethods';
import Security from './security';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useIsFocused } from "@react-navigation/core";
import NetInfo from '@react-native-community/netinfo';
import { DeactivateProfile, DeleteProfile } from '../../../services/userService';

const { width } = Dimensions.get("screen");
const FirstRoute = () => <General />;
const SecondRoute = () => <ScrollView >< Security /></ScrollView>;
const ThirdRoute = () => <ScrollView><AddCard /></ScrollView>;
const FourthRoute = () => <ScrollView><PaymentMethods /></ScrollView>;
const FifthRoute = () => <ScrollView>< Notifications /></ScrollView>;
const Profile = () => {
    const Token = useSelector(state => state.loginHandle.data.data);
    const LoginDetails = useSelector(state => state.userLoginHandle)
    const [userDetails, setUserDetails] = useState([])
    const [key, setKey] = useState("")
    const navigation = useNavigation();
    // console.log("LoginDetails......", userDetails)
    const [active, setActive] = useState(0)
    const [index, setIndex] = React.useState(0);
    const layout = useWindowDimensions();
    const isFocused = useIsFocused();
    const [network, setNetwork] = useState('')
    useEffect(() => {
        if (isFocused) {
            // console.log("Data in deed")
            NetInfo.refresh().then(state => {
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
                console.log("token.......................", token)
                if (LoginDetails.data && token) {
                    setKey(token)
                    // console.log(LoginDetails)
                    setUserDetails([LoginDetails?.data?.data])
                    // console.log("data success", userDetails)
                } else {
                    navigation.replace('Login');
                    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
                    return () => {
                        BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
                    };
                }
            }

        }
    }, [LoginDetails, isFocused, network])

    const createTwoButtonAlert = () =>
        Alert.alert(
            "Signout",
            "Are you sure you want to sign out, you will lose your data if you continue!",
            [
                {
                    text: "Cancel",
                    // onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => handleLogout() }
            ]
        );

    const deactivateTwoButtonAlert = () =>
        Alert.alert(
            "Deactivate Account",
            "Are you sure? you want to Deactivate  your Account, your account will be temporarily kept inactive if you continue!",
            [
                {
                    text: "Cancel",
                    // onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => handleDeactivate() }
            ]
        );

    const handleDeactivate = async () => {
        //setLoader(true)
        await DeactivateProfile(key).then(
            //  AsyncStorage.removeItem("loginToken").then(
            navigation.navigate("Home", { screen: "Search" })
            // )
        )
    }

    const handleLogout = async () => {
        //setLoader(true)
        await AsyncStorage.removeItem("loginToken").then(
            // setLoader(false),
            // console.log("done removing"),
            navigation.navigate("Home", { screen: "Search" })
        )
    }
    function handleBackButtonClick() {
        // console.log("navigation done")
        navigation.navigate('Home', { screen: 'Search' });
        return true;
    }

    const [routes] = React.useState([
        { key: 'first', title: 'General' },
        { key: 'second', title: 'Security' },
        // { key: 'third', title: 'Add Card' },
        { key: 'fourth', title: 'Payments' },
        { key: 'fifth', title: 'Notifications' }
    ]);

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
        // third: ThirdRoute,
        fourth: FourthRoute,
        fifth: FifthRoute,

    });

    const renderTabBar = props => (
        <TabBar
            {...props}
            activeColor="yellow"
            inactiveColor={COLORS.white}
            scrollEnabled={true}
            labelStyle={{ ...FONTS.robotoregular }}
            style={{ backgroundColor: COLORS.primary, margintop: 100 }}
        />
    )

    return (
        <>
            {(userDetails.length > 0) ?
                <View >
                    <StatusBar
                        animated={true}
                        backgroundColor={COLORS.primary}
                    />
                    {/* {Platform.OS=='ios'?
                    <View style={{height:"5%"}}>

                    </View>:null} */}
                    <View style={{ flexDirection: 'row', justifyContent: "center", paddingBottom: "5%", position: "relative", backgroundColor: COLORS.primary }}>
                        <View style={{ backgroundColor: COLORS.primary, width: '100%', position: 'absolute' }} />
                        <LinearGradient colors={["#bfe9ff", "#bfe9ff"]} style={{ marginVertical: "4%", flexDirection: 'row', width: "90%", borderRadius: 10, justifyContent: "space-around", padding: "6%" }}>
                            <View style={{ borderColor: "red", flexDirection: "column", alignItems: "center", width: "28%", justifyContent: "center" }}>
                                <Avatar
                                    size={80}
                                    rounded
                                    title={userDetails[0].firstName.charAt(0).toUpperCase() + userDetails[0].lastName.charAt(0).toUpperCase()}
                                    containerStyle={{ backgroundColor: "red", fontFamily: 'Roboto-Regular', }}
                                />
                                {/* <TouchableOpacity onPress={() =>  deactivateTwoButtonAlert()} style={{ marginTop: "5%", flexDirection: "row" }} >
                                    <MCIcon name="broadcast-off" size={RFValue(18)} color={COLORS.primary} />
                                    <Text  style={{ color: COLORS.black, ...FONTS.robotomedium, fontSize: RFValue(10), alignSelf: "center", marginHorizontal: "2%" }}>Deactivate Account</Text>
                                </TouchableOpacity> */}
                            </View>
                            <View style={{ flexDirection: "column", alignItems: "flex-end", width: "60%" }}>
                                <Text style={{ padding: "1%", fontSize: RFValue(16, 580), color: COLORS.black, fontFamily: 'Roboto-Medium' }}>{userDetails[0].firstName} {userDetails[0].lastName}</Text>
                                <Text style={{ padding: "1%", fontSize: RFValue(10, 580), color: COLORS.black, fontFamily: 'Roboto-Regular', }}>{userDetails[0].phoneNumber}</Text>
                                <Text style={{ padding: "1%", fontSize: RFValue(10, 580), color: COLORS.black, fontFamily: 'Roboto-Regular', }}>{userDetails[0].email}</Text>
                                <TouchableOpacity style={{ marginTop: "4%", flexDirection: "row" }} onPress={() => { createTwoButtonAlert() }}>
                                    <MCIcon name="logout" size={RFValue(18)} color={COLORS.primary} />
                                    <Text style={{ color: COLORS.black, ...FONTS.robotomedium, fontSize: RFValue(10), alignSelf: "center", marginHorizontal: "2%" }}>Log Out</Text>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </View>
                    <View style={{ height: "80%" }}>
                        <TabView
                            navigationState={{ index, routes }}
                            renderScene={renderScene}
                            renderTabBar={renderTabBar}
                            onIndexChange={setIndex}
                        />

                    </View>

                </View> :
                <View style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center" }}>
                    <LoaderKit
                        style={{ width: 50, height: 50, justifyContent: 'center' }}
                        name={'BallPulse'} // Optional: see list of animations below
                        size={50} // Required on iOS
                        color={COLORS.primary} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
                    />
                </View>
            }

        </>

    );
}
export default Profile;
const styles = StyleSheet.create({
    iconStyle: {
        fontSize: 40,
        marginTop: 30,
        color: 'black',
    },
})