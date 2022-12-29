import React, { useEffect, useState } from "react";
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
import { COLORS,FONTS } from "../../../constants";
import { useDispatch } from "react-redux";
import { RFValue } from "react-native-responsive-fontsize";
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import  {SkillLevel}  from "./skillLevel";
import { CategoryFilter } from "./categoryFilter";
import {  Divider } from '@rneui/themed';

export const PopUpFilterModal = forwardRef((props, ref) => {
    const {selectedLevel, setSelectedLevel,selectedCategory,setSelectedCategory,submission,setSubmission}=props;
    const navigation = useNavigation();
    const dispatch = useDispatch();
    let [ShowComment, setShowModelComment] = useState(false);
    let [animateModal, setanimateModal] = useState(false);
useEffect(()=>{
    console.log(selectedCategory,"category on filter modal")
},[selectedCategory])
const handleProceed=()=>{
    console.log(submission,"submission")
     setShowModelComment(false),
     setanimateModal(false),
     setSubmission(!submission)
    }


    useImperativeHandle(ref, () => ({
        childFunction1(a) {
            setShowModelComment(true);

        },
        childFunction2() {
            // console.log('child function 2 called');
        },
    }));

    return (
        <View>
            <SwipeUpDownModal
                modalVisible={ShowComment}
                PressToanimate={animateModal}
                //if you don't pass HeaderContent you should pass marginTop in view of ContentModel to Make modal swipeable
                ContentModal={
                    <View style={{ flex: 1, marginTop: "1%", }}>
                        <View style={{ height: "8%", width: "99%", flexDirection: "row", justifyContent: "space-around",left: "5%"}}>
                            <View style={{ width: "75%", flexDirection: "column", justifyContent: "space-around",  }}>
                                <Text style={{ color: COLORS.white, fontSize: RFValue(14, 580),...FONTS.robotomedium }}>Filter By</Text>
                            </View>
                            <Pressable style={{ width: "25%", flexDirection: "column", justifyContent: "space-around" }} onPress={() => {
                                setShowModelComment(false);
                                setanimateModal(false);
                            }}>
                                <MCIcon name="close-octagon" size={30} color={COLORS.white} />
                            </Pressable>
                        </View>
                        <Divider />
                        <ScrollView style={{ height: "80%",backgroundColor:COLORS.lightGray}}>
                            <View style={{width: "90%", justifyContent: "space-around",left: "5%",marginVertical:"5%"}}>
                                <Text style={styles.filtertypeHeader}>Skill Level</Text>
                                <SkillLevel   selectedLevel={selectedLevel} setSelectedLevel={setSelectedLevel}/>
                            </View>
                            <View style={{width: "90%", justifyContent: "space-around",left: "5%",}}>
                                <Text  style={styles.filtertypeHeader}>Category</Text>
                                <CategoryFilter selectedCtaegory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                            </View>
                        </ScrollView>
                        <View style={{ height: "10%", }}>
                            <View style={styles.bottom}>
                                < Pressable onPress={() => {setShowModelComment(false),setanimateModal(false)}}style={styles.bottomCancel}>
                                    <View >
                                        <Text style={{ color: COLORS.black,...FONTS.robotoregular }}>Cancel</Text>
                                    </View>
                                </Pressable>
                                <Pressable style={styles.bottomProceed} onPress={() => handleProceed()}>
                                    <View >
                                        <Text style={{ color: COLORS.white,...FONTS.robotoregular }}>OK</Text>
                                    </View>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                }
                ContentModalStyle={styles.Modal}
                onClose={() => {
                    setShowModelComment(false);
                    setanimateModal(false);
                    setSubmission(false);
                }}
            />
        </View>
    );
}
)
const styles = StyleSheet.create({
    mapContent: {
        borderColor: COLORS.white,
        borderRadius: 10,
        shadowOffset: { width: -2, height: 4 },
        shadowColor: '#FFFF',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        margin: "2%",
        backgroundColor: COLORS.white,
    },
    header: {
        color: COLORS.primary,
    },
    title: {
        marginLeft: 10,
        color: COLORS.primary,
    },
    main: {
        flexDirection: "row",
        justifyContent: 'space-evenly',
        marginVertical: 6,
    },
    mainColumn: {
        flexDirection: "column",
        width: "40%",
        marginStart: "10%",
        justifyContent: 'space-between',
        fontSize: 12,
        color: COLORS.black
    },
    content: {
        flexDirection: "row",
        marginBottom: "15%"
    },
    containerContent: { flex: 1, marginTop: "5%" },
    containerHeader: {
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        backgroundColor: '#F1F1F1',
    },
    headerContent: {
        marginTop: 0,
    },
    Modal: {
        backgroundColor: COLORS.lightGray,
        marginTop: "5%",
        borderColor: "black",
        borderTopStartRadius: 20,
        borderTopEndRadius: 20,
        backgroundColor:COLORS.primary
    },
    bottom: {
        flexDirection: "row",
        width: "100%",
        height: "100%",
        alignItems: "center",
        backgroundColor: COLORS.white,
    },
    bottomProceed: {
        flexDirection: "column",
        borderColor: COLORS.primary,
        borderWidth: 1,
        borderRadius: 5,
        width: "45%",
        backgroundColor: COLORS.primary,
        alignItems: "center",
        height: "70%",
        justifyContent: "space-around"
    },
    bottomCancel: {
        flexDirection: "column",
        width: "45%",
        marginHorizontal:"2.5%",
        height: "70%",
        alignItems: "center",
        borderWidth:1,
        alignItems:"center",
        justifyContent:"center",
        borderRadius:5
    },
    textProceed: {
        fontSize: 30,
        color: COLORS.white,
    },
    textCancel: {
        fontSize: 30,
        color: COLORS.black,
    },
    filtertypeHeader:{
        color: COLORS.black,
        fontSize:RFValue(14),
        ...FONTS.robotoregular,
        backgroundColor:"#FFD700",
        borderRadius:5,
        width:"30%" ,
        padding:"1%",
        textAlign:"center"
    }
})