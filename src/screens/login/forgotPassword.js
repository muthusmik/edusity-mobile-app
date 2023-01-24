
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
import InputBox from 'react-native-floating-label-inputbox';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import LinearGradient from 'react-native-linear-gradient';
import { icons, images, COLORS, FONTS, SIZES } from '../../constants';
import useForm from "../../components/validate/useForm";
import validate from "../../components/validate/validate";
import { forgotPasswordHanlder } from '../../store/redux/forgotPassword';
import { RFValue } from 'react-native-responsive-fontsize';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'

const ForgotPassword = ({ navigation }) => {
    const { handleChange, details, handleSubmit, formErrors,data } = useForm(validate);
    const dispatch=(useDispatch());
    const[errorLogin,setErrorLogin]=useState(null);
    const[errorEmail,setErrorEmail]=useState(null);
    const[errorPassword,setErrorPassword]=useState(null);
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
 

    // useEffect(()=>{
    //     console.log(formErrors,"formErrors")
    //     if(formErrors && Object.keys(formErrors).length>0 ){
    //         if(formErrors && formErrors.forgotemail){
    //             setEmail(formErrors.forgotemail)
    //             setErrorEmail(true);
    //         }
    //     }
    // },[formErrors])


    useEffect(() => {
    //     console.log("hello",data && Object.keys(data).length)
    //     if (data && Object.keys(data).length==1 )  {
    //     //   console.log("hello",data)
    //       dispatch(forgotPasswordHanlder(data))
    //       .then(unwrapResult)
    //       .then((originalPromiseResult) => {
    //           console.log("successfully returned to login with response ",originalPromiseResult); 
    //           if(!originalPromiseResult.errorCode){
    //             console.log(originalPromiseResult)
    //             navigation.navigate("Login");
    //             Toast.show("Successfully Sent Verification code to your email, Please click  the Link  and reset your password", Toast.LONG);
    //             Toast
    //           }else if(originalPromiseResult.errorCode){         
    //             console.log("failure")
    //             setErrorLogin(originalPromiseResult.errormessage)
    //                }
    //         })
    //       .catch((rejectedValueOrSerializedError) => {
    //               console.log(" Inside catch",rejectedValueOrSerializedError);
    //              })
    //   }
    const ForgotApi=async(data)=>{
        // console.log("uhuuuhuhuuhuuhuhu",data);
        let email=data.forgotemail
        let payload={
            "email":email}
        // console.log("payload",payload)
        let url="https://newlogin.edusity.com/send-otp";
        let forgot = await axios.post(url,payload).then(response =>{
            navigation.navigate("OtpPage"),
            console.log("Forgot api",response.data)
    }).catch(err=> console.log("error",err))
    }
    ForgotApi(data)

    },[data]);
    
    const borderStyle={
        borderWidth:0
    }

return (
        <KeyboardAvoidingView style={styles.container}>
              <StatusBar
                        animated={true}
                        backgroundColor={COLORS.primary}
                    />
            <ImageBackground source={images.LoginBgImage} resizeMode="repeat" style={{ height: "100%", width: "100%" }}>
            <View style={{ flexDirection: "row", alignItems: "center", color: COLORS.black, height: "8%", borderBottomStartRadius: 30, borderBottomEndRadius: 30 }}>
                        <TouchableOpacity style={{ marginLeft: "4%" }} onPress={() => navigation.goBack()}>
                            <MCIcon name="keyboard-backspace" size={RFValue(20)} color={COLORS.black} />
                        </TouchableOpacity>
                    </View>
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
                <View style={{ flex: 0.1, alignItems: 'center', top: "10%", justifyContent: 'center', }}>
                    <View style={{ alignItems: 'center', marginHorizontal: SIZES.padding }}>
                        <Text style={{ ...FONTS.robotomedium, color: COLORS.black, fontSize: 23 }}>Forgot Password</Text>

                    </View>
                </View>
                <View style={{ flex: 0.5, alignItems: 'center', }}>
                    <View style={{ width: "80%", marginTop: "25%" }}>
                        {/* <Text style={styles.label}>Let us Find Your Account!</Text> */}
                        <Text style={styles.label}>Please enter the valid email address, an OTP will be sent to your email to reset your password.</Text>
                        <InputBox
                            inputOutline={borderStyle}
                            label={'Email'}
                            value={email}
                            name={"Email"}
                            customLabelStyle={{ ...FONTS.robotoregular }}
                            onChangeText={e => { handleChange(e, "forgotemail"), setErrorLogin(""), setEmail(e) }}
                        />
                        {formErrors && formErrors.forgotemail ? <View style={{ ...styles.ErrorCont }}><Text style={{ ...styles.ErrorText }}>{formErrors.forgotemail}</Text></View> : null}

                        {/* <Text style={styles.label}>Let us Find Your Account!</Text>
                        <View style={{...styles.textView,...{borderColor:(errorLogin || errorEmail)?"red":"gray", shadowColor:(errorLogin)?"red":COLORS.black,}}}>
                            <TextInput placeholder='Enter your Email'
                                placeholderTextColor={COLORS.primary}
                                style={{...styles.textInput,...{color:(errorLogin || errorEmail)?"red":COLORS.black,}}}
                                value={email}
                                selectionColor={COLORS.blue}
                                onChangeText={e => {handleChange(e, "forgotemail"),setErrorLogin(""),setErrorEmail(""),setEmail(e)}} />
                        </View> */}
                    </View>
                    <View style={{ height: "6%", borderWidth: 0 }}>
                        {errorLogin ? (<View><Text style={{ color: "red", fontSize: RFValue(10), ...FONTS.robotoregular }}>{errorLogin}</Text></View>) : null}
                    </View>


                    <TouchableOpacity
                        style={[styles.shadow, { width: '50%', height: 40, alignItems: 'center', justifyContent: 'center',marginTop:"5%" }]}
                        onPressOut={e => { handleSubmit(e,3), Keyboard.dismiss}} disabled={false}
                    >
                        <LinearGradient
                            style={{ height: '100%', width: '60%', alignItems: 'center', justifyContent: 'center', borderRadius: 30 }}
                            colors={['#46aeff', '#5884ff']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={{ color: COLORS.white, fontSize: 16, ...FONTS.robotoregular }}>Verify Email</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* <Pressable style={{ marginTop: "2%" }} onPress={() => navigation.navigate("SignUp")}>
                        <Text style={{ color: COLORS.black, ...FONTS.robotoregular }}>Don't have an account?
                            <Text style={{ color: COLORS.blue, ...FONTS.robotoregular }}> Sign Up</Text></Text>
                    </Pressable> */}
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
    textView: {
        width: "80%",
        alignItems: "center",
        marginTop: "2%",
        marginLeft:"10%",
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

    }
    ,
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
