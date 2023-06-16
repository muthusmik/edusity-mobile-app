import React from 'react';
import {
    View,
    Text,
    Image,
    Pressable,
    StyleSheet,
    KeyboardAvoidingView
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { images, icons, COLORS, FONTS, SIZES } from "../../constants";
import { useNavigation } from '@react-navigation/native';
import { metrices } from '../../constants/metrices';

const NoData = ({ data }) => {

    const navigation = useNavigation();
    return (
        <>
            <KeyboardAvoidingView style={styles.mainContainer}>
                <Image source={images.noCartGif} resizeMode="contain" style={{ height: 200, width: 200 }} />
                <View style={{ width: "80%", margin: "5%", alignItems: "center" }}>
                    <Text style={{ color: COLORS.black, fontSize: RFValue(16), ...FONTS.robotomedium }}>Hello<Text style={{ color: COLORS.primary }}> {data}</Text>, Your Shopping Cart is currently empty!</Text>
                    <Pressable onPressIn={() => navigation.navigate("Home")}>
                        <Text style={{ color: COLORS.primary, fontSize: RFValue(10), ...FONTS.robotoregular, textDecorationLine: "underline" }}>Here's where you might find something interesting!</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </>
    );
}
const styles = StyleSheet.create({
    mainContainer: {
        height: metrices(92.4),
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.white
    },
});
export default NoData;