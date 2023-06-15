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
    ActivityIndicator,
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
import Top_Bar from '../../components/topBar';

const Login = (route) => {
    console.log("Login route..................", route?.route?.params)
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
    const [errorEmailText, setErrorEmailText] = useState("");
    const [errorPasswordText, setErrorPasswordText] = useState("");
    const [errorCommonText, setErrorCommonText] = useState("");

    const forgothandler = () => {
        navigation.navigate("ForgotPassword")
    }

    useEffect(() => {
        if (formErrors && Object.keys(formErrors).length > 0) {
            if (formErrors && formErrors.emailorusername) {
                setErrorEmailText(formErrors.emailorusername)
            } else if (formErrors && formErrors.loginpassword) {
                setErrorPasswordText(formErrors.loginpassword)
            } else if (formErrors && formErrors.loginundef) {
                setErrorCommonText(formErrors.loginundef)
            }
        }
    }, [formErrors])

    // Api action only in onchange of the username 
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
    }, [data]);

    useEffect(() => {
        if (token) {
            dispatch(userLoginHanlder(token)).then(unwrapResult)
                .then((originalPromiseResult) => {
                    if (originalPromiseResult.data) {
                        setEmail("");
                        setPassword("");
                        const param = originalPromiseResult.data;
                        if (route?.route?.params == "user") {
                            navigation.navigate('Home', { screen: 'Profile' })
                        }
                        else if (route?.route?.params == "Mycourses") {
                            navigation.navigate('Home', { screen: 'MyCourse' })
                        }
                        else if (route?.route?.params == "Dashboard") {
                            navigation.navigate('Home', {
                                screen: 'Dashboard',
                                params: { param },
                            });
                        }
                        else {
                            navigation.navigate('Home', { screen: 'Search' })
                        }
                    } else {
                        setLoader(false);
                        Toast.show("Something Went Wrong please try again!", Toast.LONG);
                    }
                })
                .catch((rejectedValueOrSerializedError) => {
                    Toast.show("Something Went Wrong please try again!", Toast.LONG);
                })
        }
    }, [token])

    return (
        <KeyboardAvoidingView style={styles.container}>
            <StatusBar
                animated={true}
                backgroundColor={COLORS.primary}
            />
            {Platform.OS == 'ios' ? <View style={{ height: "5%" }} /> : null}
            <ImageBackground source={images.LoginBgImage} resizeMode="repeat" style={{ height: metrices(100), width: "100%" }}>
                {/* <View style={{ flexDirection: "row", alignItems: "center", color: COLORS.black, height: metrices(8) }}>
                        <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate('Home', { screen: "Search" })}>
                            <MCIcon name="keyboard-backspace" size={RFValue(28)} color={COLORS.black} />
                        </TouchableOpacity>
                    </View> */}
                <Top_Bar /* backPage={backPage} */ />
                <View style={{ height: metrices(10), alignItems: 'center', justifyContent: 'center', marginTop: metrices(8) }}>
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
                    <Text style={{ ...FONTS.robotomedium, color: COLORS.black, fontSize: RFValue(22) }}>Sign In</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <View style={styles.textBoxContainer}>
                        <InputBox
                            inputOutline
                            label={"Email"}
                            name={"Email"}
                            value={email}
                            customLabelStyle={[styles.textInput, { color: (errorLogin || errorEmail) ? "red" : COLORS.primary }]}
                            style={styles.inputText}
                            rightIcon={<FontAwesome5 name={'user-graduate'} size={20} style={{ color: COLORS.primary }} />}
                            onChangeText={e => {
                                handleChange(e, "emailorusername"),
                                    setErrorLogin(""),
                                    setErrorEmail(""),
                                    setEmail(e),
                                    setErrorEmailText(""),
                                    setErrorCommonText("")
                            }}
                            containerStyles={{ padding: "5%" }}
                        />
                    </View>
                    {formErrors && errorEmailText ? <View style={styles.errorContainer}>
                        <Text style={styles.ErrorText}>{errorEmailText}</Text>
                    </View> : null}
                    <View style={styles.textBoxContainer}>
                        <InputBox
                            inputOutline
                            label={"Password"}
                            name={"Password"}
                            value={password}
                            secureTextEntry={errorPassword ? false : true}
                            customLabelStyle={[styles.textPassword, { color: (errorLogin || errorEmail) ? "red" : COLORS.primary }]}
                            style={styles.inputText}
                            rightIcon={<FontAwesome5 name={'eye'} size={18} style={{ color: COLORS.primary }} />}
                            passHideIcon={<FontAwesome5 name={'eye-slash'} size={18} style={{ color: COLORS.primary }} />}
                            onChangeText={e => {
                                handleChange(e, "loginpassword"),
                                    setErrorLogin(""),
                                    setPassword(e),
                                    setErrorPassword(""),
                                    setErrorPasswordText(""),
                                    setErrorCommonText("")
                            }}
                            containerStyles={{ padding: "5%" }}
                        />
                    </View>
                    <TouchableOpacity style={[styles.textBoxContainer, { alignItems: "flex-end" }]} onPress={() => forgothandler()}>
                        <Text style={{ color: COLORS.edusity, ...FONTS.robotoregular }}>Forgot Password?</Text>
                    </TouchableOpacity>
                    <View style={{ height: metrices(4), width: "80%", alignItems: "center" }}>
                        {formErrors && errorPasswordText ? <Text style={styles.ErrorText}>{errorPasswordText}</Text> : null}
                        {errorLogin ? <Text style={styles.ErrorText}>{errorLogin}</Text> : null}
                        {formErrors && errorCommonText ? <Text style={styles.ErrorText}>{errorCommonText}</Text> : null}
                    </View>

                    <TouchableOpacity
                        style={{ width: '42%', height: 42, alignItems: 'center', justifyContent: 'center', marginTop: "1%" }}
                        onPress={e => { handleSubmit(e, 1), Keyboard.dismiss }} disabled={loader}
                    >
                        <LinearGradient
                            style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 30 }}
                            colors={['#9494d6', '#AF2DF8']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            {(!loader) ? <Text style={{ color: COLORS.white, fontSize: 16, ...FONTS.robotoregular }}>Sign in</Text> : <ActivityIndicator size="small" color="#ffff" />}
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
            </ImageBackground>
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
        width: "84%"
    },
    errorContainer: {
        height: metrices(2),
        width: "76%"
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
        ...FONTS.robotoregular,
    },
    textPassword: {
        color: COLORS.black,
        backgroundColor: COLORS.white,
        ...FONTS.robotoregular
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
        fontSize: RFValue(10)
    }
});

export default Login;
