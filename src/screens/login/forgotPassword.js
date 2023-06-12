
import React from 'react';
import { useState, useEffect } from 'react';
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
import InputBox from 'react-native-floating-label-inputbox';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import LinearGradient from 'react-native-linear-gradient';
import { icons, images, COLORS, FONTS, SIZES } from '../../constants';
import { metrices } from '../../constants/metrices';
import useForm from "../../components/validate/useForm";
import validate from "../../components/validate/validate";
import { forgotPasswordHanlder } from '../../store/redux/forgotPassword';
import { RFValue } from 'react-native-responsive-fontsize';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'

const ForgotPassword = ({ navigation }) => {
    const { handleChange, details, handleSubmit, formErrors, data } = useForm(validate);
    const dispatch = useDispatch();
    const [errorLogin, setErrorLogin] = useState(null);
    const [errorEmail, setErrorEmail] = useState(null);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [resendState, setResendState] = useState(false);

    // useEffect(()=>{
    //     console.log(formErrors,"formErrors")
    //     if(formErrors && Object.keys(formErrors).length>0 ){
    //         if(formErrors && formErrors.forgotemail){
    //             setEmail(formErrors.forgotemail)
    //             setErrorEmail(true);
    //         }
    //     }
    // },[formErrors])

    const handleClose = () => {
        setEmail("")
        navigation.navigate('Login')
    }

    const handleForgotEmail = () => {
        if (email) {
            if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
                setError("Invalid email or format!")
            }
            else {
                console.log("success");
                let data = { "forgotemail": email }
                dispatch(forgotPasswordHanlder(data)).then(unwrapResult).then((originalPromiseResult) => {
                    if (originalPromiseResult == "error") {
                        navigation.navigate("ServerError");
                    }
                    else if (originalPromiseResult.error == true) {
                        setError(originalPromiseResult.message);
                    }
                    else if (originalPromiseResult.error == false) {
                        setError("")
                        setResendState(true)
                    }
                }).catch((rejectedValueOrSerializedError) => {
                    Toast.show("Something went wrong, please try again later!", Toast.LONG, Toast.CENTER)
                    console.log("Error in catch of dispatch forgot password...........", rejectedValueOrSerializedError);
                })
            }
        }
        else if (email.length == 0) {
            setError("Please enter your email address!")
        }
    }

    // useEffect(() => {
    //     console.log("hello", data && Object.keys(data).length)
    //     if (data && Object.keys(data).length == 1) {
    //         //   console.log("hello",data)
    //         dispatch(forgotPasswordHanlder(data))
    //             .then(unwrapResult)
    //             .then((originalPromiseResult) => {
    //                 if (originalPromiseResult == "error") {
    //                     navigation.navigate("ServerError");
    //                 }
    //                 else if (originalPromiseResult.error == true) {
    //                     setError(originalPromiseResult.message);
    //                 }
    //                 else if (originalPromiseResult.error == false) {
    //                     Toast.show(originalPromiseResult.message, Toast.LONG, Toast.BOTTOM)
    //                     // removeToken()
    //                 }
    //             })
    //             .catch((rejectedValueOrSerializedError) => {
    //                 console.log(" Inside catch", rejectedValueOrSerializedError);
    //             })
    //     }

    //     // const ForgotApi = async (data) => {
    //     //     let email = data.forgotemail
    //     //     let payload = {
    //     //         "email": email
    //     //     }
    //     //     // console.log("payload",payload)
    //     //     let url = "https://newlogin.edusity.com/send-otp";
    //     //     let forgot = await axios.post(url, payload).then(response => {
    //     //         navigation.navigate("OtpPage"),
    //     //             console.log("Forgot api", response.data)
    //     //     }).catch(err => console.log("error", err))
    //     // }
    //     // ForgotApi(data)

    // }, [data]);

    const borderStyle = {
        borderWidth: 0
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            {Platform.OS == 'ios' ? <View style={{ height: "5%" }} /> : null}
            <ImageBackground source={images.LoginBgImage} resizeMode="repeat" style={{ height: "100%", width: "100%" }}>
                <View style={{ flexDirection: "row", alignItems: "center", color: COLORS.black, height: metrices(8) }}>
                    <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.goBack()}>
                        <MCIcon name="keyboard-backspace" size={RFValue(28)} color={COLORS.black} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center', top: "6%" }}>
                    <Image
                        source={icons.Edusitylogo}
                        resizeMode="contain"
                        style={{
                            width: '50%',
                            height: '60%',
                        }}
                    />
                </View>
                <View style={{ flex: 0.1, alignItems: 'center', top: "6%", justifyContent: 'center' }}>
                    <View style={{ alignItems: 'center', marginHorizontal: SIZES.padding }}>
                        <Text style={{ ...FONTS.robotomedium, color: COLORS.black, fontSize: 23 }}>Forgot Password</Text>
                    </View>
                </View>
                {!resendState ?
                    <View style={{ flex: 0.5, alignItems: 'center', }}>
                        <View style={{ width: "90%", marginTop: "20%" }}>
                            <Text style={styles.label}>Please enter the valid email address, an OTP will be sent to your email to reset your password.</Text>
                            <InputBox
                                inputOutline={borderStyle}
                                label={'Email'}
                                value={email}
                                name={"Email"}
                                customLabelStyle={{ ...FONTS.robotoregular }}
                                onChangeText={e => { /* handleChange(e, "forgotemail"),  */setErrorLogin(""), setEmail(e), setError("") }}
                            />
                        </View>

                        <View style={{ height: "10%", width: "86%", marginTop: 2 }}>
                            {formErrors && formErrors.forgotemail ? <View style={styles.ErrorCont}><Text style={styles.ErrorText}>{formErrors.forgotemail}</Text></View> : null}
                            {error ? <Text style={styles.errorText}>{error}</Text> : null}
                            {errorLogin ? (<View><Text style={{ color: "red", fontSize: RFValue(10), ...FONTS.robotoregular }}>{errorLogin}</Text></View>) : null}
                        </View>

                        <TouchableOpacity
                            style={[styles.shadow, { width: '50%', height: 40, alignItems: 'center', justifyContent: 'center', marginTop: "5%" }]}
                            onPressOut={e => {/*  handleSubmit(e, 3), */ handleForgotEmail(), Keyboard.dismiss() }} disabled={false}
                        >
                            <LinearGradient
                                style={{ height: '100%', width: '60%', alignItems: 'center', justifyContent: 'center', borderRadius: 30 }}
                                colors={['#9494d6', '#AF2DF8']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={{ color: COLORS.white, fontSize: 16, ...FONTS.robotoregular }}>Verify Email</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View> :
                    <View style={{ flex: 0.5, alignItems: 'center', }}>
                        <View style={{ width: "90%", marginTop: "20%" }}>
                            <Text style={styles.label}>Please check your email for a verification message. Click the link in the message to change your password.</Text>
                            <Text style={[styles.label, { ...FONTS.robotomedium }]}>Thank You !</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.shadow, { width: '86%', height: 40, alignItems: 'center', justifyContent: 'center', marginTop: "5%" }]}
                            onPressOut={e => handleForgotEmail()} disabled={false}
                        >
                            <LinearGradient
                                style={{ height: '100%', width: '60%', alignItems: 'center', justifyContent: 'center', borderRadius: 30 }}
                                colors={['#46aeff', '#5884ff']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={{ color: COLORS.white, fontSize: 16, ...FONTS.robotoregular }}>Resend verification email</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ width: '86%', height: 40, alignItems: 'center', justifyContent: 'center', marginTop: "4%" }}
                            onPressOut={e => handleClose()} disabled={false}
                        >
                            <LinearGradient
                                style={{ height: '100%', width: '60%', alignItems: 'center', justifyContent: 'center', borderRadius: 30 }}
                                colors={['#9494d6', '#AF2DF8']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={{ color: COLORS.white, fontSize: 16, ...FONTS.robotoregular }}>Go to login</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                }
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,

    },
    errorText: {
        color: "red",
        ...FONTS.robotoregular,
        fontSize: RFValue(10),
    },
    textView: {
        width: "80%",
        alignItems: "center",
        marginTop: "2%",
        marginLeft: "10%",
        backgroundColor: COLORS.white,
        borderWidth: 2, borderRadius: 23,

        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    label: {
        color: COLORS.primary,
        fontSize: 16,
        marginBottom: "5%",
        ...FONTS.robotoregular,
        textAlign: "justify"
    },
    textInput: {
        marginLeft: 10,
        height: 60,
        paddingLeft: 6,
        color: COLORS.black,
        backgroundColor: COLORS.white,
        width: "80%",
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
    },
    // ErrorCont: {
    //     marginVertical: "1%"

    // },
    ErrorText: {
        color: "red",
        ...FONTS.robotoregular,
        fontSize: RFValue(10),
    }
});

export default ForgotPassword;
