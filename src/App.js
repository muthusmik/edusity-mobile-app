import React ,{useEffect, useState}from "react";
import {
    Image,
    TouchableOpacity
} from 'react-native';
import { createStackNavigator, CardStyleInterpolators, } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { images, icons, COLORS, FONTS, SIZES } from "./constants";
import { RFValue } from "react-native-responsive-fontsize";

import SplashScreen from "./screens/splashScreen";

// screens
import Login from "./screens/login/login";
import SignUp from "./screens/signup/signup";
import OtpPage from "./screens/signup/otp"
import ForgotPassword from "./screens/login/forgotPassword";
// extra screens
import SearchScreen from "./screens/sections/search/searchScreen";
import ViewCourse from "./screens/sections/search/viewCourse";
import ViewInstructorProfile from "./screens/sections/search/viewInstructorProfile";
import ViPlayer from "./screens/videoPlayer";
import Tabs from "./navigation/tabs";
import Cart from "./screens/cart";
import NetworkError from "./screens/Exceptions/noNetworkPage"
import RazorPay from "./screens/razorPay";
import CheckoutComplete from "./screens/checkoutComplete";
import ServerErrorPage from "./screens/Exceptions/serverDown";
// import GeolocationFetcher from "./screens/geoLocation";



const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        border: "transparent",
    },
};

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer theme={theme}>
            <Stack.Navigator
                initialRouteName={'Splash'}
                screenOptions={{
                    cardStyleInterpolator: CardStyleInterpolators.forRevealFromBottomAndroid
                }}
            >
                {/* Screens */}

                <Stack.Screen
                    name="Splash"
                    options={{ animationEnabled: false, header: () => null }}
                    component={SplashScreen}
                />
                {/* <Stack.Screen
                    name="Geolocation"
                    options={{ animationEnabled: false, header: () => null }}
                    component={GeolocationFetcher}
                /> */}
                <Stack.Screen
                    name="Cart"
                    options={{ animationEnabled: false, header: () => null }}
                    component={Cart}
                />
                <Stack.Screen
                    name="NetworkError"
                    options={{ animationEnabled: false, header: () => null }}
                    component={NetworkError}
                />
                <Stack.Screen
                    name="ServerError"
                    options={{ animationEnabled: false, header: () => null }}
                    component={ServerErrorPage}
                />
                <Stack.Screen
                    name="Login"
                    component={Login}
                    // options={{
                    //     title: null,
                    //     headerStyle: {
                    //         backgroundColor: COLORS.white
                    //     },
                    //     headerLeft: null,
                    //     headerRight: () => (
                    //         <TouchableOpacity
                    //             style={{ marginRight: SIZES.padding }}
                    //             onPress={() => console.log("Pressed")}
                    //         >
                    //             <Image
                    //                 source={icons.barMenu}
                    //                 resizeMode="contain"
                    //                 style={{
                    //                     width: 25,
                    //                     height: 25,
                    //                 }}
                    //             />
                    //         </TouchableOpacity>
                    //     ),
                    // }}
                    options={{ headerShown: false }}
                />
                < Stack.Screen
                    name="ForgotPassword"
                    component={ForgotPassword}
                    options={{ headerShown: false }}
                />
                < Stack.Screen
                    name="OtpPage"
                    component={OtpPage}
                    options={{ headerShown: false }}
                />

                < Stack.Screen
                    name="SignUp"
                    component={SignUp}
                    options={{ headerShown: false }}
                />


                {/* Tabs */}
                < Stack.Screen
                    name="Home"
                    component={Tabs}
                    options={{ headerShown: false }}
                />
                < Stack.Screen
                    name="SearchScreen"
                    component={SearchScreen}
                    options={{ headerShown: false }}
                />
                < Stack.Screen
                    name="Checkout"
                    component={CheckoutComplete}
                    options={{ headerShown: false }}
                />
                < Stack.Screen
                    name="ViewCourse"
                    component={ViewCourse}
                    options={{ headerShown: false }}
                />
                < Stack.Screen
                    name="ViewInstructorProfile"
                    component={ViewInstructorProfile}
                    options={{
                        title: "Instructor Profile",
                        headerStyle: {
                            backgroundColor: COLORS.primary,

                        },
                        headerTitleStyle: {
                            color: COLORS.white,
                            marginLeft: "25%",
                            fontSize: RFValue(16, 580)

                        }
                        // headerLeft: null,
                        // headerRight: () => (
                        //     <TouchableOpacity
                        //         style={{ marginRight: SIZES.padding }}
                        //         onPress={() => console.log("Pressed")}
                        //     >

                        //     </TouchableOpacity>
                        // ),
                    }}
                />
                < Stack.Screen
                    name="VideoPlayer"
                    component={ViPlayer}
                    options={{ headerShown: false }}
                />
                    < Stack.Screen
                    name="Razor"
                    component={RazorPay}
                    options={{ headerShown: false }}
                />


            </Stack.Navigator>
        </NavigationContainer >
    );
};

export default () => {
    return <App />;
};
