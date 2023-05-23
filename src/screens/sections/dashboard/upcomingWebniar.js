import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    StatusBar,
    Modal
} from 'react-native';

import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/FontAwesome'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch, } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { userLoginHanlder } from '../../../store/redux/userLogin';
import { images, icons, COLORS, FONTS, SIZES } from '../../../constants';
import moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';

const UpcomingWebniarDashboard = ({ upcomingWebniarDetails }) => {

    console.log("Inside the upcomingWebniarDetails...........", upcomingWebniarDetails)
    return (
        <View style={styles.container}>
            <View style={styles.announcementStyle}>
                <Text style={{ ...FONTS.robotomedium, color: COLORS.black, fontSize: 16, marginBottom: 8 }}>Upcoming Webinars (<Text style={{ color: "red" }}>{(upcomingWebniarDetails?.length) ? upcomingWebniarDetails.length : "0"}</Text>)</Text>
                {(upcomingWebniarDetails) ? <ScrollView>
                    {upcomingWebniarDetails?.map((item, index) => (
                        <TouchableOpacity key={item.id} style={styles.touchableStyle} onPress={() => { handleAnnouncement(item) }}>
                            <Text style={{ color: COLORS.primary, ...FONTS.robotoregular }}>{item.name}</Text>
                            <Text style={{ color: COLORS.black, ...FONTS.robotoregular }}>{moment(item.activationDate).format("DD/MM/YYYY hh:mm A")}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView> :
                    <View style={{ height: "70%", alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ ...FONTS.h2, color: COLORS.black }}>Upcoming webinar not found</Text>
                    </View>
                }
            </View>
            {/* {modalShow &&
                <View style={styles.centeredView}>
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalShow}
                        onRequestClose={() => {
                            setModalShow(false)
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={[styles.modalText, { fontSize: 18, ...FONTS.h2 }]}>{modalValue?.name}</Text>
                                <Text style={styles.modalText}>{modalValue.description}</Text>
                            </View>
                        </View>
                    </Modal>
                </View>
            } */}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.lightGray,
        height: "100%",
        paddingHorizontal: 18
    },
    announcementStyle: {
        height: "96%",
        width: "100%",
        borderRadius: 10,
        shadowOffset: { width: -2, height: 4 },
        shadowColor: COLORS.primary,
        shadowOpacity: 5,
        shadowRadius: 3,
        elevation: 5,
        backgroundColor: COLORS.white,
        borderColor: COLORS.white,
        padding: 10
    },
    touchableStyle: { backgroundColor: COLORS.lightGray, marginBottom: 6, borderRadius: 6, padding: 8 },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    centeredViewOne: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        ...FONTS.robotoregular,
        fontSize: 16,
        color: COLORS.black
    },

});
export default UpcomingWebniarDashboard;