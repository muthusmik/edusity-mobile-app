import React from "react";
import InputBox from 'react-native-floating-label-inputbox';
import { useState, useEffect } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import LoaderKit from 'react-native-loader-kit'
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
import { OTPUrl } from '../../services/constant';
const Form = () => {
    const navigation = useNavigation()
    const dispatch = (useDispatch());
    const [errorLogin, setErrorLogin] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [phone, setPhone] = useState("");
    const [loader, setLoader] = useState(false);
    const { handleChange, details, handleSubmit, formErrors, data } = useForm(validate);

    useEffect(() => {
        console.log(data == undefined ? true : false)
        if (!!data || (data != null)) {
            setLoader(true);
            console.log("hello", data)
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
                    console.log("successfully returned to login with response ", originalPromiseResult);
                    if (!originalPromiseResult.erroCode) {
                        setErrorLogin("")
                        // Toast.show(originalPromiseResult.message, Toast.LONG);
                        setLoader(false);
                        console.log(originalPromiseResult.errorCode, "hello")
                        if (originalPromiseResult.errorCode == "") {
                            var emailforOtp = data.email;
                            //let url = "https://backend-linux-login.azurewebsites.net/send-otp"
                            await axios.post(OTPUrl, { "email": data.email }).then(response => (
                                console.log("Forgot api", response.data),

                                navigation.navigate("OtpPage", { emailforOtp })
                            )).catch(err =>
                                console.log("error", err))
                        } else {
                            Toast.show(originalPromiseResult.message, Toast.LONG);
                        }
                    } else {
                        setLoader(false);

                        Toast.show(originalPromiseResult.errormessage, "Please Verify the link in your email and try to login", Toast.LONG);
                    }
                }
                )
                .catch((rejectedValueOrSerializedError) => {
                    setLoader(false);
                    Toast.show("Something went wrong please try after some time!", Toast.LONG);
                    // console.log(" Inside catch", rejectedValueOrSerializedError);
                })
        } else {
            console.log("No Data")
        }
    }, [data]);





    return (
        <View style={{ width: "100%", alignItems: "center" }}>
          {  loader ?
            <View> 
            <LoaderKit
                style={{ height: 25 }}
                name={'Pacman'} // Optional: see list of animations below
                size={10} // Required on iOS
                color={COLORS.primary} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',
            />
            </View>:
            <>
           <View style={{ width: "85%", marginTop: "2%" }}>
                <InputBox
                    inputOutline
                    label={'First Name'}
                    value={firstName}
                    customLabelStyle={{ ...FONTS.robotoregular }}
                    name={"FirstName"}
                    leftIcon={<MCI name={'format-letter-case-lower'} size={18} style={{color:COLORS.primary}} />}
                    onChangeText={e => { handleChange(e, "firstName"), setFirstName(e) }}
                />
                {formErrors && formErrors.firstName ?
                    <View style={{ ...styles.ErrorCont }}>
                        <Text style={{ ...styles.ErrorText }}>{formErrors.firstName}
                        </Text>
                    </View> : null}
            </View>
            <View style={{ width: "85%", marginTop: "2%" }}>
                <InputBox
                    inputOutline
                    label={'Last Name'}
                    customLabelStyle={{ ...FONTS.robotoregular }}
                    value={lastName}
                    name={"LastName"}
                    leftIcon={<MCI name={'format-letter-case-lower'} size={18} style={{color:COLORS.primary}} />}
                    onChangeText={e => { handleChange(e, "lastName"), setLastName(e) }}
                />
                {formErrors && formErrors.lastName ?
                    <View style={{ ...styles.ErrorCont }}>
                        <Text style={{ ...styles.ErrorText }}>{formErrors.lastName}</Text>
                    </View> : null}
            </View>



            <View style={{ width: "85%", marginTop: "2%" }}>
                <InputBox
                    inputOutline
                    label={'Email'}
                    value={email}
                    name={"Email"}
                    customLabelStyle={{ ...FONTS.robotoregular }}
                    leftIcon={<MCI name={'email'} size={18} style={{color:COLORS.primary}} />}
                    onChangeText={e => { handleChange(e, "email"), setEmail(e) }}
                />
                {formErrors && formErrors.email ?
                    <View style={{ ...styles.ErrorCont }}>
                        <Text style={{ ...styles.ErrorText }}>{formErrors.email}</Text>
                    </View> : null}
            </View>



            <View style={{ width: "85%", marginTop: "2%" }}>
                <InputBox
                    inputOutline
                    label={'Password'}
                    value={password}
                    name={"Password"}
                    customLabelStyle={{ ...FONTS.robotoregular }}
                    // leftIcon={<MCI name={'form-textbox-password'} size={18} style={{color:COLORS.primary}} />}
                    rightIcon={<FontAwesome5 name={'eye'} size={18} style={{color:COLORS.primary}} />}
                    passHideIcon={<FontAwesome5 name={'eye-slash'} size={18} style={{color:COLORS.primary}} />}
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
                {formErrors && formErrors.password ?
                    <View style={{ ...styles.ErrorCont }}>
                        <Text style={{ ...styles.ErrorText }}>{formErrors.password}</Text>
                    </View> : null}
            </View>
            <View style={{ width: "85%", marginTop: "2%" }}>
                <InputBox
                    inputOutline
                    label={' Confirm Password'}
                    value={confirmPassword}
                    secureTextEntry={true}
                    // leftIcon={<MCI name={'form-textbox-password'} size={18} style={{color:COLORS.primary}} />}
                    rightIcon={<FontAwesome5 name={'eye'} size={18} style={{color:COLORS.primary}} />}
                    passHideIcon={<FontAwesome5 name={'eye-slash'} size={18} style={{color:COLORS.primary}} />}
                    customLabelStyle={{ ...FONTS.robotoregular }}
                    onChangeText={e => { handleChange(e, "password2"), setConfirmPassword(e) }}
                />
                {formErrors && formErrors.password2 ?
                    <View style={{ ...styles.ErrorCont }}>
                        <Text style={{ ...styles.ErrorText }}>{formErrors.password2}</Text>
                    </View> : null}
            </View>


            <View style={{ width: "85%", marginTop: "2%" }}>
                <InputBox
                    inputOutline
                    label={'UserName'}
                    value={userName}
                    leftIcon={<FontAwesome5 name={'user-graduate'} size={18} style={{color:COLORS.primary}} />}
                    customLabelStyle={{ ...FONTS.robotoregular }}
                    onChangeText={e => { handleChange(e, "userName"), setUserName(e) }}
                />
                {formErrors && formErrors.userName ?
                    <View style={{ ...styles.ErrorCont }}>
                        <Text style={{ ...styles.ErrorText }}>{formErrors.userName}</Text>
                    </View> : null}
            </View>
            <View style={{ width: "85%", marginTop: "2%" }}>
                <InputBox
                    inputOutline
                    label={'Phone'}
                    value={phone}
                    maxLength={10}
                    leftIcon={<FontAwesome5 name={'mobile'} size={18} style={{color:COLORS.primary}} />}
                    customLabelStyle={{ ...FONTS.robotoregular }}
                    onChangeText={e => { handleChange(e, "phonenumber"), setPhone(e) }}
                />
                {formErrors && formErrors.phonenumber ? <View style={{ ...styles.ErrorCont }}><Text style={{ ...styles.ErrorText }}>{formErrors.phonenumber}</Text></View> : null}
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

            {formErrors && formErrors.signundef ?
                <View style={{ ...styles.ErrorCont }}>
                    <Text style={{ ...styles.ErrorText }}>{formErrors.signundef}</Text>
                </View> : null}

            <TouchableOpacity
                style={[styles.shadow, { width: '100%', height: 40, alignItems: 'center', justifyContent: 'center', marginTop: "6%" }]}
                onPress={e => { handleSubmit(e, 2) }}
            >
                <LinearGradient
                    style={{ height: '100%', width: '30%', alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}
                    colors={['#46aeff', '#5884ff']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Text style={{ color: COLORS.white, ...FONTS.body3 }}>Sign Up</Text>
                </LinearGradient>
            </TouchableOpacity>
            </>
}
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
        fontSize: 16, padding: "8%",
        ...FONTS.robotoregular,
    },
    // ErrorCont:{
    //     marginVertical:"1%"

    // },
    ErrorText: {
        color: "red",
        ...FONTS.robotoregular,
        fontSize: RFValue(10),
    }
})
export default Form;