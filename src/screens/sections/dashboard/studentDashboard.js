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
                    <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", paddingHorizontal: 18 }}>
                        <View>
                            <Text style={styles.staticticsTextStyle}>PURCHASED</Text>
                            <View style={styles.horizontalLine} />
                            <Text style={styles.staticticsTextStyle}>PROGRESS</Text>
                            <View style={styles.horizontalLine} />
                            <Text style={styles.staticticsTextStyle}>COMPLETED</Text>
                            <View style={styles.horizontalLine} />
                            <Text style={styles.staticticsTextStyle}>PENDING</Text>
                            <View style={styles.horizontalLine} />
                            <Text style={styles.staticticsTextStyle}>Certificates</Text>
                            <View style={styles.horizontalLine} />
                            <Text style={styles.staticticsTextStyle}>Completed Webinars</Text>
                            <View style={styles.horizontalLine} />
                            <Text style={styles.staticticsTextStyle}>Enrolled Courses</Text>
                            <View style={styles.horizontalLine} />
                            <Text style={styles.staticticsTextStyle}>Forum Questions</Text>
                            <View style={styles.horizontalLine} />
                            <Text style={styles.staticticsTextStyle}>This Month Certificates</Text>
                            <View style={styles.horizontalLine} />
                            <Text style={styles.staticticsTextStyle}>This Month Completed Webinars</Text>
                            <View style={styles.horizontalLine} />
                            <Text style={styles.staticticsTextStyle}>This Month Enrolled Course</Text>
                            <View style={styles.horizontalLine} />
                            <Text style={styles.staticticsTextStyle}>This Month Forum Questions</Text>
                        </View>
                        <View>
                            <Text style={styles.staticticsTextStyle}>1</Text>
                            <View style={styles.horizontalLine} />
                            <Text style={styles.staticticsTextStyle}>0</Text>
                            <View style={styles.horizontalLine} />
                            <Text style={styles.staticticsTextStyle}>3</Text>
                            <View style={styles.horizontalLine} />
                            <Text style={styles.staticticsTextStyle}>2</Text>
                            <View style={styles.horizontalLine} />
                            <Text style={styles.staticticsTextStyle}>{studentStatistics?.certificates}</Text>
                            <View style={styles.horizontalLine} />
                            <Text style={styles.staticticsTextStyle}>{studentStatistics?.completedWebinars}</Text>
                            <View style={styles.horizontalLine} />
                            <Text style={styles.staticticsTextStyle}>{studentStatistics?.enrolledCourse}</Text>
                            <View style={styles.horizontalLine} />
                            <Text style={styles.staticticsTextStyle}>{studentStatistics?.forumQuestions}</Text>
                            <View style={styles.horizontalLine} />
                            <Text style={styles.staticticsTextStyle}>{studentStatistics?.thisMonthCertificates}</Text>
                            <View style={styles.horizontalLine} />
                            <Text style={styles.staticticsTextStyle}>{studentStatistics?.thisMonthCompletedWebinars}</Text>
                            <View style={styles.horizontalLine} />
                            <Text style={styles.staticticsTextStyle}>{studentStatistics?.thisMonthEnrolledCourse}</Text>
                            <View style={styles.horizontalLine} />
                            <Text style={styles.staticticsTextStyle}>{studentStatistics?.thisMonthForumQuestions}</Text>
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
    staticticsTextStyle: {
        fontSize: RFValue(14),
        color: COLORS.black,
        ...FONTS.robotomedium,
    },
    horizontalLine: {
        borderBottomColor: COLORS.primary,
        borderBottomWidth: 1,
        marginVertical:4
    }

});
export default StudentDashboard;