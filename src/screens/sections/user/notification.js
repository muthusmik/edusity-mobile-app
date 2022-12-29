import React from 'react';
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    TouchableOpacity, Image, 
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { ScrollView } from 'react-native-gesture-handler';
import {  Colors } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { icons, COLORS,FONTS } from '../../../constants';
import { Avatar } from '@rneui/themed';
import { useState } from 'react';
const Notifications = () => {
const CheckBoxes=(props)=>{
    const[isSelected,setSelection]=useState(false);
    return(
    <View style={styles.checkboxContainer}>
    <CheckBox
      value={isSelected}
      onValueChange={setSelection}
      style={styles.checkbox}
      tintColors={{true: COLORS.primary}}
    />
    <Text style={styles.label}>{props.label}</Text>
  </View>
    )
}

    return (
        <>
            <View style={{ margin: "3%" }}>
                <Text style={{ color: COLORS.primary, fontSize: RFValue(14),...FONTS.robotomedium }}>Notifications Center</Text>
                <Text style={{ color: COLORS.black, fontSize: RFValue(10), ...FONTS.robotoregular}}>Choose what notifications you receive from Edusity</Text>
            </View>
            <CheckBoxes label="Seasonal Promotions , Discount Codes and periodic updates from team Edusity." />
            <CheckBoxes label="Communication and announcements from the Instructors for the courses you are enrolled in." />
            <CheckBoxes label="Please DO NOT send me any communication and / or promotions.
                                you will still continue to receive only essential communication , links to download purchase receipts etc." />
        </>



    );
}
export default Notifications;
const styles = StyleSheet.create({
    iconStyle: {
        fontSize: 40,
        marginTop: 30,
        color: 'black',
      },
      checkboxContainer: {
        flexDirection: "row",
        marginBottom: 20,
        marginHorizontal:"2%",
        width:"90%"
      },
      checkbox: {
        alignSelf: "center",
      },
      label: {
        margin: 8,
        ...FONTS.robotoregular,
        textAlign:"justify"
      },
})