import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    StyleSheet,
    View,
    Text,
    KeyboardAvoidingView,
    ImageBackground,
    Image,
    TouchableOpacity,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, images, icons } from '../../constants';
import { RFValue } from 'react-native-responsive-fontsize';
import Toast from 'react-native-simple-toast';
import { useNavigation } from '@react-navigation/native';
import OTPTextView from 'react-native-otp-textinput';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { setConstantValue } from 'typescript';
import { verifyUrl } from '../../services/constant';
// Api Call


const OtpPage = ({route}) => {
    const [otp, setOtp] = useState();
    const navigation=useNavigation();
    const containerStyle = { width: 40, borderBottomWidth: 4, ...FONTS.robotoregular }
    // console.log("reddddddddddddddd",route.params)
    const handleChange = (value) => {
        setOtp(value)
    }
    const verifyApi=async()=>{
        let payload={
            "email": route.params.emailforOtp,
            "otp": otp
        }
        //let url="https://backend-linux-login.azurewebsites.net/verify-otp"
        await axios.post(verifyUrl,payload).then(response =>{
            // console.log("Forgot api",response.data)
            // console.log("Forgot api",payload)
            if (response.data.message=='Email verified successfully.'){
                Alert.alert(
                    "Signup Success",
                    "User have been added successfully!,you can now Login",
                    [
                        {
                            text:"ok",
                            onPress:()=>navigation.navigate("Login")
                        }
                    ]
                )
                // Toast.show(response.data.message,"User successfully created ,you can now login using your email and password", Toast.LONG);
            }else{
                Toast.show(response.data.message, Toast.LONG);
            }
            
    }).catch(err=> console.log("error",err))
    }
    const verifyOtpFunction=()=>{
        // console.log("I am work/ing!!!!!");
        Alert.alert(
            "Signup Success",
            "User have been added successfully!",
            [
                {
                    text:"ok",
                    onPress:()=>navigation.navigate("Login")
                }
            ]
        )

    }

    const loginData = useSelector(state => state.loginHandle);
    // console.log(loginData, "loginData")
    return (
        <KeyboardAvoidingView style={styles.container}>
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
                <View style={{ flex: 0.1, top: "15%", alignItems: "center" }}>
                    <Text style={{ color: COLORS.black, fontSize: RFValue(18, 580), ...FONTS.robotomedium }}>OTP Verification</Text>
                    <Text style={{ color: COLORS.primary, fontSize: RFValue(16),marginTop:"5%", ...FONTS.robotoregular }}>Please enter the OTP, which is received in your registered email address.</Text>
                </View>
                <View style={{ flex: 0.1, top: "20%", width: "50%", alignSelf: "center" }}>
                    <OTPTextView
                        handleTextChange={(value) => {setOtp(value) }}
                        textInputStyle={containerStyle}
                        inputCount={4}
                        inputCellLength={1}
                        tintColor={COLORS.primary}
                    />
                </View>
                <TouchableOpacity
                    style={{ width: '32%', height: 40, alignSelf: 'center', top: "25%" }}
                    onPress={()=>{verifyApi(),console.log("okok")}}
                >
                    <LinearGradient
                        style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 25 }}
                        colors={['#46aeff', '#5884ff']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={{ color: COLORS.white, fontSize: 16, ...FONTS.robotoregular }}>Verify OTP</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },

});

export default OtpPage;
