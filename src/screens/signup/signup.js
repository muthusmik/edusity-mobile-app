
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
    Dimensions,
    StatusBar, TouchableOpacity
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { icons, images, COLORS, FONTS, SIZES } from '../../constants';
import Form from './signUpForm';
import useForm from '../../components/validate/useForm';
import validate from '../../components/validate/validate';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'


const SignUp = ({ navigation }) => {
    const { handleChange, details, handleSubmit, formErrors, data } = useForm(validate);

    return (
        <View style={{ backgroundColor: COLORS.white }}>
            <StatusBar
                animated={true}
                backgroundColor={COLORS.primary}
            />
            {Platform.OS == 'ios' ? <View style={{ height: "5%" }} /> : null}

            <ImageBackground source={images.LoginBgImage} resizeMode="repeat" style={{ height: "100%", width: "100%" }} >
                <View style={{ flexDirection: "row", alignItems: "center", color: COLORS.black, height: "8%" }}>
                    <TouchableOpacity style={{ marginLeft: "4%" }} onPress={() => navigation.goBack()}>
                        <MCIcon name="keyboard-backspace" size={RFValue(20)} color={COLORS.black} />
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', height: "10%" }}>
                    <Image
                        source={icons.Edusitylogo}
                        resizeMode="contain"
                        style={{
                            width: '50%',
                            height: '60%',
                        }}
                    />
                </View>
                <View style={{ alignItems: 'center', paddingBottom: "1%", marginTop: "4%" }}>
                    <Text style={{ ...FONTS.robotomedium, color: COLORS.black, fontSize: RFValue(22) }}>Sign Up</Text>
                </View>
                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: "72%" }}>
                    <View style={{ width: "100%", alignItems: "center" }}>
                        <Form />
                        <Pressable onPress={() => navigation.navigate("Login")}>
                            <Text style={{ color: COLORS.black, ...FONTS.robotoregular }}>Already have an account?
                                <Text style={{ color: COLORS.edusity, ...FONTS.robotoregular }}> Sign In</Text></Text>
                        </Pressable>
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
