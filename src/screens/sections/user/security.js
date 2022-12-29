import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StatusBar,
    StyleSheet,
    TouchableOpacity, Image,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Colors } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { icons, COLORS, FONTS, } from '../../../constants';
import { Avatar } from '@rneui/themed';
import { useDebugValue } from 'react';
import { useDispatch } from 'react-redux';
import { forgotPasswordHanlder } from '../../../store/redux/forgotPassword';
import { unwrapResult } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

const ProfileInput = (props) => {
    const { placeholder, value, settedValue } = props;
    return (
        <View style={{ borderBottomWidth: 1, width: "90%", borderRadius: 20, justifyContent: "center", }}>
            <TextInput
                placeholder={placeholder}
                style={{ marginHorizontal: 10, ...FONTS.robotoregular }}
                value={value}
                placeholderTextColor={COLORS.gray}
                selectionColor={COLORS.blue}
                onChangeText={e => settedValue(e)} />
        </View>
    )
}

const Security = () => {

    const [updatePassword, setUpdatePassword] = useState();
    const [error, setError] = useState();
    useEffect(() => {
        console.log(updatePassword, "updatePassword")
    }, [updatePassword])
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const handleUpdate = () => {
        if (updatePassword) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(updatePassword)) {
                setError({ "email": "Invalid email/Format" })
            } else {
                let data = { "forgotemail": updatePassword }
                setError("");
                dispatch(forgotPasswordHanlder(data)).then(unwrapResult).then((originalPromiseResult) => {
                    console.log("update response............. ", originalPromiseResult)
                    if (!originalPromiseResult?.errorCode) {
                        navigation.navigate('Login')
                    }
                })
                    .catch((rejectedValueOrSerializedError) => {
                        console.log(" update  failed Inside catch", rejectedValueOrSerializedError);
                    })
            }
        } 
        else {
            setError({ "email": "Please enter your email address !" })
        }
    }

    return (
        <>
            <View style={{ margin: "3%" }}>
                <Text style={{ color: COLORS.primary, fontSize: RFValue(14), ...FONTS.robotomedium }}>Update Password</Text>
                <Text style={{ color: COLORS.black, fontSize: RFValue(10), ...FONTS.robotoregular }}>Update or Change your password for your account</Text>
            </View>

            <View style={{ margin: "2%", width: "100%" }}>
                <View style={{ width: "100%" }}>
                    <ProfileInput placeholder="Enter your Email" value={updatePassword} settedValue={setUpdatePassword} />
                    {error ? <Text style={styles.errorText}>{error.email}</Text> : null}
                </View>
            </View>
            <TouchableOpacity style={{ backgroundColor: COLORS.primary, width: "30%", borderRadius: 10, padding: "2%", marginTop: "5%", alignSelf: "center" }} onPressIn={() => handleUpdate()}>
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
    errorText: {
        color: "red",
        ...FONTS.robotoregular,
        fontSize: RFValue(10),
        paddingLeft: "4%"
    }
})