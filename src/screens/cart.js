import React, { useEffect, useState } from 'react';
import {
    View,
    Text, Image,
    TouchableOpacity,
    Modal,
    Pressable, FlatList, StyleSheet, KeyboardAvoidingView,
} from 'react-native';
import 'intl';
import { RFValue } from 'react-native-responsive-fontsize';
import LoaderKit from 'react-native-loader-kit';
import { images, icons, COLORS, FONTS, SIZES } from "../constants";
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { cartHandler } from '../store/redux/cart';
import { Colors } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { viewCourseHandler } from '../store/redux/viewCourse';
import { deleteItemUrl, cartListUrl } from '../services/constant';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import "../assets/icons/edusity-logo.png"
//Sham Changes
// import StripePopup from "../StripePopup";
import RazorpayCheckout from 'react-native-razorpay';
import Toast from 'react-native-simple-toast';
// import NoData from './noCartData';
import NoData from './Exceptions/noCartData';
import { useIsFocused } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import { checkoutUrl } from '../services/constant';

const Cart = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [network, setNetwork] = useState('')

    const [Token, setToken] = useState("");
    const cartData = useSelector((state) => state.cartList.data)
    // console.log("thor....",cartData)
    // const loader=useSelector((state) => state.loginHandle.loading)
    // const carValueData = useSelector((state) => state.cartList)
    const [showloader, SetLoader] = useState(false);
    const [Data, setData] = useState([]);
    const [totalValue, setTotalValue] = useState(0);
    const [loader, setLoader] = useState(false);
    //sham changes
    const LoginData = useSelector(state => state.userLoginHandle.data)
    const [overlay, setOverlay] = useState(null);
    const [dataSession, setDataSession] = useState();
    // const [modalVisible, setModalVisible] = useState(false);
    // const popupCloseHandler = (e) => {
    //     console.log("im inside the close handler");
    //     setOverlay((state) => !state);
    // };
    // console.log("iam inside...............", LoginData.data);
    const username = LoginData?.data?.userName;
    useEffect(() => {
        if (isFocused) {
            NetInfo.refresh().then(state => {
                setNetwork(state.isConnected)
                if (state.isConnected) {
                    initialLoading();
                }
                else {
                    navigation.navigate("NetworkError");
                }
            })
            const initialLoading = async () => {
                let token = await AsyncStorage.getItem("loginToken");
                setLoader(true);
                if (token) {
                    setToken(token)
                    dispatch(cartHandler(token)).then(unwrapResult)
                        .then((originalPromiseResult) => {
                            setData(originalPromiseResult.data.Courses);

                            // console.log(originalPromiseResult.data.Courses,"Courses")
                        })
                        .catch((rejectedValueOrSerializedError) => {
                            // console.log(" cart List failed Inside catch", rejectedValueOrSerializedError);
                            setLoader(false);
                        })
                } else {
                    setLoader(false);
                    navigation.replace('Login');
                }
            }

        }
    }, [isFocused, network])

    const handleViewNavigation = (item) => {
        SetLoader(true);
        dispatch(viewCourseHandler(item)).then(unwrapResult)
            .then((originalPromiseResult) => {
                SetLoader(false);
                navigation.navigate("ViewCourse");
            })
            .catch((rejectedValueOrSerializedError) => {
                // console.log(" Inside catch", rejectedValueOrSerializedError);
                SetLoader(false);
            })

    }
    const callCart = () => {
        SetLoader(true);
        dispatch(cartHandler(Token)).then(unwrapResult)
            .then((originalPromiseResult) => {
                // console.log("CartList ", originalPromiseResult);
                setData(originalPromiseResult.data.Courses);
                SetLoader(false);
            })
            .catch((rejectedValueOrSerializedError) => {
                // console.log(" cart List failed Inside catch", rejectedValueOrSerializedError);
                SetLoader(false);
            })
    }


    //sham changes
    const handleMakePayment = (Data) => {
        const session = Data[0].SessionID;
        setDataSession(session);
        // console.log("iam inside search value of cartvalueData", totalValue);
        let pricing = (totalValue * 100).toString();
        // console.log("iam inside search value of cartvalueData",pricing);
        var options = {
            name: "Edusity",
            description: "Test Transaction",
            image: "../assets/icons/edusity-logo.png",
            key: "rzp_test_0YBgt6YFSNUirq",
            order_id: dataSession,
            currency: 'USD',
            amount: pricing,
            prefill: {
                name: "buusha",
                email: "buusha.br@gmail.com",
                contact: 8939423416,
            },
        }
        // console.log("im the checkout................",options)
        // RazorpayCheckout.open(options).then((data) => {
        //     // handle success
        //     alert(`Success: ${data.razorpay_payment_id}`);
        //   }).catch((error) => {
        //     // handle failure
        //     alert(`Error: ${error.code} | ${error.description}`);
        //   });
        RazorpayCheckout.open(options)
            .then(async (result) => {
                // alert(`Success: ${result.razorpay_payment_id}`);
                let Token = await AsyncStorage.getItem("loginToken");
                var sessionId = { "sessionId": result.razorpay_payment_id }
                // console.log("Im inisde the data of Cart page....", result)

                //let cartremoval = `https://backend-linux-payment.azurewebsites.net/v2/checkout?country=IN`;
                const response = await axios.post(checkoutUrl + "?country=IN", sessionId, {
                    headers: {
                        Authorization: `Bearer ${Token}`,
                    }
                }).then(result => {
                    // console.log(result, "hebrew..............", sessionId, Token);

                    navigation.navigate('Checkout')
                }).catch(err => {
                    // console.log("err in removal", err)
                });
                // console.log(sessionId,"im th echeckout token.................", Token);
                // console.log("im the response of checkout data.......", response);
            })
            .catch(error => {
                // Toast.show(error, "RazorPay Rejection", Toast.LONG);
                alert(`Error: ${error.description}`);
                // console.log("im th echeckout error.................", error);
            });
    };
    // useEffect(() => {
    //     // console.log("im the setoverlay value", overlay)
    // }, [overlay])
    /* useEffect(() => {
         
             setOverlay(null);
         }
         console.log("Im theoverlay", overlay,isFocused)
     }, [isFocused]
     ) */
    // const renderOverlay = () => {
    //     console.log("Im inisde the surc..........", overlay)
    //     switch (overlay) {
    //         case "stripe":
    //             return (
    //                 <StripePopup
    //                     onClose={popupCloseHandler}
    //                     cartItems={cartItems}
    //                 ></StripePopup>
    //             );
    //         case "razorpay":
    //             console.log("inside case razor");

    //             // navigation.navigate("Razor",{dataSession,totalValue})
    //             return <RazorpayOverlay onClose={popupCloseHandler} data={dataSession} pricing={totalValue} />;
    //         default:
    //             console.log("inside case null")
    //             return null;
    //     }
    // };
    // const RazorpayOverlay = (onClose, data, pricing) => {

    //     { console.log("im the price of total amount................", totalValue) }
    //     var options = {
    //         name: "Edusity",
    //         amount: "1000",
    //         description: "Test Transaction",
    //         image: "../assets/icons/edusity-logo.png",
    //         currency: 'INR',
    //         key: "rzp_test_0YBgt6YFSNUirq",
    //         order_id: data,
    //         modal: {
    //             ondismiss: () => {
    //                 onClose((state) => !state);
    //             },
    //         },
    //         prefill: {
    //             name: LoginData.data.userName,
    //             email: LoginData.data.email,
    //             contact: 8939423416,
    //         },
    //     };
    //     RazorpayCheckout.open(options)
    //         .then(async (result) => {
    //             // alert(`Success: ${result.razorpay_payment_id}`);
    //             var sessionId = { "sessionId": result.razorpay_payment_id }
    //             console.log("Im inisde the data of Cart page....", result)
    //             //setOverlay(null);
    //             let cartremoval = `https://backend-linux-payment.azurewebsites.net/v2/checkout?country=IN`
    //             const response = await axios.post(cartremoval, sessionId, {
    //                 headers: {
    //                     Authorization: `Bearer ${Token}`,
    //                 }
    //             }).then((data) => {
    //                 console.log("waiting for the data ", data);
    //                 navigation.navigate('Checkout')
    //             });

    //         })
    //         .catch(error => {
    //             console.log("im the catch data inisde the loggics")
    //             navigation.navigate('Home', { screen: 'Search' });
    //             Toast.show(BushaoriginalPromiseResult.errormessage, "RazorPay Rejection", Toast.LONG);
    //         });
    // }
    const removeItem = async (id) => {
        // console.log(id, "............................id")
        SetLoader(true);
        //let removeUrl = `https://backend-linux-payment.azurewebsites.net/v2/cart/${id}?country=IN&isBundle=0`
        return axios
            .delete(cartListUrl + "/${id}?country=IN&isBundle=0", {
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            })
            .then((response) => {
                // console.log("im th Removal item token..................", Token)
                callCart();
                console.log("........................................response", response.data)
                SetLoader(false);
                return response.data;
            })
            .catch(err => { console.log(err, "error listed"), SetLoader(false); })
    }
    const deleteCart = async () => {

        await axios.delete(cartListUrl, { headers: { 'Authorization': "Bearer " + Token } })
            .then(response => {
                // console.log(response.data);
                callCart()
            })
            .catch(err => { console.log(err, "error listed"), SetLoader(false) })
    }
    useEffect(() => {
        // console.log(cartData,"cartData2");
        let cartValue = 0
        let course = cartData?.data?.Courses;
        // console.log(course,"course detail")
        setData(cartData);
        for (let i = 0; i < course?.length; i++) {
            cartValue = cartValue + course[i].enrollmentFee;

        }
        setTotalValue(cartValue);
        setLoader(false);

    }, [cartData])
    // console.log("im the cart data in cart page", Data)

    const LoaderActivity = () => {
        return (
            <View style={{ width: "100%", alignItems: "center", paddingBottom: "5%", height: "100%", justifyContent: "center" }}>
                <LoaderKit
                    style={{ width: 50, height: 55 }}
                    name={'BallPulse'} // Optional: see list of animations below
                    size={30} // Required on iOS
                    color={COLORS.primary} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',
                />
            </View>
        )
    }
    return (
        <>
            <KeyboardAvoidingView style={styles.mainContainer}>
                    <View style={{ flexDirection: "row", alignItems: "center", color: COLORS.black, backgroundColor: COLORS.primary, height: "8%", borderBottomStartRadius: 30, borderBottomEndRadius: 30 }}>
                        <TouchableOpacity style={{ marginLeft: "4%" }} onPress={() => navigation.goBack()}>
                            <MCIcon name="keyboard-backspace" size={RFValue(20)} color={COLORS.white} />
                        </TouchableOpacity>
                        <Text style={{ color: COLORS.white, marginLeft: "2%", fontSize: RFValue(18), ...FONTS.robotoregular }}>Cart</Text>
                    </View>

                {(!loader) ?

                    (Data.length > 0) ?
                        <>
                            {/* <View style={{ backgroundColor: COLORS.white }}>
                                <View style={{ flexDirection: "row", alignItems: "center", color: COLORS.black, backgroundColor: COLORS.primary, height: "8%", borderBottomStartRadius: 30, borderBottomEndRadius: 30 }}>
                                    <TouchableOpacity style={{ marginLeft: "4%" }} onPress={() => navigation.goBack()}>
                                        <MCIcon name="keyboard-backspace" size={RFValue(20)} color={COLORS.white} />
                                    </TouchableOpacity>
                                    <Text style={{ color: COLORS.white, marginLeft: "2%", fontSize: RFValue(18), ...FONTS.robotoregular }}>Cart</Text>
                                </View>
                            </View> */}
                            <View style={{ color: COLORS.black, backgroundColor: COLORS.lightGray, height: "78%" }}>
                                <FlatList
                                    data={Data}
                                    scrollEnabled={true}
                                    keyExtractor={item => item.CourseId}
                                    // extraData={flalistRefresh}
                                    renderItem={({ item }) => (
                                        <View style={styles.mainTouchable}>
                                            <View style={{ flexDirection: "row", width: "100%", margin: "2%", padding: "2%" }}>
                                                <Pressable style={{ flexDirection: "column", width: "70%", alignItems: "flex-start", }} onPressIn={() => handleViewNavigation(item.CourseId)}>
                                                    <Text style={{ color: COLORS.black, fontSize: RFValue(14), ...FONTS.robotomedium }}>
                                                        {item.CourseName}
                                                    </Text>
                                                    <Text style={{ color: COLORS.primary, fontSize: RFValue(12), ...FONTS.robotomedium }}>
                                                        <Text style={{ color: COLORS.black }}>Instructor:</Text> {item.Author}
                                                    </Text>

                                                </Pressable>
                                                <View style={{ flexDirection: "column", width: "20%", alignItems: "flex-end" }}>
                                                    <Text style={{ color: COLORS.primary, fontSize: RFValue(16), ...FONTS.robotomedium }}>
                                                        ${item.enrollmentFee}
                                                    </Text>

                                                </View>
                                            </View>

                                            <TouchableOpacity style={{ flexDirection: "row" }} onPressIn={() => removeItem(item.cartId)}>
                                                <MCIcon name="delete-forever" size={RFValue(20)} color="red" />
                                                <Text style={{ color: "red", fontSize: RFValue(8), marginTop: "1%", marginHorizontal: "1%", paddingBottom: "2%", ...FONTS.robotoregular }}>Remove from Cart</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                />
                            </View>
                            <View style={{ color: COLORS.black, backgroundColor: COLORS.white, height: "18%" }}>
                                <View style={{ flexDirection: "row", height: "40%", width: "100%" }}>
                                    <View style={{ flexDirection: "column", width: "40%", alignItems: "flex-start" }}>
                                        <Text style={{ color: COLORS.black, padding: "2%", marginHorizontal: "8%", fontSize: RFValue(10), ...FONTS.robotomedium }}>Total items :{(cartData?.data?.Courses)?.length}</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: "column", width: "60%", alignItems: "flex-end" }}>
                                        <Text style={{ color: COLORS.black, padding: "2%", marginHorizontal: "5%", fontSize: RFValue(10), ...FONTS.robotoregular, textAlign: "right" }}>SubTotal{"\n"}
                                            <Text style={{ color: COLORS.primary, padding: "2%", marginHorizontal: "5%", fontSize: RFValue(15), ...FONTS.robotomedium }}> ${totalValue.toFixed(2)}</Text> {"\n"}
                                            <Text style={{ color: COLORS.black, fontSize: RFValue(6), ...FONTS.robotoregular, textAlign: "right" }}>+ TAXES WILL BE ADDED AT CHECKOUT IF APPLICABLE</Text>
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: "row", height: "35%", width: "100%", }}>
                                    <View style={{ flexDirection: "column", width: "50%", alignItems: "center" }}>
                                        <TouchableOpacity style={{ backgroundColor: COLORS.gray, borderRadius: 10, width: "90%", height: "90%", justifyContent: "center" }} onPress={() => { deleteCart(), SetLoader(true) }}>
                                            <Text style={{ color: COLORS.white, padding: "2%", marginHorizontal: "5%", fontSize: RFValue(14), ...FONTS.robotoregular, textAlign: "center" }}>Empty the Cart</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: "column", width: "50%", alignItems: "center" }}>
                                        <TouchableOpacity style={{ backgroundColor: COLORS.primary, borderRadius: 10, width: "90%", height: "90%", justifyContent: "center" }} onPress={() => handleMakePayment(Data)}>
                                            <Text style={{ color: COLORS.white, padding: "2%", marginHorizontal: "5%", fontSize: RFValue(14), ...FONTS.robotoregular, textAlign: "center" }}>Secure Checkout
                                                {'\n'}
                                                <Text style={{ color: COLORS.white, marginHorizontal: "5%", fontSize: RFValue(8), ...FONTS.robotoregular, textAlign: "center" }}>You Will Be Redirected To Razor Pay </Text>
                                            </Text>

                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                        </>
                        :
                        <>
                            <View>
                                < NoData data={username} />
                            </View>
                        </>
                    : <LoaderActivity />
                }


                {/* RazorpayCheckout.open(options).then((data) => {
                        // handle success
                        alert(`Success: ${data.razorpay_payment_id}`);
                    }).catch((error) => {
                        // handle failure
                        alert(`Error: ${error.code} | ${error.description}`);
                    }); */}



            </KeyboardAvoidingView>
        </>
    );
}
const styles = StyleSheet.create({
    mainContainer: {
        height: "100%",
        width: "100%",
        backgroundColor:COLORS.white
    },
    mainTouchable: {
        margin: "2%",
        borderRadius: 10,
        backgroundColor: Colors.white,
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 2.25,
        shadowRadius: 3.84,
    },
    listItem: {
        flex: 1,
        marginTop: ".5%",
        padding: 22,
        backgroundColor: COLORS.white,
        width: '100%',
        flexDirection: 'row',
        height: 130,
        lineHeight: "1.5",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderColor: "#FFF",
        paddingTop: 2,
        borderWidth: 1,
        borderRadius: 10,
    },
    centeredView: {
        flex: 1,
        marginTop: 22,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
        marginTop: 20
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        ...FONTS.robotoregular
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        ...FONTS.robotoregular
    }
});
export default Cart;