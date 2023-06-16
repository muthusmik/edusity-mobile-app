import React from 'react';
import {
    View,
    Text, Image,
    Pressable, StyleSheet, KeyboardAvoidingView
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { images, icons, COLORS, FONTS, SIZES } from "../../constants";
import { useNavigation } from '@react-navigation/native';

const NoWebinars = ({ data }) => {
    const navigation = useNavigation();

    return (
        <>
            <KeyboardAvoidingView style={styles.mainContainer}>
                <View style={{ height: "40%", width: "60%" }}>
                    <Image source={images.noCourseGif} resizeMode="cover" style={{ height: "100%", width: "100%" }} />
                </View>
                <View style={{ width: "80%", margin: "5%", alignItems: "center" }}>
                    <Text style={{ color: COLORS.black, fontSize: RFValue(16), ...FONTS.robotomedium, textAlign: "center" }}>Hey<Text style={{ color: COLORS.primary }}> {data}</Text>, Currently no webinars scheduled</Text>
                    <Pressable onPress={() => navigation.navigate("Home", { screen: 'Search' })}>
                        <Text style={{ color: COLORS.primary, fontSize: RFValue(10), ...FONTS.robotoregular, textDecorationLine: "underline" }}>Here's where you might find something you need</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </>
    );
}
const styles = StyleSheet.create({
    mainContainer: {
        height: SIZES.height - 60,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    }

});
export default NoWebinars;