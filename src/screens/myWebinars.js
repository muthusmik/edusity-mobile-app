import React, { useEffect, useState } from 'react';
import {
    View,
    Text, Image,
    TouchableOpacity,
    Modal,
    Pressable, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Alert, Dimensions, Linking, ToastAndroid
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoaderKit from 'react-native-loader-kit';
import { images, icons, COLORS, FONTS, SIZES } from "../constants";
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { Colors } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useIsFocused } from "@react-navigation/core";
import NetInfo from '@react-native-community/netinfo';
import { getWebinars, generateWebinarToken } from '../services/webinars';
import NoCourse from './Exceptions/noPurchasedCourse';
import { viewCourseHandler } from '../store/redux/viewCourse';
import NoWebinars from './Exceptions/noWebinars';
import moment from 'moment';
import FeatherIcon from "react-native-vector-icons/Feather";
import WebView from 'react-native-webview';

const platformUsing = Platform.OS;
const { width, height } = Dimensions.get('window')

const MyWebinars = ({ data }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
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
    const [webminarUrl, setWebminarUrl] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const getwebinarslist = async () => {
        setLoader(true);
        let token = await AsyncStorage.getItem("loginToken");
        setLoginToken(token);

        console.log("Token from......", token, "Page........", page)
        if (token) {
            let webinarData = await getWebinars(token, page).then(data => {
                console.log("webinar", data.data);
                setData(data?.data);
                setLoader(false);
            }).catch((error) => { console.log("Catch error in getwebinars.........", error) })
        }
    }

    useEffect(() => {
        if (isFocused) {
            NetInfo.refresh().then(state => {
                setNetwork(state.isConnected)
                if (state.isConnected) {
                    getwebinarslist();
                }
                else {
                    navigation.navigate("NetworkError");
                }
            })
        }
    }, [isFocused, network])

    useEffect(() => {
        const getwebinarslist = async () => {
            if (page > 1) {
                let webinarData = await getWebinars(loginToken, page).then(data => {
                    let newdata = data?.data?.data
                    setData(Data.concat(newdata));
                    setRefreshList(false);
                }).catch((error) => {
                    ToastAndroid.showWithGravity("Something went wrong, please try again later", ToastAndroid.CENTER, ToastAndroid.LONG)
                    console.log("Error in getWebinars list..........", error)
                })
            }
        }
        getwebinarslist();
    }, [page])
    // https://backend-linux-login.azurewebsites.net/webinar/join?webinarId=208

    const getwebinarToken = async (id) => {
        setLoader(true);
        let webinarData = await generateWebinarToken(loginToken, id).then(data => {
            setLoader(false);
            return data;
        })
        console.log("Data for response webminar url..............", webinarData);
        if (webinarData?.error === true) {
            Alert.alert("Alert", webinarData.message)
        } else if (webinarData?.error === false) {
            setWebminarUrl(webinarData.data)
            setModalVisible(true)
            ToastAndroid.showWithGravity("Now you will redirect to google chrome from Edusity", ToastAndroid.CENTER, ToastAndroid.LONG)
            // const openURL = (url) => {
            //     Linking.openURL(url)
            //         .catch(error => console.error('Error opening URL:', error));
            // }
            // openURL(webinarData.data)
            // navigation.navigate("jitsiCall", { webinarData });
        }
    }

    const handleQuickView = (id) => {
        if (network) {
            setLoader(true);
            dispatch(viewCourseHandler(id)).then(unwrapResult)
                .then((originalPromiseResult) => {
                    // console.log("successfully returned to login with response CourseList ", originalPromiseResult);
                    navigation.navigate("ViewCourse");
                    setLoader(false);
                })
                .catch((rejectedValueOrSerializedError) => {
                    navigation.navigate("ServerError");
                    setLoader(false);
                })
        }
        else {
            navigation.navigate("NetworkError");
        }
    }
    return (
        (!loader) ?
            <View style={{ height: "100%" }}>
                {Platform.OS == 'ios' ? <View style={{ height: "5%" }} /> : null}
                <View style={{ height: 60, backgroundColor: COLORS.primary, flexDirection: "row", alignItems: "center" }} >
                    {/* <View style={{ flexDirection: "column", width: "30%", marginHorizontal: "2%", marginVertical: "3%", }}> */}
                    <TouchableOpacity style={{ marginLeft: 20, borderWidth: 0 }} onPress={() => navigation.goBack()}>
                        <MCIcon name="keyboard-backspace" size={RFValue(25)} color={COLORS.white} />
                    </TouchableOpacity>
                    {/* </View> */}
                    <View style={{ flexDirection: "column", width: "75%", alignItems: "center" }}>
                        <Text style={{ fontSize: RFValue(20), color: COLORS.white, ...FONTS.robotoregular }}>My Webinars</Text>
                    </View>
                </View>
                {(Data?.length > 0) ?
                    <View style={{ paddingTop: 6, paddingHorizontal: 10, height: height - 60 }}>
                        <Text style={{ fontSize: RFValue(14), color: COLORS.black, ...FONTS.robotoregular, marginBottom: 6 }}>Your Have <Text style={{ color: COLORS.primary }}>{Data.length} Upcoming Webinars</Text></Text>
                        <FlatList
                            data={Data}
                            // ref={ScrollRef}
                            // onScroll={event => {
                            //     setContentVerticalOffset(event.nativeEvent.contentOffset.y);
                            // }}
                            scrollEnabled={true}
                            // contentContainerStyle={{ }}
                            keyExtractor={item => item.ID}
                            // extraData={flalistRefresh}
                            overScrollMode={'never'}
                            renderItem={({ item }) => (
                                <View style={{ backgroundColor: COLORS.white, borderRadius: 10, width: "100%", flexDirection: "row", marginBottom: 8, padding: 6 }}>
                                    <View style={styles.coulmnImage}>
                                        {(item.imageFiles.length > 0) ?
                                            <Image
                                                source={{ uri: "https://cdn.edusity.com/" + item.imageFiles[0].fileName }}
                                                resizeMode="contain"
                                                style={{
                                                    width: "90%",
                                                    height: 160,
                                                    borderRadius: 8,
                                                }}
                                            /> : <Image
                                                source={{ uri: "https://cdn.edusity.com/" + "courses/2382/85883a4c-c61f-456f-953f-01b94482088d.png" }}
                                                resizeMode="contain"
                                                style={{
                                                    width: "90%",
                                                    height: 120,
                                                    borderRadius: 8,
                                                }}
                                            />}
                                    </View>
                                    <View style={{ flexDirection: "column", width: "50%" }}>
                                        <View style={{ marginTop: 20 }}>
                                            <Text style={{ color: COLORS.black, ...FONTS.robotoregular, fontSize: RFValue(13) }}>EventName:<Text style={{ color: COLORS.primary }}> {(item.eventName) ? (item.eventName) : "N/A"}</Text></Text>
                                            <Text style={{ color: COLORS.black, ...FONTS.robotoregular, fontSize: RFValue(13) }}>CourseName:<Text style={{ color: COLORS.primary }}> {(item.CourseName) ? (item.CourseName) : "N/A"}</Text></Text>
                                            <Text style={{ color: COLORS.black, ...FONTS.robotoregular, fontSize: RFValue(13) }}>WebinarDate:<Text style={{ color: COLORS.primary }}> {moment(item.webinarDate).format("DD/MMM/YY")}</Text></Text>
                                            <Text style={{ color: COLORS.black, ...FONTS.robotoregular, fontSize: RFValue(13) }}>Start Time:<Text style={{ color: COLORS.primary }}> {moment(item.startTime, 'HH:mm:ss').format("HH:mm")}</Text></Text>
                                            <Text style={{ color: COLORS.black, ...FONTS.robotoregular, fontSize: RFValue(13) }}>End Time:<Text style={{ color: COLORS.primary }}> {moment(item.endTime, 'HH:mm:ss').format("HH:mm")}</Text></Text>
                                        </View>
                                        <View style={{ flexDirection: "row", marginTop: 12, alignItems: "center", justifyContent: "center" }}>
                                            <TouchableOpacity style={{
                                                width: "40%",
                                                backgroundColor: "#00A389",
                                                padding: "3%",
                                                borderRadius: 5,
                                                alignItems: "center"
                                            }}
                                                onPress={() => handleQuickView(item.courseId)}
                                            >
                                                <Text style={{ color: COLORS.white, ...FONTS.robotoregular, fontSize: RFValue(10) }}>QUICK VIEW</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{
                                                width: "40%",
                                                backgroundColor: "#228b22",
                                                padding: "3%",
                                                marginHorizontal: "3%",
                                                borderRadius: 5,
                                                alignItems: "center",
                                                flexDirection: "row",
                                                justifyContent: "center"
                                            }}
                                                onPress={() => getwebinarToken(item.id)}
                                            >
                                                <Text style={{ color: COLORS.white, ...FONTS.robotoregular, fontSize: RFValue(10) }}>JOIN </Text>
                                                <FeatherIcon name="play-circle" size={10} style={{ marginHorizontal: "1%" }} color={"white"} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )}
                        // onEndReachedThreshold={0.2}
                        // onEndReached={refresh}
                        />
                        <View style={styles.centeredView}>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={() => {
                                    Alert.alert('Modal has been closed.');
                                    setModalVisible(!modalVisible);
                                }}>
                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                        <Text style={styles.modalText}>Hello World!</Text>
                                        {/* {console.log("Inside retur if  ", webminarUrl)} */}
                                        <WebView
                                            source={{ uri: webminarUrl }}
                                            style={{ marginTop: 10, maxHeight: height-80, width: 350, flex: 1 }}
                                        />
                                    </View>
                                </View>
                            </Modal>
                            <Pressable
                                style={[styles.button, styles.buttonOpen]}
                                onPress={() => setModalVisible(true)}>
                                <Text style={styles.textStyle}>Show Modal</Text>
                            </Pressable>
                        </View>
                    </View> :
                    <>
                        <View>
                            <NoWebinars data={username} />
                        </View>
                    </>
                }
            </View>
            :
            <View style={{ height: "100%", width: "100%", justifyContent: "center", alignItems: "center" }}>
                <LoaderKit
                    style={{ width: 50, height: 50 }}
                    name={'BallPulse'} // Optional: see list of animations below
                    size={50} // Required on iOS
                    color={COLORS.primary} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
                />
            </View>
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.white,
    },
    coulmnImage: {
        width: "45%",
        paddingVertical: 6,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    modalView: {
        width: "100%",
        backgroundColor: 'white',
        flex: 1,
        alignItems: 'center',
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
    },
});
export default MyWebinars;