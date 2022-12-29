
import React from 'react';
import { useState, useEffect } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
    ImageBackground,
    Pressable,
    Dimensions
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import { icons, images, COLORS, FONTS, SIZES } from '../../constants';
import Form from './signUpForm';
import useForm from '../../components/validate/useForm';
import validate from '../../components/validate/validate';


const SignUp = ({ navigation }) => {
    const { handleChange, details, handleSubmit, formErrors, data } = useForm(validate);

    return (
        <View style={{ backgroundColor: COLORS.white }}>
            <ImageBackground source={images.LoginBgImage} resizeMode="repeat" style={{ height: "100%", width: "100%" }} >
                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: "26%" }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', height: "10%", borderWidth: 0,marginTop:"5%" }}>
                        <Image
                            source={icons.Edusitylogo}
                            resizeMode="contain"
                            style={{
                                width: '50%',
                                height: '60%',
                            }}
                        />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ ...FONTS.robotomedium, color: COLORS.black, fontSize: RFValue(22),marginTop:"8%" }}>Sign Up</Text>
                    </View>
                    <View style={{ width: "100%", alignItems: "center" }}>
                        <Form />
                        <Pressable style={{ borderWidth: 0 }} onPress={() => navigation.navigate("Login")}>
                            <Text style={{ color: COLORS.black, ...FONTS.robotoregular }}>Already have an account?
                                <Text style={{ color: COLORS.blue, ...FONTS.robotoregular }}> Sign In</Text></Text>
                        </Pressable>
                        {/* <Pressable style={{ borderWidth: 0 }} onPress={() => navigation.navigate("NetworkError")}>
                            <Text style={{ color: COLORS.black, ...FONTS.robotoregular }}>Already have an account?
                                <Text style={{ color: COLORS.blue, ...FONTS.robotoregular }}> Network</Text></Text>
                        </Pressable> */}
                    </View>
                </ScrollView>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({

    containterfull: {
        width: Dimensions.get("window").width, //for full screen
        height: Dimensions.get("window").height //for full screen
    },
    fixed: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    scrollview: {
        backgroundColor: 'transparent'
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderWidth: 5,
    }, textView: {
        width: "100%",
        alignItems: "center",
        marginTop: "2%"
    },
    label: {
        color: COLORS.black, alignContent: "flex-start", fontSize: 20, left: "13%"
    },
    textInput: {
        height: 60,
        paddingLeft: 6,
        color: COLORS.white,
        backgroundColor: COLORS.black,
        width: "80%",
        borderWidth: 2, borderRadius: 20

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
    }
});

export default SignUp;
