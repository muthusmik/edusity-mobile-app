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
    Alert,
    StatusBar,
    Platform
} from 'react-native';
import { COLORS, FONTS, images, icons } from '../../constants';
import { RFValue } from 'react-native-responsive-fontsize';
import Toast from 'react-native-simple-toast';
import { useNavigation } from '@react-navigation/native';
import OTPTextView from 'react-native-otp-textinput';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { setConstantValue } from 'typescript';
import { verifyUrl } from '../../services/constant';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { metrices } from '../../constants/metrices';
import Top_Bar from '../../components/topBar';

const OtpPage = ({ route }) => {

    const navigation = useNavigation();
    const loginData = useSelector(state => state.loginHandle);
    const [otp, setOtp] = useState();
    const [errorOtp, setErrorOtp] = useState("");


    const containerStyle = { width: 40, borderBottomWidth: 4, ...FONTS.robotoregular }

    const verifyApi = async () => {
        if (otp && otp.length == 4) {
            console.log("OTP................", otp);
            setErrorOtp("")
            let payload = {
                "email": route.params.data,
                "otp": otp
            }
            console.log("Payload.............", payload);
            await axios.post(verifyUrl, payload).then((response) => {
                console.log(".......................", response.data)
                if (response.data.error == false) {
                    Alert.alert(
                        "Signup Success",
                        "User have been added successfully! You can now Login",
                        [
                            {
                                text: "ok",
                                onPress: () => navigation.navigate("Login")
                            }
                        ]
                    )
                }
                else if (response.data.error == true) {
                    setErrorOtp(response.data.message)
                    console.log("response.data.errorCode != null", response.data.message);
                    // Toast.show(response.data.message, Toast.LONG);
                }
            }).catch((error) => {
                Toast.show("Something went wrong, please try again later!", Toast.LONG, Toast.CENTER);
                console.log("error", error)
            })
        }
        else {
            setErrorOtp("Please enter your OTP code")
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            <StatusBar
                animated={true}
                backgroundColor={COLORS.primary}
            />
            {Platform.OS == 'ios' ? <View style={{ height: "5%" }} /> : null}
            <ImageBackground source={images.LoginBgImage} resizeMode="repeat" style={{ height: "100%", width: "100%" }}>
                {/* <View style={{ flexDirection: "row", alignItems: "center", color: COLORS.black, height: metrices(8) }}>
                    <TouchableOpacity style={{ marginLeft: "4%" }} onPress={() => navigation.navigate('Home', { screen: 'Search' })}>
                        <MCIcon name="keyboard-backspace" size={RFValue(20)} color={COLORS.black} />
                    </TouchableOpacity>
                </View> */}
                <Top_Bar />
                <View style={{ height: metrices(10), alignItems: 'center', justifyContent: 'center', marginTop: metrices(9) }}>
                    <Image
                        source={icons.Edusitylogo}
                        resizeMode="contain"
                        style={{
                            width: '50%',
                            height: '60%',
                        }}
                    />
                </View>
                <View style={{ marginVertical: 14 }}>
                    <Text style={{ color: COLORS.black, fontSize: RFValue(22), ...FONTS.robotomedium, textAlign: "center", marginBottom: 12 }}>OTP Verification</Text>
                    <Text style={styles.paragraph}>Please enter the OTP, which is received in your {route?.params?.data} registered email address.</Text>
                    <Text style={styles.paragraph}>If you’ve not received the verification email, please check your “Spam” folder. You can also click the resent button below to have another email sent to you.</Text>
                </View>
                <View style={{ width: "50%", alignSelf: "center", marginTop: 8 }}>
                    <OTPTextView
                        handleTextChange={(value) => { setOtp(value), setErrorOtp("") }}
                        textInputStyle={containerStyle}
                        inputCount={4}
                        inputCellLength={1}
                        tintColor={COLORS.primary}
                    />
                </View>
                <View style={{ height: metrices(4), marginVertical: metrices(1) }}>
                    {errorOtp ? <Text style={styles.errorText}>{errorOtp}</Text> : null}
                </View>
                <TouchableOpacity
                    style={{ width: '32%', height: 40, alignSelf: 'center', marginTop: metrices(2) }}
                    onPress={() => verifyApi()}
                >
                    <LinearGradient
                        style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 25 }}
                        colors={['#9494d6', '#AF2DF8']}
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
    paragraph: {
        color: COLORS.primary,
        fontSize: RFValue(14),
        marginTop: 4,
        textAlign: "justify",
        ...FONTS.robotoregular,
        width: "90%",
        alignSelf: "center"
    },
    errorText: {
        ...FONTS.robotoregular,
        color: "red",
        fontSize: 12,
        textAlign: "center"
    }
});

export default OtpPage;
