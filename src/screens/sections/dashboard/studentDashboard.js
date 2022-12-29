import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    StatusBar,
} from 'react-native';


import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/FontAwesome'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch, } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { userLoginHanlder } from '../../../store/redux/userLogin';
import { images, icons, COLORS, FONTS, SIZES } from '../../../constants';
import { Avatar } from '@rneui/themed';

const StudentDashboard = ({username}) => {
const AvatarTitle=(username?.slice(0, 2)).toUpperCase() 

    return (
        <View style={{ backgroundColor: COLORS.lightGray, height: "100%" }}>
            <View style={styles.AvatarBoard}>
                <View style={{ flexDirection: "column", height: "100%", width: "20%", alignItems: "center", justifyContent: "center" }}>
                    <Avatar
                        size={60}
                        rounded
                        title={AvatarTitle}
                        containerStyle={{ backgroundColor: COLORS.primary, }}
                    />
                </View>
                <View style={{ flexDirection: "column", height: "100%", width: "50%",  justifyContent: "center" }}>
                    <Text style={{fontSize:RFValue(12),color:COLORS.black,...FONTS.robotomedium}}>HI,{username}</Text>
                    <Text style={{fontSize:RFValue(12),color:COLORS.primary,...FONTS.robotoregular}}>STUDENT DASHBOARD</Text>
                </View>
                <View style={{ flexDirection: "column", height: "100%", width: "30%",  alignItems: "center", justifyContent: "center" }}>
                    <Text style={{fontSize:RFValue(10),color:COLORS.black,margin:"3%",...FONTS.robotomedium}}>PURCHASED   1</Text>
                    <Text style={{fontSize:RFValue(10),color:COLORS.black,margin:"3%",...FONTS.robotomedium}}>PROGRESS      0</Text>
                    <Text style={{fontSize:RFValue(10),color:COLORS.black,margin:"3%",...FONTS.robotomedium}}>COMPLETED   2</Text>
                    <Text style={{fontSize:RFValue(10),color:COLORS.black,margin:"3%",...FONTS.robotomedium}}>PENDING         3</Text>
                </View>

            </View>

        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.back,
    },
    AvatarBoard: {
        height: "20%",
        width: "90%",
        margin: "5%",
        borderWidth: 1,
        borderRadius: 10,
        shadowOffset: { width: -2, height: 4 },
        shadowColor: COLORS.primary,
        shadowOpacity: 5,
        shadowRadius: 3,
        elevation: 5,
        backgroundColor: COLORS.white,
        borderColor: COLORS.white,
        flexDirection: "row"
    }

});
export default StudentDashboard;