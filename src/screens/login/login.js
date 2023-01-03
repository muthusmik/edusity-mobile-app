
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
    
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputBox from 'react-native-floating-label-inputbox';
import AntIcons from "react-native-vector-icons/AntDesign";
import { SocialIcon } from 'react-native-elements'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-simple-toast';

import { icons, images, COLORS, FONTS, SIZES } from '../../constants';
import useForm from "../../components/validate/useForm";
import validate from "../../components/validate/validate";
import { loginHanlder } from '../../store/redux/login';
import { RFValue } from 'react-native-responsive-fontsize';
import { userLoginHanlder } from '../../store/redux/userLogin';
import { ActivityIndicator } from 'react-native-paper';
const Login = ({ navigation }) => {
    const { handleChange, details, handleSubmit, formErrors, data, formValues } = useForm(validate);
    const dispatch = (useDispatch());

    const [errorLogin, setErrorLogin] = useState(null);
    const [errorEmail, setErrorEmail] = useState(null);
    const [errorPassword, setErrorPassword] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState(null);
    const [loader, setLoader] = useState(false);
    // const [geoLocation,setlocation]=useSelector(state=>state.geoLocationPicker);
    // console.log(geoLocation,"geoLocation")
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
        console.log("hello", data && Object.keys(data).length)
        if (data && Object.keys(data).length > 1) {
            setLoader(true);
            dispatch(loginHanlder(data))
                .then(unwrapResult)
                .then(async(originalPromiseResult) => {
                    console.log("successfully returned to login with response ", originalPromiseResult.data);
                    if (originalPromiseResult.data) {
                        setErrorLogin("");
                        await AsyncStorage.setItem('loginToken', originalPromiseResult.data);
                        console.log(  await AsyncStorage.getItem('loginToken'),"helloooo")  
                        console.log(originalPromiseResult.data)
                        setToken(originalPromiseResult.data)
                    } else {
                        setLoader(false);
                        console.log(originalPromiseResult.errormessage, "error")
                        Toast.show(originalPromiseResult.errormessage, Toast.LONG);
                        setErrorLogin(originalPromiseResult.errormessage)
                        if (originalPromiseResult.errorCode == 2238) {
                            setErrorLogin("Username and Password not Found. Please Create an Account")
                            Toast.show(originalPromiseResult.errormessage, Toast.LONG);
                            console.log(errorLogin, "error in login")
                        } else if (originalPromiseResult.errorCode == 2219) {
                            setErrorLogin("Please verify the mail sent and try again")
                            Toast.show(originalPromiseResult.errormessage, Toast.LONG);
                            console.log(errorLogin, "error in login")
                        }
                    }
                })
                .catch((rejectedValueOrSerializedError) => {
                    console.log(" Inside catch", rejectedValueOrSerializedError);
                    Toast.show("Something went wrong please try after some time!", Toast.LONG);
                    setLoader(false);
                })
        } else {
            console.log("please fill the Details to proceed")
        }
    }, [data]);

    useEffect(() => {
        console.log( AsyncStorage.getItem("loginToken"), "token value on disptach")
        if (token) {
            dispatch(userLoginHanlder(token)).then(unwrapResult)
                .then((originalPromiseResult) => {
                    console.log("successfully returned to login with response ", originalPromiseResult.errorCode);
                    if (originalPromiseResult.data) {
                        setEmail("");
                        setPassword("");
                        
                        const param = originalPromiseResult.data;
                        navigation.navigate('Home', {
                            screen: 'Dashboard',
                            params: { param },
                        });
                        setLoader(false);
                    } else {
                        setLoader(false);
                        Toast.show("Something Went Wrong please try again!", Toast.LONG);
                    }
                })
                .catch((rejectedValueOrSerializedError) => {
                    console.log(" Inside catch", rejectedValueOrSerializedError);
                })
        } else {
            console.log("No Token")
            // Toast.show("Please fill the laid details to proceed!", Toast.LONG);
        }

    }, [token])
    useEffect(() => {
        console.log(errorPassword, password, "password error")
    }, [errorPassword])

    const handleEmailBox = () => {
        if (errorEmail) {
            setEmail(""), setErrorEmail("");
        }
    }
    const handlePasswordBox = () => {
        console.log("box pass")
        if (errorPassword) {
            setPassword(""), setErrorPassword("");
        }
    }

    return (


        <KeyboardAvoidingView style={styles.container}>
            {(loader) ?
                <View style={{ height: "100%", width: "100%", }}>
                    <ImageBackground source={images.LoginBgImage} resizeMode="repeat" style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator size="large" />
                    </ImageBackground>
                </View>

                :
                <ImageBackground source={images.LoginBgImage} resizeMode="repeat" style={{ height: "100%", width: "100%" }}>
                    <View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center', top: "10%" }}>
                        <Image
                            source={icons.Edusitylogo}
                            resizeMode="contain"
                            style={{
                                width: '50%',
                                height: '60%',
                            }}
                        />
                    </View>
                    <View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center', top: "10%" }}>
                        <Text style={{ ...FONTS.robotomedium, color: COLORS.black, fontSize: 23 }}>Sign In</Text>
                    </View>
                    <View style={{ flex: 0.5, alignItems: 'center', }}>
                        <View style={{ width: "80%", marginTop: "22%" }}>
                            {/* <Text style={styles.label}>Email</Text> */}
                            {/* */}
                            <Pressable onPressIn={() => handleEmailBox()}>
                                {/* style={{ ...styles.textView, ...{ borderColor: (errorLogin || errorEmail) ? "red" : "gray", shadowColor: (errorLogin) ? "red" : COLORS.primary, } }} */}

                                {/* <TextInput placeholder='Enter your Email'
                                placeholderTextColor={COLORS.gray}
                                style={{ ...styles.textInput, ...{ color: (errorLogin || errorEmail) ? "red" : COLORS.black, } }}
                                value={email}
                                selectionColor={COLORS.blue} */}
                                <InputBox
                                    inputOutLine
                                    label={"  Email / Username"}
                                    value={email}
                                    customLabelStyle={{ ...styles.textInput, ...{ color: (errorLogin || errorEmail) ? "red" : COLORS.black, } }}
                                    onChangeText={e => { handleChange(e, "emailorusername"), setErrorLogin(""), setErrorEmail(""), setEmail(e) }} />
                            </Pressable>
                            {formErrors && formErrors.emailorusername ? <Text style={styles.ErrorText}>{formErrors.emailorusername}</Text> : null}
                        </View>

                        <View style={{ width: "80%", marginTop: "5%" }}>
                            {/* <Text style={styles.label}>Password</Text> */}
                            <Pressable
                                // style={{ ...styles.textView, ...{ borderColor: (errorLogin || errorPassword) ? "red" : "gray", shadowColor: (errorLogin) ? "red" : COLORS.primary, } }}
                                onPressIn={() => handlePasswordBox()}>
                                {/* <TextInput name="Password" placeholder='Enter Password'
                                placeholderTextColor={COLORS.gray}
                                value={password}
                                secureTextEntry={(errorPassword) ? false:true}
                                style={{ ...styles.textInput, ...{ color: (errorLogin || errorPassword) ? "red" : COLORS.black, } }}
                                selectionColor={COLORS.blue} */}
                                <InputBox
                                    inputOutLine
                                    label={"Password"}
                                    value={password}
                                    secureTextEntry={errorPassword ? false : true}
                                    rightIcon={<FontAwesome5 name={'eye'} size={18} />}
                                    passHideIcon={<FontAwesome5 name={'eye-slash'} size={18} />}
                                    labelStyle={{ ...FONTS.robotoregular }}
                                    customLabelStyle={{ ...styles.textPassword, ...{ color: (errorLogin || errorEmail) ? "red" : COLORS.black, } }}
                                    onChangeText={e => { handleChange(e, "loginpassword"), setErrorLogin(""), setPassword(e), setErrorPassword(null) }} />
                                {formErrors && formErrors.loginpassword ? <Text style={styles.ErrorText}>{formErrors.loginpassword}</Text> : null}
                            </Pressable>

                            <TouchableOpacity style={{ left: "62%", marginVertical: "1%" }} onPress={() => forgothandler()}>
                                <Text style={{ color: COLORS.blue, ...FONTS.robotoregular }}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: "1%" }}>
                            {/* {console.log("vvbyuybybybyy",errorlogin)} */}
                            {errorLogin ? (<View><Text style={{ color: "red", fontSize: RFValue(10), ...FONTS.robotoregular }}>{errorLogin}</Text></View>) : null}
                            {formErrors && formErrors.loginundef ? (<View><Text style={{ color: "red", fontSize: RFValue(10), ...FONTS.robotoregular }}>{formErrors.loginundef}</Text></View>) : null}
                        </View>


                        <TouchableOpacity
                            style={[styles.shadow, { width: '50%', height: 40, alignItems: 'center', justifyContent: 'center', marginTop: "3%" }]}
                            onPress={e => { handleSubmit(e, 1), Keyboard.dismiss }} disabled={false}
                        >
                            <LinearGradient
                                style={{ height: '100%', width: '60%', alignItems: 'center', justifyContent: 'center', borderRadius: 30 }}
                                colors={['#46aeff', '#5884ff']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={{ color: COLORS.white, fontSize: 16, ...FONTS.robotoregular }}>Sign in</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <Pressable style={{ marginTop: "3%" }} onPress={() => navigation.navigate("SignUp")}>
                            <Text style={{ color: COLORS.black, ...FONTS.robotoregular }}>Don't have an account?
                                <Text style={{ color: COLORS.blue, ...FONTS.robotoregular }}> Sign Up</Text></Text>
                        </Pressable>

                        <Text style={{ color: COLORS.black, ...FONTS.robotoregular, top: "1%" }}> Or</Text>
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
                        </View>
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
    textView: {
        width: "80%",
        // alignItems: "center",
        marginTop: "1%",
        marginLeft: "10%",
        padding: 2,
        backgroundColor: COLORS.white,
        borderWidth: 2, borderRadius: 20,
        ...FONTS.robotoregular,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    label: {
        color: COLORS.black,
        alignContent: "flex-start",
        fontSize: 14,
        left: "10%",
        ...FONTS.robotomedium
    },
    textInput: {
        color: COLORS.black,
        backgroundColor: COLORS.white,
        width: "41%",
        ...FONTS.robotoregular,
    },
    textPassword:{
        color: COLORS.black,
        backgroundColor: COLORS.white,
        width: "26%",
        ...FONTS.robotoregular,
        borderWidth:0
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
