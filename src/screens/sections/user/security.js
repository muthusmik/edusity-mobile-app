import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ToastAndroid,
    Keyboard
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { COLORS, FONTS, } from '../../../constants';
import { useDispatch } from 'react-redux';
import { forgotPasswordHanlder } from '../../../store/redux/forgotPassword';
import { unwrapResult } from '@reduxjs/toolkit';
import { useNavigation } from '@react-navigation/native';
import { metrices } from '../../../constants/metrices';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileInput = (props) => {
    const { placeholder, value, settedValue, setError } = props;
    return (
        <View style={{ borderBottomWidth: 1, width: "100%", justifyContent: "center" }}>
            <TextInput
                placeholder={placeholder}
                style={{ ...FONTS.robotoregular, color: COLORS.black }}
                value={value}
                placeholderTextColor={COLORS.gray}
                selectionColor={COLORS.blue}
                onChangeText={e => { settedValue(e), setError("") }} />
        </View>
    )
}

const Security = () => {

    const [updatePassword, setUpdatePassword] = useState();
    const [error, setError] = useState();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    const removeToken = async () => {
        setUpdatePassword("");
        await AsyncStorage.removeItem("loginToken").then(
            navigation.navigate('Login')
        )
    }

    const handleUpdate = () => {

        if (updatePassword) {
            if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(updatePassword)) {
                setError("Invalid email/Format")
            } else {
                let data = { "forgotemail": updatePassword }
                setError("");
                dispatch(forgotPasswordHanlder(data)).then(unwrapResult).then((originalPromiseResult) => {
                    if (originalPromiseResult == "error") {
                        navigation.navigate("ServerError");
                    }
                    else if (originalPromiseResult.error == true) {
                        setError(originalPromiseResult.message);
                    }
                    else if (originalPromiseResult.error == false) {
                        ToastAndroid.show(originalPromiseResult.message, ToastAndroid.LONG, ToastAndroid.BOTTOM)
                        removeToken()
                    }
                })
                    .catch((rejectedValueOrSerializedError) => {
                        console.log(" update  failed Inside catch", rejectedValueOrSerializedError);
                    })
            }
        }
        else {
            setError("Please enter your email address!")
        }
    }

    return (
        <>
            <View style={{ margin: "3%" }}>
                <Text style={{ color: COLORS.primary, fontSize: RFValue(14), ...FONTS.robotomedium }}>Update Password</Text>
                <Text style={{ color: COLORS.black, fontSize: RFValue(10), ...FONTS.robotoregular }}>Update or Change your password for your account</Text>
            </View>

            <View style={{ margin: "3%" }}>
                <View style={{ width: "100%" }}>
                    <ProfileInput placeholder="Enter your Email" value={updatePassword} settedValue={setUpdatePassword} setError={setError} />
                    <View style={{ height: metrices(5) }}>
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    </View>
                </View>
            </View>
            <TouchableOpacity style={styles.sendButton} activeOpacity={0.7} onPressIn={() => { handleUpdate(), dismissKeyboard() }}>
                <Text style={{ color: COLORS.white, ...FONTS.robotoregular, textAlign: "center" }}>Send Email</Text>
            </TouchableOpacity>
        </>
    );
}

export default Security;

const styles = StyleSheet.create({
    iconStyle: {
        fontSize: 40,
        marginTop: 30,
        color: 'black',
    },
    sendButton: {
        backgroundColor: COLORS.primary,
        width: "30%",
        borderRadius: 10,
        padding: "2%",
        alignSelf: "center"
    },
    errorText: {
        color: "red",
        width: "100%",
        ...FONTS.robotoregular,
        fontSize: RFValue(10),
    }
})