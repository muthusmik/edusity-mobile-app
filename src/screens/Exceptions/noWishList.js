import React from 'react';
import {
    View,
    Text, Image,
    TouchableOpacity,
    Pressable, FlatList, StyleSheet, KeyboardAvoidingView
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { images, COLORS, FONTS } from "../../constants";
import { useNavigation } from '@react-navigation/native';

const NoWishList = ({ data }) => {
    const navigation = useNavigation();
    return (
        <>
            {/* <View style={{ flexDirection: "row", alignItems: "center", color: COLORS.black, backgroundColor: COLORS.primary, height: "8%" , borderBottomStartRadius: 30, borderBottomEndRadius: 30}}>
                <TouchableOpacity style={{ marginLeft: "4%" }} onPress={()=>navigation.goBack()}>
                    <MCIcon name="keyboard-backspace" size={RFValue(20)} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={{ color: COLORS.white, marginLeft: "2%", fontSize: RFValue(18), ...FONTS.robotoregular }}>Cart</Text>
            </View> */}
            <KeyboardAvoidingView style={styles.mainContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("Home", { screen: "Search" })}>
                    <Image source={images.noWishlist} resizeMode="contain" style={{ height: 200, width: 200 }} />
                </TouchableOpacity>
                <View style={{ width: "80%", margin: "5%", alignItems: "center" }}>
                    <Text style={{ color: COLORS.black, textAlign: "center", fontSize: RFValue(16), ...FONTS.robotomedium }}>Hey<Text style={{ color: COLORS.primary }}> {data}</Text>, Your Wish List is currently empty!</Text>
                    <Pressable onPressIn={() => navigation.navigate("Home", { screen: "Search" })}>
                        <Text style={{ color: COLORS.primary, fontSize: RFValue(10), ...FONTS.robotoregular, textDecorationLine: "underline" }}>Here's where you might find something you like!</Text>
                    </Pressable>
                </View>
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
        // paddingBottom:"35%",
        backgroundColor: COLORS.white,
    },

});
export default NoWishList;