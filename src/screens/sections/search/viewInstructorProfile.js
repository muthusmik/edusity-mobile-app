import React, { useEffect } from 'react';
import {
    View,
    Text, Image,
    TouchableOpacity,
    ImageBackground,ActivityIndicator,
    StatusBar, ScrollView, FlatList, StyleSheet, KeyboardAvoidingView,Pressable, Linking
} from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images, icons, COLORS, FONTS, SIZES } from "../../../constants";
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FA5 from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
const ViewInstructorProfile = ({ route }) => {
    console.log("iam inside Instructor Page");
    const dispatch = useDispatch();
    const Data=route.params
    const Link=Data.introductionLink
    console.log(Data,"Data")
    // console.log(allCourses,"allCourses")

    return (
        <View style={styles.mainContainer}>
            <View style={styles.avatarItem}>
                <View style={{flexDirection:"row",padding:"2%"}}>
                    <Avatar
                        title={Data.firstName}
                        source={{ uri: Data.profileImage }}
                        size="large"
                        rounded
                        avatarStyle={{ borderWidth: 2, borderColor: COLORS.primary,...FONTS.robotoregular }}

                    />
                    <ListItem.Content style={{ marginLeft: "5%" }}>
                        <ListItem.Title style={{ fontSize: RFValue(25),...FONTS.robotomedium }}>{Data.firstName} {Data.lastName}</ListItem.Title>
                        <ListItem.Subtitle onPress={()=>console.log("hello")} style={{ fontSize: RFValue(10),...FONTS.robotoregular }}>{Data.introductionLink} </ListItem.Subtitle>
                    </ListItem.Content>
                </View>

                <Text style={{ fontSize: RFValue(11), color: COLORS.black,padding:"2%",...FONTS.robotoregular }}>
                    {Data.introduction}
                </Text>
            </View>
            <View style={{ marginTop: "5%", backgroundColor: "white", margin: "2%", borderRadius: 5 }}>
                <View style={{flexDirection:"row",marginTop:"4%",marginLeft:"4%",alignItems:"center",backgroundColor:COLORS.secondary}}>
                    <Text style={{ flexDirection:"column" }}><MCIcon name="email-fast" size={RFValue(20)} color={COLORS.primary} /></Text>
                    <Text style={{ flexDirection:"column",color: COLORS.black, fontSize: RFValue(16),...FONTS.robotomedium}}> Email</Text>
                </View>
                <Text style={{color: COLORS.black, fontSize: RFValue(14),left:"8%",...FONTS.robotoregular}}>{Data.email}</Text>
                <View style={{flexDirection:"row",marginTop:"4%",marginLeft:"4%",alignItems:"center",backgroundColor:COLORS.secondary}}>
                    <Text style={{ flexDirection:"column" }}><FA5 name="user-graduate" size={RFValue(18)} color={COLORS.primary} /></Text>
                    <Text style={{ flexDirection:"column",color: COLORS.black, fontSize: RFValue(16),...FONTS.robotomedium}}> Qualifications</Text>
                </View>
                <Text style={{color: COLORS.black, fontSize: RFValue(14),left:"8%",...FONTS.robotoregular }}>{Data.qualifications}</Text>
                <View style={{flexDirection:"row",marginTop:"4%",marginLeft:"4%",alignItems:"center",backgroundColor:COLORS.secondary}}>
                    <Text style={{ flexDirection:"column" }}><MCIcon name="certificate" size={RFValue(20)} color={COLORS.primary} /></Text>
                    <Text style={{ flexDirection:"column",color: COLORS.black, fontSize: RFValue(16),...FONTS.robotomedium}}> Certifications</Text>
                </View>
                <Text style={{color: COLORS.black, fontSize: RFValue(14),left:"8%",...FONTS.robotoregular }}>{Data.certifications}</Text>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    mainContainer: {
        height: "100%",
        width: "100%",
        backgroundColor: COLORS.lightGray,
    },
    avatarItem: {
        marginVertical:"2%",
        justifyContent:"space-around" ,
        width:"95%",
        backgroundColor:COLORS.white,
        padding:"2%",
        marginHorizontal:"2%",
        borderRadius:5,
        shadowColor: "#FFFF",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation:5,
    },
});
export default ViewInstructorProfile;