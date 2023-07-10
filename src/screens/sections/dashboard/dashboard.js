import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Pressable,
    BackHandler,
    ScrollView,
    Dimensions
} from 'react-native';
import LoaderKit from 'react-native-loader-kit'
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch, } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { unwrapResult } from '@reduxjs/toolkit';
import { userLoginHanlder } from '../../../store/redux/userLogin';
import { cartHandler } from '../../../store/redux/cart';
import { images, icons, COLORS, FONTS, SIZES } from '../../../constants';
import StudentDashboard from './studentDashboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/core";
import Toast from 'react-native-simple-toast';
import IonIcon from "react-native-vector-icons/Ionicons";
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo from '@react-native-community/netinfo';
import { getCourseAnnouncement, getStudentStatistics, getUpcommingWebniars, getTestList } from "../../../services/webinars";
import CourseAnnouncementDashboard from "./courseAnnouncement";
import UpcomingWebniarDashboard from "./upcomingWebniar";
import NotificationScreen from '../../../components/notificationScreen';
import { metrices } from '../../../constants/metrices';
import { useFocusEffect } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/compat';

const Dashboard = () => {

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [loader, setLoader] = useState(false);
    const LoginData = useSelector(state => state.userLoginHandle.data)
    const isFocused = useIsFocused();
    const [network, setNetwork] = useState('')
    const [courseAnnouncementDetails, setCourseAnnouncementDetails] = useState([])
    const [studentStatistics, setStudentStatistics] = useState([])
    const [upcomingWebniarDetails, setUpcomingWebniarDetails] = useState([])
    const [testResults, setTestResults] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            return () => {
                setDropdownVisible(false);
            };
        }, [])
    );

    // useEffect(() => {
    //     // console.log("done and dusted..........", LoginData)
    //     if (LoginData) {
    //         if (LoginData?.data?.lastName) {
    //             let fullName = LoginData?.data?.firstName + " " + LoginData?.data?.lastName;
    //             setUserName(LoginData?.data?.firstName + " " + LoginData?.data?.lastName)
    //         } else {
    //             let fullName = LoginData?.data?.firstName + " " + LoginData?.data?.LastName;
    //             setUserName(LoginData?.data?.firstName)
    //         }
    //     }
    // }, [LoginData]);
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const handleNotificationClick = () => {
        if (isDropdownVisible) {
            setDropdownVisible(false);
        }
        else {
            setDropdownVisible(true);
        }
    };

    const handleCloseDropdown = () => {
        setDropdownVisible(false);
    };

    const initialLoading = async () => {
        let token = await AsyncStorage.getItem("loginToken");
        if (token) {
            setLoader(true);
            dispatch(userLoginHanlder(token)).then(unwrapResult)
                .then((originalPromiseResult) => {
                    if (originalPromiseResult.data) {
                        const param = originalPromiseResult.data;
                        navigation.navigate('Home', {
                            screen: 'Dashboard',
                        });
                        dispatch(cartHandler(token)).then(unwrapResult)
                            .then((originalPromiseResult) => { /* console.log("cartData.............", originalPromiseResult.data) */ })
                        setLoader(false);
                    } else {
                        setLoader(false);
                        Toast.show("Something Went Wrong please try again!", Toast.LONG);
                        navigation.navigate('Login');
                    }
                })
                .catch((rejectedValueOrSerializedError) => {
                    setLoader(false);
                    Toast.show("Something Went wrong, please try again later!", Toast.LONG);
                    console.log(" Inside catch in of dashboard.........", rejectedValueOrSerializedError);
                })
            let courseAnnouncementUrl = await getCourseAnnouncement(token).then(data => {
                setCourseAnnouncementDetails(data?.message)
                setLoader(false);
            }).catch((error) => { console.log("Catch error in courseAnnouncementUrl.........", error) })
            let studentStatistics = await getStudentStatistics(token).then(data => {
                setStudentStatistics(data)
                setLoader(false);
            }).catch((error) => { console.log("Catch error in studentStatistics.........", error) })
            let UpcomingWebniars = await getUpcommingWebniars(token).then(data => {
                setUpcomingWebniarDetails(data?.data)
                setLoader(false);
            }).catch((error) => { console.log("Catch error in UpcomingWebniars.........", error) })
            let testResults = await getTestList(token).then(data => {
                setTestResults(data?.data)
                setLoader(false);
            }).catch((error) => { console.log("Catch error in testResults.........", error) })
        } else {
            setLoader(false);
            navigation.navigate('Login', "Dashboard");
            BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
            return () => {
                BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
            };
            // Toast.show("Please fill the laid details to proceed!", Toast.LONG);
        }
    }

    useEffect(() => {
        if (isFocused) {
            NetInfo.fetch().then(state => {
                setNetwork(state.isConnected)
                if (state.isConnected) {
                    initialLoading();
                }
                else {
                    navigation.navigate("NetworkError");
                }
            })
        }
    }, [isFocused, network])

    // useEffect(() => {
    //     BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    //     return () => {
    //       BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
    //     };
    //   }, []);

    function handleBackButtonClick() {
        navigation.navigate('Home', { screen: 'Search' });
        return true;
    }

    return (
        (LoginData?.data?.role)
            ?
            <View>
                <SafeAreaView style={styles.container}>
                    <StatusBar
                        animated={true}
                        backgroundColor={COLORS.primary}
                    />
                    <View style={styles.topBarStyle}>
                        {/* <TouchableOpacity onPress={() => { navigation.goBack() }}>
                            <MCIcon name="keyboard-backspace" size={RFValue(25)} color={COLORS.white} />
                        </TouchableOpacity> */}
                        <View style={{ flexDirection: "row", width: "80%" }}>
                            <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                                <IonIcon name="options" size={RFValue(25)} color={COLORS.white} />
                            </TouchableOpacity>

                            <Text style={{ color: COLORS.white, fontSize: RFValue(16, 580), ...FONTS.robotoregular, marginLeft: 25 }}>Dashboard</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleNotificationClick()}>
                            <MaterialCommunityIcons name="bell-badge" size={RFValue(25)} color={COLORS.white} />
                            {(courseAnnouncementDetails?.length) ? <View style={styles.circle}>
                                <Text style={{ color: COLORS.white, fontSize: RFValue(10), ...FONTS.robotomedium, }}>{courseAnnouncementDetails?.length}</Text>
                            </View> : null}
                        </TouchableOpacity>
                    </View>

                    <NotificationScreen isVisible={isDropdownVisible} onClose={handleCloseDropdown} announcement={courseAnnouncementDetails} />

                    {(LoginData.data.role == 1) ?
                        <View style={styles.container}>
                            <View style={{ height: "100%", width: "100%", alignItems: "center", marginTop: "80%" }}>
                                <Text style={{ color: COLORS.black, justifyContent: "center", fontSize: RFValue(15, 580), ...FONTS.robotoregular, lineHeight: 100 }}>Welcoming  Instructor {LoginData.data.firstName} {LoginData.data.LastName} to </Text>
                                <Text style={{ color: "#8830c4", justifyContent: "center", fontSize: RFValue(40, 580), ...FONTS.robotoregular, ...FONTS.largeTitle }}>Edusity</Text>
                            </View>
                        </View> :
                        (LoginData.data.role == 2) ?
                            <ScrollView>
                                <Pressable onPress={() => setDropdownVisible(false)}>
                                    {studentStatistics && <View style={{ height: metrices(48) }}><StudentDashboard username={LoginData?.data} studentStatistics={studentStatistics?.data} setDropdownVisible={setDropdownVisible} /></View>}
                                    {/* {courseAnnouncementDetails && <View style={{ height: SIZES.height - 610 }}><CourseAnnouncementDashboard announcement={courseAnnouncementDetails} setDropdownVisible={setDropdownVisible} /></View>} */}
                                    {upcomingWebniarDetails && <View style={{ height: metrices(20) }}><UpcomingWebniarDashboard upcomingWebinar={upcomingWebniarDetails} /></View>}
                                    {testResults && testResults?.data && Array.isArray(testResults?.data) && testResults?.data.length == 0 ?
                                        <View style={styles.examResults}>
                                            <TouchableOpacity style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }} onPress={() => navigation.navigate("TestResult")}>
                                                <Text style={{ fontSize: 16, ...FONTS.robotomedium, color: COLORS.black }}>For Exam results</Text>
                                            </TouchableOpacity>
                                        </View>
                                        : null
                                    }
                                    <View style={{ padding: "8%" }} />
                                </Pressable>
                            </ScrollView> : null}
                </SafeAreaView>
            </View>
            :
            <View style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center" }}>
                <LoaderKit
                    style={{ width: 50, height: 50 }}
                    name={'BallPulse'}
                    size={50}
                    color={COLORS.primary}
                />
            </View>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.lightGray,
        height: SIZES.height
    },
    topBarStyle: {
        height: "8%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: COLORS.primary,
        borderBottomStartRadius: 30,
        borderBottomEndRadius: 30,
        paddingRight: 26,
        paddingLeft: 18
    },
    circle: {
        flexDirection: "column", borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
        width: Dimensions.get('window').width * 0.05,
        height: Dimensions.get('window').width * 0.05,
        backgroundColor: "red",
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        bottom: metrices(1.8),
        left: metrices(1.3),
        borderWidth: 1,
        borderColor: "red"
    },
    examResults: {
        width: "91%",
        alignSelf: "center",
        height: metrices(6),
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
        shadowOffset: { width: -2, height: 4 },
        shadowColor: COLORS.primary,
        shadowOpacity: 5,
        shadowRadius: 3,
        elevation: 5,
        justifyContent: "center",
        marginTop: 10
    }
});

export default Dashboard;