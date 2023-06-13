import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import { metrices } from "../constants/metrices";
import { useNavigation } from "@react-navigation/native";
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS } from '../constants';
import { RFValue } from "react-native-responsive-fontsize";

const Top_Bar = ({ backPage, stylesFromPage, title }) => {
    console.log("Back page...........", backPage, stylesFromPage, title)
    const styleContent = stylesFromPage ? stylesFromPage : ""
    const navigation = useNavigation();
    const handleNavigation = () => {
        if (backPage == 0) {
            navigation.goBack()
        }
    }

    return (
        <View style={styleContent}>
            <TouchableOpacity onPress={() => handleNavigation()/* navigation.navigate('Home', { screen: "Search" }) */}>
                <MCIcon name="keyboard-backspace" size={RFValue(28)} color={COLORS.white} />
            </TouchableOpacity>
            {title &&
                <Text style={styles.title}>{title}</Text>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    firstView: {
        flexDirection: "row",
        alignItems: "center",
        color: COLORS.black,
        height: metrices(8)
    },
    title: {
        width:"88%",
        fontSize: RFValue(16, 580),
        ...FONTS.robotoregular,
        color: COLORS.white
    }
})

export default Top_Bar;