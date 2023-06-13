import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StatusBar, TouchableOpacity, FlatList, Image, StyleSheet, BackHandler
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LoaderKit from 'react-native-loader-kit'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images, icons, COLORS, FONTS, SIZES } from '../../constants';
import { RFValue } from 'react-native-responsive-fontsize';
import { useSelector, useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { purchasedCourses } from '../../services/courseService';
import { viewCourseHandler } from '../../store/redux/viewCourse';
import { useNavigation } from '@react-navigation/native';
import WebView from 'react-native-render-html';
import { useIsFocused } from "@react-navigation/core";
import NoCourse from '../Exceptions/noPurchasedCourse';
import NetInfo from '@react-native-community/netinfo';
import FeatherIcon from "react-native-vector-icons/Feather"
import { ScrollView } from 'react-native-gesture-handler';

const MyCourse = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    // const Token = useSelector(state => state.loginHandle?.data?.data);
    const [Data, setData] = useState([]);
    const [loginToken, setLoginToken] = useState();
    const [totalCourses, setTotalCourse] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [refreshList, setRefreshList] = useState(false);
    const [loader, setLoader] = useState(false);
    const [flalistRefresh, setFlatListRefresh] = useState(false);
    const [CoursesCount, setCourseCount] = useState(0);
    const [page, setPage] = useState(1);
    const isFocused = useIsFocused();
    const [network, setNetwork] = useState('')
    const LoginData = useSelector(state => state.userLoginHandle.data)

    const username = LoginData?.data?.userName;

    useEffect(() => {
        if (isFocused) {
            NetInfo.refresh().then(state => {
                setNetwork(state.isConnected)
                if (state.isConnected) {
                    getPurchased();
                }
                else {
                    navigation.navigate("NetworkError");
                }
            })
            const getPurchased = async () => {
                setLoader(true);
                let token = await AsyncStorage.getItem("loginToken");
                setLoginToken(token);
                if (token) {
                    let purchasedData = await purchasedCourses(token, page).then(data => {
                        console.log("Purchased courses..............", data.data);
                        setData(data?.data?.data);
                        setTotalCourse(data?.data.total);
                        setTotalPage(data?.data.total_page)
                        setCourseCount(data?.data?.total)
                        setLoader(false);
                    })
                }
                else {
                    setLoader(false);
                    navigation.navigate('Login', "Mycourses");
                    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
                    return () => {
                        BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
                    };
                }
            }
        }
    }, [isFocused, network])

    function handleBackButtonClick() {
        navigation.navigate('Home', { screen: 'Search' });
        return true;
    }
    useEffect(() => {
        // if (token) {
        // console.log("HII");
        const getPurchased = async () => {
            if (page > 1) {
                let purchasedData = await purchasedCourses(loginToken, page).then(data => {
                    // console.log(data.data, "onpage change");
                    let newdata = data?.data?.data
                    setData(Data.concat(newdata));
                    // console.log(Data.length, "length of Data")
                    setRefreshList(false);
                })
            }
        }
        getPurchased();
        // }
        // else {
        //     navigation.navigate("Login");
        // }
    }, [page])

    const refresh = () => {
        if (page < totalPage) {
            setPage(page + 1);
            setRefreshList(true);
        }
    }


    const handleViewNavigation = (item) => {
        console.log(item, "ID")
        setLoader(true)
        dispatch(viewCourseHandler(item)).then(unwrapResult)
            .then((originalPromiseResult) => {
                // console.log("successfully returned to login with response CourseList ", originalPromiseResult);
                setLoader(false)
                navigation.navigate("ViewCourse");
            })
            .catch((rejectedValueOrSerializedError) => {
                // console.log(" Inside catch", rejectedValueOrSerializedError);
                setLoader(false)
            })
    };

    return (
        (!loader) ?
            <SafeAreaView>
                <StatusBar
                    animated={true}
                    backgroundColor={COLORS.primary}
                />
                <View style={{ height: "100%", backgroundColor: COLORS.lightGray }}>
                    <View style={{ flexDirection: "row", padding: "2%", alignItems: "center", justifyContent: "center" }}>
                        <View style={{ width: "70%", flexDirection: 'column' }}>
                            <Text style={{ color: COLORS.primary, marginHorizontal: "5%", ...FONTS.robotoregular }}>No of Courses: {CoursesCount}</Text>
                        </View>

                        <TouchableOpacity style={{ flexDirection: "row", backgroundColor: COLORS.primary, padding: 6, borderRadius: 5, alignItems: "center", justifyContent: "space-between" }} onPress={() => navigation.navigate("MyWebinars")}>
                            <FeatherIcon name="play-circle" size={18} color={"white"} />
                            <Text style={{ color: COLORS.white, ...FONTS.robotoregular }}> My Webinars</Text>
                        </TouchableOpacity>

                    </View>
                    {(CoursesCount > 0) ?
                        <FlatList
                            data={Data}
                            // ref={ScrollRef}
                            // onScroll={event => {
                            //     setContentVerticalOffset(event.nativeEvent.contentOffset.y);
                            // }}
                            scrollEnabled={true}
                            keyExtractor={item => item.ID}
                            extraData={flalistRefresh}
                            overScrollMode={'never'}
                            renderItem={({ item }) => (
                                <View style={{ backgroundColor: COLORS.white, marginHorizontal: 10, marginBottom: 10, borderRadius: 10 }}>
                                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
                                        <View style={styles.coulmnImage}>
                                            {(item.imageFiles.length > 0) ?
                                                <Image
                                                    source={{ uri: "https://cdn.edusity.com/" + item.imageFiles[0].fileName }}
                                                    resizeMode="contain"
                                                    style={styles.flalistImages}
                                                /> : <Image
                                                    source={{ uri: "https://cdn.edusity.com/" + "courses/2382/85883a4c-c61f-456f-953f-01b94482088d.png" }}
                                                    resizeMode="contain"
                                                    style={styles.flalistImages}
                                                />}
                                        </View>
                                        <View style={styles.coulmnImage}>
                                            <Text style={{ color: COLORS.primary, ...FONTS.robotoregular }}>{item.CourseName}</Text>
                                            <Text style={{ color: COLORS.black, ...FONTS.robotoregular }}>{item.Category}</Text>
                                            <TouchableOpacity style={styles.startNowButton}
                                                onPressIn={() => { handleViewNavigation(item.ID) }}>
                                                <Text style={{ color: COLORS.white, ...FONTS.robotoregular, fontSize: RFValue(10) }}>Start Now</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ paddingHorizontal: "2%" }}>
                                        <Text style={{ color: COLORS.black, ...FONTS.robotomedium, fontSize: RFValue(14) }}>Description:</Text>
                                        <WebView
                                            source={{ html: item.Description }}
                                            contentWidth="100%"
                                            baseStyle={{ fontSize: 14, fontFamily: "Roboto-Regular", color: COLORS.black }}
                                            renderersProps={{ p: { style: { marginLeft: 0 } } }}
                                        />
                                        {/* <WebView style={{ height: 200, width: "100%", flex: 1 }}
                                            scalesPageToFit={false}
                                            source={{ html: `<style>h4{font-size:30px}p{font-size:40px;}</style>${item.Description}` }}
                                        /> */}
                                    </View>
                                </View>
                            )}
                            onEndReachedThreshold={0.2}
                            onEndReached={refresh}
                        /> :
                        <>
                            <View>
                                <NoCourse data={username} />
                            </View>
                        </>
                    }
                    {(!refreshList) ?
                        null :
                        <View style={{ height: 30, width: "100%" }}>
                            <LoaderKit
                                style={{ height: 25 }}
                                name={'Pacman'}
                                size={10}
                                color={COLORS.primary}
                            />
                        </View>
                    }
                </View>
            </SafeAreaView>
            :
            <View style={{ height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}>
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
    coulmnImage: {
        width: "50%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        paddingHorizontal: "2%",
        marginVertical: "2%",
    },
    flalistImages: {
        width: "100%",
        height: 120,
        margin: "1%",
        borderRadius: 8,
    },
    startNowButton: {
        width: "50%",
        backgroundColor: COLORS.primary,
        padding: "5%",
        marginHorizontal: "10%",
        marginVertical: "15%",
        borderRadius: 10,
        alignItems: "center"
    }
})
export default MyCourse;