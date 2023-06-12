import React from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import { metrices } from "../constants/metrices";
import { useNavigation } from "@react-navigation/native";
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants';
import { RFValue } from "react-native-responsive-fontsize";

const Top_Bar = (backPage) => {
    // console.log("Back page...........", backPage)
    // const navigation = useNavigation();
    // const handleNavigation = () => {
    //     navigation.navigate(backPage)
    // }

    return (
        <View style={styles.firstView}>
            <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => handleNavigation()/* navigation.navigate('Home', { screen: "Search" }) */}>
                <MCIcon name="keyboard-backspace" size={RFValue(28)} color={COLORS.black} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    firstView: {
        flexDirection: "row", borderWidth: 2,
        alignItems: "center",
        color: COLORS.black,
        height: metrices(8)
    }
})

export default Top_Bar;