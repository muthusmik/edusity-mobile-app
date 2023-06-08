import React from "react";
import InputBox from 'react-native-floating-label-inputbox';
import { useState, useEffect } from 'react';
import {
    StyleSheet,
    Modal,
    View,
    Text,
    Button,
    TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import { icons, images, COLORS, FONTS, SIZES } from '../../constants';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { useNavigation } from "@react-navigation/native";
import { unwrapResult } from '@reduxjs/toolkit';
import { signUpHanlder } from "../../store/redux/signup";
import useForm from "../../components/validate/useForm";
import validate from "../../components/validate/validate";
import FaIcon from "react-native-vector-icons/FontAwesome"
import { RFC_2822 } from "moment";
import axios from "axios";
import { RFValue } from "react-native-responsive-fontsize";
import { OTPUrl, verificationLinkUrl } from '../../services/constant';
import { metrices } from "../../constants/metrices";
import Entypo from 'react-native-vector-icons/Entypo';

const Form = ({
    setLoader,
    verificationEmail,
    setVerificationEmail,
    errorMessage,
    setErrorMessage
}) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [phone, setPhone] = useState("");
    const [verificationModal, setVerificationModal] = useState(false);

    const { handleChange, details, handleSubmit, formErrors, data } = useForm(validate);

    const verificationLinkFunction = async (data) => {
        // let verification = await axios.post(verificationLinkUrl, { "email": data }).then((response) => {
        let verification = await axios.post(OTPUrl, { "email": data }).then((response) => {
            return response.data;
        }).catch((error) => {
            Toast.show("Somtheing went wrong, please try again later!", Toast.LONG)
        })
        console.log("verification...............", verification.errorCode)
        if (verification.errorCode == "") {
            // setVerificationEmail(data)
            // setVerificationModal(true)
            navigation.navigate("OtpPage", { data })
            Toast.show(verification.message, Toast.LONG)
        }
        else if (verification.errorCode != "") {
            Toast.show(verification.message, Toast.LONG)
        }
    }

    useEffect(() => {
        if (!!data || (data != null)) {
            setLoader(true);
            const SignupForm = {
                "firstName": data.firstName,
                "lastName": data.lastName,
                "userName": data.userName,
                "email": data.email,
                "password": data.password,
                "phoneNumber": data.phoneNumber,
                "countryCode": "IN",
                "bio": "Defaut Bio...",
                "role": "2"
            }
            dispatch(signUpHanlder(SignupForm))
                .then(unwrapResult)
                .then(async (originalPromiseResult) => {
                    console.log("Response from singup handler..............", originalPromiseResult);
                    if (originalPromiseResult == "error") {
                        navigation.navigate("ServerError");
                    }
                    else if (originalPromiseResult.error == true) {
                        setErrorMessage(originalPromiseResult.message)
                        setLoader(false);
                    }
                    else if (originalPromiseResult.error == false) {
                        console.log("Inisde the error false conidtion........", originalPromiseResult.message);
                        setErrorMessage("");
                        Toast.show(originalPromiseResult.message, Toast.LONG, Toast.CENTER)
                        if (originalPromiseResult.errorCode == "") {
                            let emailforOtp = data.email;
                            verificationLinkFunction(emailforOtp)
                        } else {
                            setLoader(false);
                            Toast.show(originalPromiseResult.message, Toast.LONG);
                        }
                    }
                    // if (!originalPromiseResult.erroCode) {
                    //     setErrorMessage("")
                    //     // Toast.show(originalPromiseResult.message, Toast.LONG);
                    //     setLoader(false);
                    //     if (originalPromiseResult.errorCode == "") {
                    //         var emailforOtp = data.email;
                    //         //let url = "https://backend-linux-login.azurewebsites.net/send-otp"
                    //         await axios.post(OTPUrl, { "email": data.email }).then(response => (
                    //             console.log("Forgot api", response.data),
                    //             navigation.navigate("OtpPage", { emailforOtp })
                    //         )).catch(err =>
                    //             console.log("error", err))
                    //     } else {
                    //         Toast.show(originalPromiseResult.message, Toast.LONG);
                    //     }
                    // } else {
                    //     setLoader(false);
                    //     Toast.show(originalPromiseResult.errormessage, "Please Verify the link in your email and try to login", Toast.LONG);
                    // }
                }).catch((rejectedValueOrSerializedError) => {
                    setLoader(false);
                    Toast.show("Something went wrong please try after some time!", Toast.LONG);
                })
        }
        // else {
        //     console.log("No Data")
        // }
    }, [data]);

    return (
        <View style={{ width: "100%", alignItems: "center" }}>
            <View style={styles.inputContainer}>
                <InputBox
                    inputOutline
                    label={'First Name'}
                    value={firstName}
                    customLabelStyle={{ ...FONTS.robotoregular }}
                    name={"FirstName"}
                    //leftIcon={<MCI name={'format-letter-case-lower'} size={38} style={{color:COLORS.primary,width:"150%",left:"40%"}}  />}
                    onChangeText={e => { handleChange(e, "firstName"), setFirstName(e), setErrorMessage("") }}
                    containerStyles={{ padding: "5%" }}
                />
            </View>
            {formErrors && formErrors.firstName ?
                <View style={styles.ErrorContainer}>
                    <Text style={styles.ErrorText}>{formErrors.firstName}</Text>
                </View> : null}
            <View style={styles.inputContainer}>
                <InputBox
                    inputOutline
                    label={'Last Name'}
                    customLabelStyle={{ ...FONTS.robotoregular }}
                    value={lastName}
                    name={"LastName"}
                    //leftIcon={<MCI name={'format-letter-case-lower'} size={38} style={{color:COLORS.primary,width:"150%",left:"40%"}} />}
                    onChangeText={e => { handleChange(e, "lastName"), setLastName(e) }}
                />
            </View>
            {formErrors && formErrors.lastName ? <View style={styles.ErrorContainer}>
                <Text style={styles.ErrorText}>{formErrors.lastName}</Text>
            </View> : null}
            <View style={styles.inputContainer}>
                <InputBox
                    inputOutline
                    label={'Email'}
                    value={email}
                    name={"Email"}
                    customLabelStyle={{ ...FONTS.robotoregular }}
                    //leftIcon={<MCI name={'email'} size={38} style={{color:COLORS.primary,width:"150%",left:"40%"}} />}
                    onChangeText={e => { handleChange(e, "email"), setEmail(e) }}
                />
            </View>
            {formErrors && formErrors.email ? <View style={styles.ErrorContainer}>
                <Text style={{ ...styles.ErrorText }}>{formErrors.email}</Text>
            </View> : null}
            <View style={styles.inputContainer}>
                <InputBox
                    inputOutline
                    label={'Password'}
                    value={password}
                    name={"Password"}
                    customLabelStyle={{ ...FONTS.robotoregular }}
                    // leftIcon={<MCI name={'form-textbox-password'} size={18} style={{color:COLORS.primary}} />}
                    //rightIcon={<FontAwesome5 name={'eye'} size={23} style={{color:COLORS.primary,right:"40%"}}  />}
                    passHideIcon={<FontAwesome5 name={'eye-slash'} size={18} style={{ color: COLORS.primary }} />}
                    secureTextEntry={true}
                    // rightIcon={<Image
                    //     source={icons.Edusitylogo}
                    //     resizeMode="contain"
                    //     style={{
                    //         width: '5%',
                    //         height: '5%',
                    //     }}
                    // />}
                    // passHideIcon={<FontAwesome  name={'eye-slash'} size={5}/>}
                    onChangeText={e => { handleChange(e, "password"), setPassword(e) }}
                />
            </View>
            {formErrors && formErrors.password ? <View style={styles.ErrorContainer}>
                <Text style={styles.ErrorText}>{formErrors.password}</Text>
            </View> : null}
            <View style={styles.inputContainer}>
                <InputBox
                    inputOutline
                    label={' Confirm Password'}
                    value={confirmPassword}
                    secureTextEntry={true}
                    // leftIcon={<MCI name={'form-textbox-password'} size={18} style={{color:COLORS.primary}} />}
                    // rightIcon={<FontAwesome5 name={'eye'} size={18} style={{color:COLORS.primary}} />}
                    passHideIcon={<FontAwesome5 name={'eye-slash'} size={18} style={{ color: COLORS.primary }} />}
                    customLabelStyle={{ ...FONTS.robotoregular }}
                    onChangeText={e => { handleChange(e, "password2"), setConfirmPassword(e) }}
                />
            </View>
            {formErrors && formErrors.password2 ? <View style={styles.ErrorContainer}>
                <Text style={styles.ErrorText}>{formErrors.password2}</Text>
            </View> : null}
            <View style={styles.inputContainer}>
                <InputBox
                    inputOutline
                    label={'UserName'}
                    value={userName}
                    //leftIcon={<FontAwesome5 name={'user-graduate'} size={18} style={{color:COLORS.primary}} />}
                    customLabelStyle={{ ...FONTS.robotoregular }}
                    onChangeText={e => { handleChange(e, "userName"), setUserName(e) }}
                />
            </View>
            {formErrors && formErrors.userName ? <View style={styles.ErrorContainer}>
                <Text style={styles.ErrorText}>{formErrors.userName}</Text>
            </View> : null}
            <View style={{ width: "85%", }}>
                <InputBox
                    inputOutline
                    label={'Phone'}
                    value={phone}
                    maxLength={10}
                    // leftIcon={<FontAwesome5 name={'mobile'} size={18} style={{color:COLORS.primary}} />}
                    customLabelStyle={{ ...FONTS.robotoregular }}
                    onChangeText={e => { handleChange(e, "phoneNumber"), setPhone(e) }}
                />
            </View>

            {/* <Text  style={{color: COLORS.black ,fontSize:RFValue(13),...FONTS.robotomedium, marginHorizontal: "10%",marginTop:"2%"}}>Choose your Role:</Text>
            <View style={{ width: "85%",borderWidth:0, flexDirection: "row", height: "10%", alignItems: "center", justifyContent: "space-around" }}>
           
                <TouchableOpacity style={{ ...styles.checkbox, ...{ backgroundColor: (checked=="3")?COLORS.primary:COLORS.lightGray } }} onPressIn={()=>setChecked("3")}>
                    <Text style={{ ...{ color: (checked=="3")?COLORS.white:COLORS.black, }, ...styles.checkboxText }}>Student</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...styles.checkbox, ...{ backgroundColor: (checked=="4")?COLORS.primary:COLORS.lightGray  } }} onPressIn={()=>setChecked("4")}>
                    <Text style={{ ...{ color: (checked=="4")?COLORS.white:COLORS.black, }, ...styles.checkboxText }}>Instructor</Text>
                </TouchableOpacity >
            </View> */}
            <View style={styles.ErrorCont}>
                {formErrors && formErrors.phoneNumber ? <Text style={styles.ErrorText}>{formErrors.phoneNumber}</Text> : null}
                {formErrors && formErrors.signundef ? <Text style={styles.ErrorText}>{formErrors.signundef}</Text> : null}
                {errorMessage ? <Text style={styles.ErrorText}>{errorMessage}</Text> : null}
            </View>
            <TouchableOpacity
                style={{ width: '46%', height: 40, alignItems: 'center', justifyContent: 'center', marginBottom: "4%" }}
                onPress={e => { handleSubmit(e, 2) }}
            >
                <LinearGradient
                    style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 20, margin: 10 }}
                    colors={['#9494d6', '#AF2DF8']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Text style={{ color: COLORS.white, ...FONTS.body3 }}>Sign Up</Text>
                </LinearGradient>
            </TouchableOpacity>
            <View style={styles.centeredView}>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={verificationModal}
                    onRequestClose={() => {
                        setVerificationModal(false)
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity onPress={() => setVerificationModal(false)} style={{ alignSelf: "flex-end" }}>
                                <Entypo name="squared-cross" color="#eb2640" size={25} />
                            </TouchableOpacity>
                            <Text style={{ ...FONTS.body2, color: COLORS.edusity, textAlign: "center" }}>Please verify mail</Text>
                            <Text style={{ ...FONTS.body3, color: COLORS.black, marginVertical: 10 }}>We have sent an email to <Text style={{ color: COLORS.primary }}>{verificationEmail}</Text>. You need to verify your email to continue.</Text>
                            <Text style={{ ...FONTS.body3, color: COLORS.black }}>If you’ve not received the verification email, please check your “Spam” folder. You can also click the resent button below to have another email sent to you.</Text>
                            <View style={{ width: "40%", alignSelf: "center" }}>
                                <Button title="Okay"></Button>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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
    inputContainer: {
        width: "85%"
    },
    checkbox: {
        flexDirection: "column",
        width: "30%",
        borderWidth: 1,
        borderColor: "#FFF",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "space-around"
    },
    checkboxText: {
        fontSize: 16,
        padding: "8%",
        ...FONTS.robotoregular
    },
    ErrorContainer: {
        width: "80%",
        paddingTop: 2
    },
    ErrorCont: {
        marginVertical: 4,
        width: "80%",
        height: metrices(5)
    },
    ErrorText: {
        color: "red",
        ...FONTS.robotoregular,
        fontSize: RFValue(10)
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    modalView: {
        backgroundColor: 'white',
        width: "90%",
        padding: 10,
        borderRadius: 20
    },
})
export default Form;