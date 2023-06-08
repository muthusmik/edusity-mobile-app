import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    ImageBackground,
    KeyboardAvoidingView,
    Pressable,
    Keyboard,
    StatusBar,
    Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputBox from 'react-native-floating-label-inputbox';
import AntIcons from "react-native-vector-icons/AntDesign";
import { SocialIcon } from 'react-native-elements'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useDispatch, useSelector } from 'react-redux';
import LoaderKit from 'react-native-loader-kit';
import { unwrapResult } from '@reduxjs/toolkit';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-simple-toast';
import { icons, images, COLORS, FONTS, SIZES } from '../../constants';
import useForm from "../../components/validate/useForm";
import validate from "../../components/validate/validate";
import { loginHanlder } from '../../store/redux/login';
import { RFValue } from 'react-native-responsive-fontsize';
import { userLoginHanlder } from '../../store/redux/userLogin';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { metrices } from '../../constants/metrices';

const Login = () => {
    const { handleChange, details, handleSubmit, formErrors, data, formValues } = useForm(validate);
    const dispatch = (useDispatch());
    const navigation = useNavigation();
    const [errorLogin, setErrorLogin] = useState(null);
    const [errorEmail, setErrorEmail] = useState(null);
    const [errorPassword, setErrorPassword] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState(null);
    const [loader, setLoader] = useState(false);

    const forgothandler = () => {
        navigation.navigate("ForgotPassword")
    }

    // useEffect(() => {
    //     console.log(Object.keys(formValues).length, "kk")
    //     if (formErrors && Object.keys(formErrors).length > 0) {
    //         if (formErrors && formErrors.emailorusername) {
    //             setEmail(formErrors.emailorusername)
    //             setErrorEmail(true);
    //         } else if (formErrors && formErrors.loginpassword) {
    //             console.log("password Validation failed")
    //             setPassword(formErrors.loginpassword);
    //             setErrorPassword(formErrors.loginpassword);
    //         }
    //     }
    // }, [formErrors])

    // Api action only onchange of the username 
    useEffect(() => {
        if (data && Object.keys(data).length > 1) {
            setLoader(true);
            dispatch(loginHanlder(data))
                .then(unwrapResult)
                .then(async (originalPromiseResult) => {
                    if (originalPromiseResult == "error") {
                        navigation.navigate("ServerError");
                    }
                    else if (originalPromiseResult.error == true) {
                        setErrorLogin(originalPromiseResult.message)
                        setLoader(false);
                    }
                    else if (originalPromiseResult.error == false) {
                        setErrorLogin("");
                        await AsyncStorage.setItem('loginToken', originalPromiseResult.data.token);
                        setToken(originalPromiseResult.data.token)
                    }
                })
                .catch((rejectedValueOrSerializedError) => {
                    Toast.show("Something went wrong please try after some time!", Toast.LONG);
                    setLoader(false);
                })
        }
        //  else {
        //     console.log("please fill the Details to proceed")
        // }
    }, [data]);

    useEffect(() => {
        if (token) {
            dispatch(userLoginHanlder(token)).then(unwrapResult)
                .then((originalPromiseResult) => {
                    if (originalPromiseResult.data) {
                        setEmail("");
                        setPassword("");
                        const param = originalPromiseResult.data;
                        navigation.navigate('Home', {
                            screen: 'Dashboard',
                            params: { param },
                        });
                    } else {
                        setLoader(false);
                        Toast.show("Something Went Wrong please try again!", Toast.LONG);
                    }
                })
                .catch((rejectedValueOrSerializedError) => {
                    Toast.show("Something Went Wrong please try again!", Toast.LONG);
                    // console.log(" Inside catch", rejectedValueOrSerializedError);
                })
        }
        // else {
        //     console.log("No Token")
        //     // Toast.show("Please fill the laid details to proceed!", Toast.LONG);
        // }

    }, [token])

    const handleEmailBox = () => {
        if (errorEmail) {
            setEmail(""), setErrorEmail("");
        }
    }
    const handlePasswordBox = () => {
        if (errorPassword) {
            setPassword(""), setErrorPassword("");
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            <StatusBar
                animated={true}
                backgroundColor={COLORS.primary}
            />
            {Platform.OS == 'ios' ? <View style={{ height: "5%" }} /> : null}
            {(loader) ?
                <View style={{ height: "100%", width: "100%" }}>
                    <ImageBackground source={images.LoginBgImage} resizeMode="repeat" style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center" }}>
                        <LoaderKit
                            style={{ width: 50, height: 50 }}
                            name={'BallPulse'}
                            size={50}
                            color={COLORS.primary}
                        />
                    </ImageBackground>
                </View>
                :
                <ImageBackground source={images.LoginBgImage} resizeMode="repeat" style={{ height: metrices(100), width: "100%" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", color: COLORS.black, height: metrices(8) }}>
                        <TouchableOpacity style={{ marginLeft: "4%" }} onPress={() => navigation.navigate('Home', { screen: "Search" })}>
                            <MCIcon name="keyboard-backspace" size={RFValue(20)} color={COLORS.black} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: metrices(10), alignItems: 'center', justifyContent: 'center', marginTop: metrices(4) }}>
                        <Image
                            source={icons.Edusitylogo}
                            resizeMode="contain"
                            style={{
                                width: '50%',
                                height: '64%'
                            }}
                        />
                    </View>
                    <View style={{ height: metrices(8), alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ ...FONTS.robotomedium, color: COLORS.black, fontSize: 23 }}>Sign In</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <View style={styles.textBoxContainer}>
                            <Pressable onPressIn={() => handleEmailBox()}>
                                <InputBox
                                    inputOutLine
                                    label={"Email"}
                                    value={email}
                                    style={styles.inputText}
                                    rightIcon={<FontAwesome5 name={'user-graduate'} size={20} style={{ color: COLORS.primary }} />}
                                    customLabelStyle={{ ...styles.textInput, ...{ color: (errorLogin || errorEmail) ? "red" : COLORS.primary } }}
                                    onChangeText={e => { handleChange(e, "emailorusername"), setErrorLogin(""), setErrorEmail(""), setEmail(e) }}
                                />
                            </Pressable>
                            <View style={styles.errorContainer}>
                                {formErrors && formErrors.emailorusername ?
                                    <Text style={styles.ErrorText}>{formErrors.emailorusername}</Text>
                                    : null}
                            </View>
                        </View>

                        <View style={styles.textBoxContainer}>
                            <Pressable onPressIn={() => handlePasswordBox()} >
                                <InputBox
                                    inputOutLine
                                    label={"Password"}
                                    value={password}
                                    secureTextEntry={errorPassword ? false : true}
                                    style={styles.inputText}
                                    rightIcon={<FontAwesome5 name={'eye'} size={18} style={{ color: COLORS.primary }} />}
                                    passHideIcon={<FontAwesome5 name={'eye-slash'} size={18} style={{ color: COLORS.primary }} />}
                                    // labelStyle={{ fontSize: RFValue(12),color:"red" }}
                                    showPasswordContainerStyle={{ height: 1900 }}
                                    containerStyles={{ margin: "20%", height: "100%" }}
                                    customLabelStyle={{ ...styles.textPassword, ...{ color: (errorLogin || errorEmail) ? "red" : COLORS.primary } }}
                                    onChangeText={e => { handleChange(e, "loginpassword"), setErrorLogin(""), setPassword(e), setErrorPassword(null) }}
                                />
                            </Pressable>
                        </View>
                        <TouchableOpacity style={[styles.textBoxContainer, { alignItems: "flex-end" }]} onPress={() => forgothandler()}>
                            <Text style={{ color: COLORS.edusity, ...FONTS.robotoregular }}>Forgot Password?</Text>
                        </TouchableOpacity>
                        <View style={{ height: metrices(4), width: "80%", alignItems: "center" }}>
                            {formErrors && formErrors.loginpassword ?
                                <Text style={styles.ErrorText}>{formErrors.loginpassword}</Text>
                                : null}
                            {errorLogin ? (
                                <View >
                                    <Text style={styles.ErrorText}>{errorLogin}</Text>
                                </View>) : null}
                            {formErrors && formErrors.loginundef ? (<View><Text style={styles.ErrorText}>{formErrors.loginundef}</Text></View>) : null}
                        </View>

                        <TouchableOpacity
                            style={{ width: '42%', height: 42, alignItems: 'center', justifyContent: 'center', marginTop: "1%" }}
                            onPress={e => { handleSubmit(e, 1), Keyboard.dismiss }} disabled={false}
                        >
                            <LinearGradient
                                style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 30 }}
                                colors={['#9494d6', '#AF2DF8']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={{ color: COLORS.white, fontSize: 16, ...FONTS.robotoregular }}>Sign in</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <Pressable style={{ marginTop: "3%" }} onPress={() => navigation.navigate("SignUp")}>
                            <Text style={{ color: COLORS.black, ...FONTS.robotoregular }}>Don't have an account?
                                <Text style={{ color: COLORS.edusity, ...FONTS.robotoregular }}> Sign Up</Text></Text>
                        </Pressable>

                        {/* <Text style={{ color: COLORS.black, ...FONTS.robotoregular, top: "1%" }}> Or</Text>
                        <Text style={{ color: COLORS.black, ...FONTS.robotoregular, top: "2%" }}> Connect with Social Media</Text>

                        <View style={styles.socialMedia}>
                            <Pressable style={{ marginHorizontal: "1%" }} onPressIn={() => console.log("Facebook")}>
                                <SocialIcon
                                    title='Sign In With Facebook'
                                    raised={true}
                                    type='facebook'
                                />
                            </Pressable>
                            <Pressable style={{ marginHorizontal: "1%" }} onPressIn={() => console.log("Google")}>
                                <SocialIcon
                                    title='Sign In With Facebook'
                                    raised={true}
                                    type='google'
                                />
                            </Pressable>
                            <Pressable style={{ marginHorizontal: "1%" }} onPressIn={() => console.log("Apple")}>
                                <AntIcons
                                    name="apple1" size={50} color={COLORS.black} style={{ top: "8%" }}
                                />
                            </Pressable>
                        </View> */}
                    </View>
                </ImageBackground>}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    lottie: {
        width: 100,
        height: 100
    },
    inputText: {
        color: COLORS.black,
        ...FONTS.robotoregular,
        fontSize: 18
    },
    textBoxContainer: {
        width: "80%"
    },
    errorContainer: {
        height: metrices(2)
    },
    label: {
        color: COLORS.black,
        alignContent: "flex-start",
        fontSize: RFValue(14),
        left: "5%",
        ...FONTS.robotomedium
    },
    textInput: {
        color: COLORS.black,
        backgroundColor: COLORS.white,
        fontSize: RFValue(14),
        width: "20%",
        ...FONTS.robotoregular,
    },
    textPassword: {
        color: COLORS.black,
        backgroundColor: COLORS.white,
        width: "26%", borderWidth: 2,
        fontSize: RFValue(14),
        ...FONTS.robotoregular,
        borderWidth: 0
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    }
    , socialMedia: {
        flexDirection: "row",
        margin: "4%",
        //top:"5%",
    },
    // ErrorCont: {
    //     marginVertical: "1%",
    // },
    ErrorText: {
        color: "red",
        ...FONTS.robotoregular,
        fontSize: RFValue(10),
        textAlign: "center"
    }
});

export default Login;
