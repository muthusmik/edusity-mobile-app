import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Pressable,
} from 'react-native';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { unwrapResult } from '@reduxjs/toolkit'
import { useNavigation } from '@react-navigation/native';
import SwipeUpDownModal from 'react-native-swipe-modal-up-down';
import { COLORS,FONTS,icons } from "../../../constants";
import { useDispatch } from "react-redux";
import { RFValue } from "react-native-responsive-fontsize";
import FAIcon from 'react-native-vector-icons/FontAwesome';
import {  Divider } from '@rneui/themed';

export const SkillLevel =(props)=> {
    const {selectedLevel,setSelectedLevel}=props;
    const navigation = useNavigation();
    const dispatch = useDispatch();
     const handleSelect=(level)=>{
        if(selectedLevel==level){
            setSelectedLevel(null);
            return
        }
        setSelectedLevel(level)
     }


const SkillQuota=({icon,level})=>{
    return(
    <TouchableOpacity 
    style={{...styles.mapContent,...{ backgroundColor:(selectedLevel==level)?COLORS.primary:COLORS.white,}}} 
    onPressIn={()=>handleSelect(level)}>
        <View style={{justifyContent:"center",flexDirection:"column", backgroundColor: (selectedLevel==level)?COLORS.primary:COLORS.white,width:"30%",}}>
        <Image source={icon} resizeMode="cover" style={{height:30,width:30}}/>
        </View>
        <View style={{flexDirection:"column",padding:"5%",alignItems:"flex-start"}}>
            <Text style={{color:(selectedLevel==level)?COLORS.white:COLORS.primary,fontSize:RFValue(13),...FONTS.robotoregular}}>{level}</Text>
        </View>
    </TouchableOpacity>
    );
}

    return (
        <>
          <View style={{flexDirection:"row",width:"94%",marginHorizontal:"2%",marginVertical:"2%",justifyContent:"space-between",}}>
            <View style={{flexDirection:"column",width:"45%"}}>
               <SkillQuota icon={icons.begginner} level={"Beginner"} />
            </View>
            <View style={{flexDirection:"column",width:"45%"}}>
            <SkillQuota  icon={icons.intermediate}  level={"Intermediate"}/>
            </View>
          </View>  
          <View style={{flexDirection:"row",width:"94%",marginHorizontal:"2%",marginVertical:"2%",justifyContent:"space-between"}}>
            <View style={{flexDirection:"column",width:"45%"}}>
               <SkillQuota  icon={icons.pro}  level={"Pro"}/>
            </View>
            <View style={{flexDirection:"column",width:"45%"}}>
            <SkillQuota  icon={icons.expert} level={"Expert"} />
            </View>
          </View> 
          <View style={{flexDirection:"row",width:"94%",marginHorizontal:"2%",marginVertical:"2%",justifyContent:"space-between"}}>
            <View style={{flexDirection:"column",width:"45%"}}>
               <SkillQuota  icon={icons.high} level={"High"}/>
            </View>
            {/* <View style={{flexDirection:"column",width:"40%"}}>
            <SkillQuota/>
            </View> */}
          </View> 
        </>
    );
}

const styles = StyleSheet.create({
    mapContent: {
        borderColor: COLORS.white,
        shadowOffset: { width: -2, height: 4 },
        shadowColor: '#FFFF',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        margin: "2%",
        flexDirection:"row",
        width:"100%",
        borderRadius:5,
        borderWidth:1,
        // justifyContent:"space-between",
        padding:"10%"
    },
    
})