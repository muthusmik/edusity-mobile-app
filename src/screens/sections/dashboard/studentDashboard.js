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
import { ScrollView } from 'react-native-gesture-handler';

const StudentDashboard = ({ username, studentStatistics }) => {

    const AvatarTitle = ((username?.firstName) ? ((username?.firstName).charAt(0).toUpperCase()) : "") + ((username?.lastName) ? ((username?.lastName).charAt(0).toUpperCase()) : "");

    return (
        <View style={{ backgroundColor: COLORS.lightGray, height: "100%", padding: 18 }}>
            <View style={styles.AvatarBoard}>
                <ScrollView>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ width: "36%", alignItems: "center", justifyContent: "center" }}>
                            <Avatar
                                size={80}
                                rounded
                                title={AvatarTitle}
                                containerStyle={{ backgroundColor: COLORS.primary }}
                            />
                        </View>
                        <View style={{ width: "50%", justifyContent: "center" }}>
                            <Text style={{ fontSize: RFValue(14), color: COLORS.black, ...FONTS.robotomedium }}>Hi, {(username?.firstName) ? (username?.firstName) : ""} {(username?.lastName) ? (username?.lastName) : ""}</Text>
                            <Text style={{ fontSize: RFValue(12), color: COLORS.primary, ...FONTS.robotoregular }}>STUDENT DASHBOARD</Text>
                        </View>
                    </View>
                    <Text style={{ ...FONTS.robotomedium, fontSize: 18, paddingTop: 10, paddingBottom: 6, color: COLORS.black }}>Student statictics</Text>
                    <View style={{ width: "100%", justifyContent: "space-between" }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={[styles.shadowStyle, { shadowColor: COLORS.primary }]}>
                                <View style={styles.staticticsContainerStyle}>
                                    <Text style={styles.staticticsTextStyle}>Enrolled Courses</Text>
                                    <Text style={[styles.staticticsTextStyle, { color: COLORS.primary, ...FONTS.robotomedium, paddingVertical: 6 }]}>{studentStatistics?.enrolledCourse}</Text>
                                    <View style={styles.horizontalLine} />
                                    <View style={styles.monthContainerStyle}>
                                        <Text style={styles.staticticsTextStyle}>This Month</Text>
                                        <Text style={[styles.staticticsTextStyle, { color: COLORS.primary, ...FONTS.robotomedium }]}>{studentStatistics?.thisMonthEnrolledCourse}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.shadowStyle, { shadowColor: "red" }]}>
                                <View style={styles.staticticsContainerStyle}>
                                    <Text style={styles.staticticsTextStyle}>Compeleted Webinars</Text>
                                    <Text style={[styles.staticticsTextStyle, { color: "red", ...FONTS.robotomedium, paddingVertical: 6 }]}>{studentStatistics?.completedWebinars}</Text>
                                    <View style={styles.horizontalLine} />
                                    <View style={styles.monthContainerStyle}>
                                        <Text style={styles.staticticsTextStyle}>This Month</Text>
                                        <Text style={[styles.staticticsTextStyle, { color: "red", ...FONTS.robotomedium }]}>{studentStatistics?.thisMonthCompletedWebinars}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 }}>
                            <View style={[styles.shadowStyle, { shadowColor: "orange" }]}>
                                <View style={styles.staticticsContainerStyle}>
                                    <Text style={styles.staticticsTextStyle}>Forum Question</Text>
                                    <Text style={[styles.staticticsTextStyle, { color: "orange", ...FONTS.robotomedium, paddingVertical: 6 }]}>{studentStatistics?.forumQuestions}</Text>
                                    <View style={styles.horizontalLine} />
                                    <View style={styles.monthContainerStyle}>
                                        <Text style={styles.staticticsTextStyle}>This Month</Text>
                                        <Text style={[styles.staticticsTextStyle, { color: "orange", ...FONTS.robotomedium }]}>{studentStatistics?.thisMonthForumQuestions}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.shadowStyle, { shadowColor: "green" }]}>
                                <View style={styles.staticticsContainerStyle}>
                                    <Text style={styles.staticticsTextStyle}>Certficates</Text>
                                    <Text style={[styles.staticticsTextStyle, { color: "green", ...FONTS.robotomedium, paddingVertical: 6 }]}>{studentStatistics?.certificates}</Text>
                                    <View style={styles.horizontalLine} />
                                    <View style={styles.monthContainerStyle}>
                                        <Text style={styles.staticticsTextStyle}>This Month</Text>
                                        <Text style={[styles.staticticsTextStyle, { color: "green", ...FONTS.robotomedium }]}>{studentStatistics?.thisMonthCompletedWebinars}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
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
        height: "100%",
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
    shadowStyle: {
        width: '48%',
        padding: 10,
        borderRadius: 8,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.6,
        shadowRadius: 2,
        elevation: 1,
    },
    staticticsContainerStyle: {
        width: '100%',
    },
    staticticsTextStyle: {
        fontSize: RFValue(12),
        color: COLORS.black,
        ...FONTS.robotoregular,
        textAlign: "center",
    },
    horizontalLine: {
        borderBottomColor: COLORS.primary,
        borderBottomWidth: 1,
        width: "100%",
        alignSelf: "center"
    },
    monthContainerStyle: {
        flexDirection: "row",
        paddingVertical: 6,
        paddingHorizontal: 8,
        justifyContent: "space-between"
    }

});
export default StudentDashboard;