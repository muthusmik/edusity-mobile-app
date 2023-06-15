import React from 'react';
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { icons, COLORS, FONTS } from '../../../constants';
import { metrices } from '../../../constants/metrices';

const PaymentMethods = () => {



    return (
        <View style={{ height: metrices(56.5), backgroundColor: COLORS.white }}>
            <View style={{ margin: "3%" }}>
                <Text style={{ color: COLORS.primary, fontSize: RFValue(14), ...FONTS.robotomedium }}>Your Payment Methods</Text>
                <Text style={{ color: COLORS.black, fontSize: RFValue(10), ...FONTS.robotoregular }}>Manage your payment methods here</Text>
            </View>
            <View style={{ width: "90%", marginVertical: "3%", backgroundColor: COLORS.lightGray, borderRadius: 10, alignSelf: "center", justifyContent: "center" }}>
                <Text style={{ color: COLORS.black, fontSize: RFValue(10), ...FONTS.robotoregular, padding: 14 }}>Currently you don't have any saved payment methods</Text>
            </View>

            <TouchableOpacity style={{ backgroundColor: COLORS.primary, width: "50%", padding: 8, borderRadius: 10, alignSelf: "center" }}>
                <Text style={{ color: COLORS.white, ...FONTS.robotoregular, textAlign: "center" }}>Add Payment Card</Text>
            </TouchableOpacity>
        </View>
    );
}
export default PaymentMethods;
const styles = StyleSheet.create({
    iconStyle: {
        fontSize: 40,
        marginTop: 30,
        color: 'black',
    },
})