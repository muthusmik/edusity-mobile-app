import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { images, icons, COLORS, FONTS, SIZES } from "../../constants";
import { useNavigation, useIsFocused } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';

const ServerErrorPage = () => {
    const navigation = useNavigation();
    const unsubscribe = () => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                navigation.goBack();
            }
            else{
                alert("Please Check your network connection!");
            }
        })
    }
    
    return (
        <>
            {/* <View style={{ flexDirection: "row", alignItems: "center", color: COLORS.black, backgroundColor: COLORS.primary, height: "8%" , borderBottomStartRadius: 30, borderBottomEndRadius: 30}}>
                <TouchableOpacity style={{ marginLeft: "4%" }} onPress={()=>navigation.goBack()}>
                    <MCIcon name="keyboard-backspace" size={RFValue(20)} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={{ color: COLORS.white, marginLeft: "2%", fontSize: RFValue(18), ...FONTS.robotoregular }}>Cart</Text>
            </View> */}
            <KeyboardAvoidingView style={styles.mainContainer}>
                <Image source={images.serverDownGif} resizeMode="contain" style={{ height: 300, width: 300 }} />
                <View style={{ width: "80%", margin: "5%", alignItems: "center" }}>
                    <Text style={{ color: COLORS.black, fontSize: RFValue(16), ...FONTS.robotoregular, textAlign: "center" }}>Server unavailable... {"\n"}Please check your internet connection or try again later!</Text>
                </View>
                <TouchableOpacity onPressIn={() => unsubscribe()} >
                    <Text style={{ ...FONTS.robotoregular, color: "red", textDecorationLine: "underline" }}>Reload...</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </>
    );
}
const styles = StyleSheet.create({
    mainContainer: {
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white"
    }

});
export default ServerErrorPage;