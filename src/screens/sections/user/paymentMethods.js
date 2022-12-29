import React from 'react';
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    TouchableOpacity, Image,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Colors } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { icons, COLORS,FONTS } from '../../../constants';
import { Avatar } from '@rneui/themed';
const PaymentMethods = () => {



    return (
    <View style={{width:"100%",height:"100%",borderWidth:0,padding:"3%",paddingBottom:"50%"}}>
            <View>
                <Text style={{ color: COLORS.primary, fontSize: RFValue(14), ...FONTS.robotomedium }}>Your Payment Methods</Text>
                <Text style={{ color: COLORS.black, fontSize: RFValue(10), ...FONTS.robotoregular }}>Manage your payment methods here</Text>
            </View>
            <View style={{ width: "90%",marginVertical:"3%", backgroundColor: COLORS.white, borderRadius: 10, alignSelf: "center", justifyContent: "center" }}>
                <Text style={{ color: COLORS.black, fontSize: RFValue(10), ...FONTS.robotoregular,padding:"4%" }}>Currently you don't have any saved payment methods</Text>
            </View>

            <TouchableOpacity style={{ backgroundColor: COLORS.primary, width: "30%",padding:"2%", borderRadius: 10,alignSelf:"center" }}>
                <Text style={{ color: COLORS.white, ...FONTS.robotoregular,textAlign:"center" }}>Add Payment Card</Text>
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