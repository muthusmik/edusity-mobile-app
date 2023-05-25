import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
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
import { ActivityIndicator } from 'react-native-paper';
import StudentDashboard from './studentDashboard';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectDropdown from 'react-native-select-dropdown';
import { useIsFocused } from "@react-navigation/core";
import Toast from 'react-native-simple-toast';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo from '@react-native-community/netinfo';
import { getCourseAnnouncement, getStudentStatistics, getUpcommingWebniars } from "../../../services/webinars";
import CourseAnnouncementDashboard from "./courseAnnouncement";
import UpcomingWebniarDashboard from "./upcomingWebniar";
import NotificationScreen from '../../../components/notificationScreen';
import { metrices } from '../../../constants/metrices';
import { useFocusEffect } from '@react-navigation/native';

const Dashboard = () => {
    // console.log("iam inside DashBoard");
    const dispatch = useDispatch();
    const navigation = useNavigation();
    // const logiParam = route.params;
    const [loader, setLoader] = useState(false);
    const [userName, setUserName] = useState();
    const [drop, setDrop] = useState(false);
    // console.log("As params=---->", logiParam)
    const LoginData = useSelector(state => state.userLoginHandle.data)
    // console.log("LoginReduxData->", LoginData?.data?.role);
    const isFocused = useIsFocused();
    const [network, setNetwork] = useState('')
    const [courseAnnouncementDetails, setCourseAnnouncementDetails] = useState([])
    const [studentStatistics, setStudentStatistics] = useState([])
    const [upcomingWebniarDetails, setUpcomingWebniarDetails] = useState([])

    useFocusEffect(
        React.useCallback(() => {
            //   console.log('Home screen is focused');
            return () => {
                setDropdownVisible(false)
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
                    // console.log("successfully returned to login with response ", originalPromiseResult);
                    if (originalPromiseResult.data) {
                        const param = originalPromiseResult.data;
                        navigation.navigate('Home', {
                            screen: 'Dashboard',
                        });
                        dispatch(cartHandler(token)).then(unwrapResult)
                            .then((originalPromiseResult) => { console.log("cartDataaaa", originalPromiseResult.data) })
                        setLoader(false);
                    } else {
                        setLoader(false);
                        Toast.show("Something Went Wrong please try again!", Toast.LONG);
                        navigation.navigate('Login');
                    }
                })
                .catch((rejectedValueOrSerializedError) => {
                    setLoader(false);
                    Toast.show("Something Went Wrong please try again!", Toast.LONG);
                    console.log(" Inside catch", rejectedValueOrSerializedError);
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
                console.log("getUpcommingWebniars.................", data.data)
                setUpcomingWebniarDetails(data.data)
                setLoader(false);
            }).catch((error) => { console.log("Catch error in UpcomingWebniars.........", error) })
        } else {
            // console.log("No Token")
            setLoader(false);
            navigation.navigate('Login');
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
        // console.log("navigation done")
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
                        <TouchableOpacity onPress={() => { navigation.goBack() }}>
                            <MCIcon name="keyboard-backspace" size={RFValue(25)} color={COLORS.white} />
                        </TouchableOpacity>
                        <View>
                            <Text style={{ color: COLORS.white, fontSize: RFValue(16, 580), ...FONTS.robotoregular }}>Dashboard</Text>
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
    }
});

export default Dashboard;