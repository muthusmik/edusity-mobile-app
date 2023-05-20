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
import WebView from 'react-native-webview';
import { useIsFocused } from "@react-navigation/core";
import NoCourse from '../Exceptions/noPurchasedCourse';
import NetInfo from '@react-native-community/netinfo';
import FeatherIcon from "react-native-vector-icons/Feather"
import { colorsDark } from 'react-native-elements/dist/config';
const MyCourse = () => {
    // console.log("MyCourse");
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
                        console.log(data.data, "hello");
                        setData(data?.data?.data);
                        setTotalCourse(data?.data.total);
                        setTotalPage(data?.data.total_page)
                        setCourseCount(data?.data?.total)
                        setLoader(false);
                    })
                }
                else {
                    setLoader(false);
                    navigation.navigate('Login');
                    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
                    return () => {
                        BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
                    };
                }
            }

        }
    }, [isFocused, network])

    function handleBackButtonClick() {
        // console.log("navigation done")
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
        // console.log(item, "ID")
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
                    <View style={{ flexDirection: "row", padding: "2%" }}>
                        <View style={{ width: "70%", flexDirection: 'column' }}>
                            <Text style={{ color: COLORS.primary, marginHorizontal: "5%", ...FONTS.robotoregular }}>Your Courses: {CoursesCount}</Text>
                        </View>
                        <View style={{ width: "30%", flexDirection: 'column', alignItems: "center", justifyContent: "center" }}>
                            <TouchableOpacity style={{ flexDirection: "row", backgroundColor: COLORS.primary, marginHorizontal: "2%", padding: "4%", borderRadius: 5 }} onPress={() => navigation.navigate("MyWebinars")}>
                                {/* {console.log("Course/Count", CoursesCount)} */}
                                <FeatherIcon name="play-circle" size={18} style={{ marginHorizontal: "1%" }} color={"white"} />
                                <Text style={{ color: COLORS.white, marginHorizontal: "5%", marginVertical: "2%", ...FONTS.robotoregular }}>
                                    My Webinars</Text>
                            </TouchableOpacity>
                        </View>
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
                                <View style={{ backgroundColor: COLORS.white, marginHorizontal: "2%", marginBottom: "2%", borderRadius: 10 }}>
                                    <View style={{ width: "100%", flexDirection: "row" }}>
                                        <View style={styles.coulmnImage}>
                                        {/* {console.log("Data inside myCourse.........",Data)} */}
                                            {(item.imageFiles.length > 0) ?
                                                <Image
                                                    source={{ uri: "https://cdn.edusity.com/" + item.imageFiles[0].fileName }}
                                                    resizeMode="contain"

                                                    style={{
                                                        width: "100%",
                                                        height: 120,
                                                        margin: "1%",
                                                        borderRadius: 8,
                                                    }}
                                                /> : <Image
                                                    source={{ uri: "https://cdn.edusity.com/" + "courses/2382/85883a4c-c61f-456f-953f-01b94482088d.png" }}
                                                    resizeMode="contain"

                                                    style={{
                                                        width: "98%",
                                                        height: 100,
                                                        margin: "1%",
                                                        borderRadius: 8,
                                                    }}
                                                />}
                                        </View>
                                        <View style={{ flexDirection: "column", width: "45%", marginVertical: "5%", marginHorizontal: "2%" }}>
                                            <Text style={{ color: COLORS.primary, ...FONTS.robotoregular }}>{item.CourseName}</Text>
                                            <Text style={{ color: COLORS.black, ...FONTS.robotoregular }}>{item.Category}</Text>
                                            <TouchableOpacity style={{
                                                width: "50%",
                                                backgroundColor: COLORS.primary,
                                                padding: "5%",
                                                marginHorizontal: "10%",
                                                marginVertical: "15%",
                                                borderRadius: 10,
                                                alignItems: "center"
                                            }}
                                                onPressIn={() => { handleViewNavigation(item.ID) }}>
                                                <Text style={{ color: COLORS.white, ...FONTS.robotoregular, fontSize: RFValue(10) }}> Start Now</Text>
                                            </TouchableOpacity>

                                        </View>
                                    </View>
                                    <View style={{ paddingHorizontal: "2%" }}>
                                        <Text style={{ color: COLORS.black, ...FONTS.robotomedium, fontSize: RFValue(10) }}>Description:</Text>
                                        <WebView style={{ height: 200, width: "100%" }}
                                            scalesPageToFit={false}
                                            source={{ html: `<style>h4{font-size:30px}p{font-size:40px;}</style>${item.Description}` }}
                                        />
                                        {/* <Text style={{color:COLORS.black,fontWeight:"800",fontSize:RFValue(8)}}>{item.Description}</Text> */}
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
                    <View style={{ height: "3%", width: "100%" }}>
                        {(!refreshList) ? null
                            : <LoaderKit
                                style={{ height: 25 }}
                                name={'Pacman'} // Optional: see list of animations below
                                size={10} // Required on iOS
                                color={COLORS.primary} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',
                            />}
                    </View>
                </View>
            </SafeAreaView>
            :
            <View style={{ height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}>
                <LoaderKit
                    style={{ width: 50, height: 50 }}
                    name={'BallPulse'} // Optional: see list of animations below
                    size={50} // Required on iOS
                    color={COLORS.primary} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
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
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        paddingHorizontal: "2%",
        marginVertical: "2%",
    }
})
export default MyCourse;