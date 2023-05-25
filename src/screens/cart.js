import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { unwrapResult } from '@reduxjs/toolkit';
import { StripeProvider, usePaymentSheet } from '@stripe/stripe-react-native';
import axios from 'axios';
import 'intl';
import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Pressable, StyleSheet, Text, TouchableOpacity, View, Alert, Dimensions, ToastAndroid } from 'react-native';
import LoaderKit from 'react-native-loader-kit';
import { Colors } from 'react-native-paper';
import RazorpayCheckout from 'react-native-razorpay';
import { RFValue } from 'react-native-responsive-fontsize';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, FONTS } from "../constants";
import { cartListUrl, checkoutUrl, intentPayment } from '../services/constant';
import { cartHandler } from '../store/redux/cart';
import { viewCourseHandler } from '../store/redux/viewCourse';
import NoData from './Exceptions/noCartData';
import { razorpayKeyLive, stripepayKeyLive } from '../services/constant';
import OverlayLoader from '../components/overlayLoader';

const { width, height } = Dimensions.get('window');

const Cart = () => {

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [network, setNetwork] = useState('')
    const [ready, setReady] = useState(false);
    const [Token, setToken] = useState("");
    const cartData = useSelector((state) => state.cartList.data)
    const Geolocation = useSelector((state) => state.geoLocationPicker);
    const [Data, setData] = useState([]);
    const [totalValue, setTotalValue] = useState(0);
    const [loader, setLoader] = useState(false);
    const [addLoader, setAddLoader] = useState(false);
    const LoginData = useSelector(state => state.userLoginHandle.data)
    const [dataSession, setDataSession] = useState();
    const username = LoginData?.data?.userName;

    const {
        initPaymentSheet,
        presentPaymentSheet,
        loading,
        resetPaymentSheetCustomer,
    } = usePaymentSheet();

    const initialLoading = async () => {
        let token = await AsyncStorage.getItem("loginToken");
        setLoader(true);
        if (token) {
            setToken(token)
            dispatch(cartHandler(token)).then(unwrapResult)
                .then((originalPromiseResult) => {
                    setData(originalPromiseResult.data.Courses);
                    setLoader(false);
                    //console.log("Data",Data[0].TotalAmount);
                    //initialisePaymentSheet();
                })
                .catch((rejectedValueOrSerializedError) => {
                    setLoader(false);
                    console.log("error", rejectedValueOrSerializedError);
                })
        } else {
            setLoader(false);
            navigation.replace('Login');
        }
    }

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

        }
    }, [isFocused, network])

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
        initialisePaymentSheet(cartValue);
        //fetchPaymentSheetParams();
        setLoader(false);
    }, [cartData])

    const fetchPaymentSheetParams = async (cartvalue) => {
        let Token = await AsyncStorage.getItem("loginToken")
        console.log("stripe", Token, cartvalue)
        const response = await axios.post(intentPayment, { 'amount': cartvalue }, {
            headers: {
                'Authorization': `Bearer ${Token}`,
            },
        })
            .then((response) => {
                //let response = data?.data.data;
                console.log("Payment details like customerId,ephemeralKey and paymentIntent................", response?.data.data);
                return response?.data.data
            })
            .catch(err => {
                console.log("error in fetching", err);
            });
        console.log("ressspppoooonnsee...", response);
        const { paymentIntent, ephemeralKey, customer } = response;
        console.log(paymentIntent, "......", ephemeralKey, ".....", customer)
        return {
            paymentIntent,
            ephemeralKey,
            customer,
        };
    };

    const initialisePaymentSheet = async (cartvalue) => {
        console.log("Inside the initialisePaymentSheet");
        const { paymentIntent, customer, ephemeralKey } = await fetchPaymentSheetParams(cartvalue);
        console.log("jjjj", paymentIntent, "jjjj", customer, "jjjj", ephemeralKey);
        const { error } = await initPaymentSheet({
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            appearance: {
                colors: {
                    primary: '#e06c75',
                    background: '#282c34',
                    componentBackground: '#abb2bf',
                    componentDivider: '#e5c07b',
                    primaryText: '#61afef',
                    secondaryText: '#c678dd',
                    componentText: '#282c34',
                    icon: '#e06c75',
                    placeholderText: '#ffffff',
                },
                shapes: {
                    borderRadius: 25,
                },
            },
            paymentIntentClientSecret: paymentIntent,
            merchantDisplayName: 'Edusity Inc.',
            applePay: {
                merchantCountryCode: 'US',
            },
            googlePay: {
                merchantCountryCode: 'US',
                testEnv: true,
                currencyCode: 'usd',
            },
            allowsDelayedPaymentMethods: true,
            returnURL: 'stripe-example://stripe-redirect',
        });
        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            console.log("Readyyyyyyy....", error)
            setReady(true);
        }
    };

    const handleViewNavigation = (item) => {
        setLoader(true);
        dispatch(viewCourseHandler(item)).then(unwrapResult)
            .then((originalPromiseResult) => {
                setLoader(false);
                navigation.navigate("ViewCourse");
            })
            .catch((rejectedValueOrSerializedError) => {
                ToastAndroid.showWithGravity('Something went wrong, please try again later!', ToastAndroid.CENTER, ToastAndroid.LONG);
                // console.log(" Inside catch", rejectedValueOrSerializedError);
                setLoader(false);
            })
    }

    const callCart = () => {
        setLoader(true);
        dispatch(cartHandler(Token)).then(unwrapResult)
            .then((originalPromiseResult) => {
                // console.log("CartList ", originalPromiseResult);
                setData(originalPromiseResult.data.Courses);
                setAddLoader(false);
            })
            .catch((rejectedValueOrSerializedError) => {
                // console.log(" cart List failed Inside catch", rejectedValueOrSerializedError);
                ToastAndroid.showWithGravity("Can't able to remove from cart, please try again later", ToastAndroid.CENTER, ToastAndroid.LONG);
                setAddLoader(false);
            })
    }

    const removeItem = async (id) => {
        setAddLoader(true);
        return axios.delete(cartListUrl + `/${id}?country=IN&isBundle=0`, {
            headers: {
                Authorization: `Bearer ${Token}`,
            },
        }).then((response) => {
            callCart();
            setLoader(false);
            return response.data;
        }).catch((err) => {
            console.log(err, "error listed"),
                setAddLoader(false);
        })
    }

    const deleteCart = async () => {
        setAddLoader(true);
        await axios.delete(cartListUrl, { headers: { 'Authorization': "Bearer " + Token } })
            .then(response => {
                callCart()
            })
            .catch((err) => { console.log(err, "error listed"), setLoader(false) })
    }

    const LoaderActivity = () => {
        return (
            <View style={{ width: "100%", alignItems: "center", paddingBottom: "5%", height: "100%", justifyContent: "center" }}>
                <LoaderKit
                    style={{ width: 50, height: 55 }}
                    name={'BallPulse'}
                    size={30}
                    color={COLORS.primary}
                />
            </View>
        )
    }

    const AlertPayment = () => {
        Alert.alert(
            "Checkout by logging in via Web Application 'edusity.com'",
            "currently the payment option is not enabled in the application",
            [

                { text: "OK" }
            ]
        );
    }

    {/* Payment with regards to Location ******************** */ }
    const handleMakePayment = async (Data) => {
        console.log("Geolocation.countryCode.................", Geolocation.countryCode, "Data.........", Data[0]);
        // if(Geolocation.countryCode=="IN"){
        const session = Data[0].SessionID;
        setDataSession(session);
        console.log("session", session, Geolocation)
        let pricing = Data[0].TotalAmount * 100
        // let pricing = 1 * 100
        var options = {
            name: "Edusity",
            description: "Test Transaction",
            image: "../assets/icons/edusity-logo.png",
            key: razorpayKeyLive,
            order_id: dataSession,
            currency: 'INR',
            amount: pricing,
            prefill: {
                name: LoginData.data.firstName,
                email: LoginData.data.email,
                contact: "",
            },
        }

        RazorpayCheckout.open(options)
            .then(async (result) => {
                // alert(`Success: ${result.razorpay_payment_id}`);
                let Token = await AsyncStorage.getItem("loginToken");
                var sessionId = { "sessionId": result.razorpay_payment_id }
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
                navigation.goBack();
                // console.log("im th echeckout error.................", error);
            });
        // }
        // else{
        // console.log("India");
        //     const {error} = await presentPaymentSheet();
        //     if (error) {
        //       Alert.alert(`Error code: ${error.code}`, error.message);
        //       console.log("session",Data[0].SessionID);
        //     } else {
        //       Alert.alert('Success', 'The payment was confirmed successfully');

        //       setReady(false);
        //         const session = Data[0].SessionID;
        //         // console.log(Data[0].SessionId)
        //         const response = await axios.post(checkoutUrl + "?country=IN", {"sessionId":session}, {
        //             headers: {
        //                 Authorization: `Bearer ${Token}`,
        //             }
        //         }).then(result => {
        //             console.log(result, "result stripe",result);

        //             navigation.navigate('Checkout')
        //         }).catch(err => {
        //             console.log("err in removal", err)
        //         });





        //     }
        // }

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

    return (
        <StripeProvider
            publishableKey={stripepayKeyLive}
            merchantIdentifier="merchant.com.EdusityMobi"
        >
            <KeyboardAvoidingView style={styles.mainContainer}>
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MCIcon name="keyboard-backspace" size={RFValue(25)} color={COLORS.white} />
                    </TouchableOpacity>
                    <Text style={{ color: COLORS.white, fontSize: RFValue(16, 580), ...FONTS.robotoregular, marginLeft: 14 }}>Cart</Text>
                </View>
                {addLoader ? <OverlayLoader /> : null}
                {(!loader) ?
                    (Data.length > 0) ?
                        <>
                            <View style={styles.flatlistContainerstyle}>
                                <FlatList
                                    data={Data}
                                    scrollEnabled={true}
                                    keyExtractor={item => item.CourseId}
                                    // extraData={flalistRefresh}
                                    renderItem={({ item }) => (
                                        <View style={styles.mainTouchable}>
                                            <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
                                                <TouchableOpacity style={{ flexDirection: "column" }} onPressIn={() => handleViewNavigation(item.CourseId)}>
                                                    <Text style={{ color: COLORS.black, fontSize: RFValue(14), ...FONTS.robotomedium }}>
                                                        {item.CourseName}
                                                    </Text>
                                                    <Text style={{ color: COLORS.primary, fontSize: RFValue(12), ...FONTS.robotomedium }}>
                                                        <Text style={{ color: COLORS.black }}>Instructor:</Text> {item.Author}
                                                    </Text>
                                                </TouchableOpacity>
                                                <View style={{ flexDirection: "column", }}>
                                                    <Text style={{ color: COLORS.primary, fontSize: RFValue(16), ...FONTS.robotomedium }}>
                                                        ${item.enrollmentFee}
                                                    </Text>
                                                </View>
                                            </View>

                                            <TouchableOpacity style={styles.deleteButton} onPressIn={() => removeItem(item.cartId)}>
                                                <MCIcon name="cart-remove" size={RFValue(18)} color="red" />
                                                <Text style={{ color: "red", fontSize: RFValue(10), ...FONTS.robotoregular }}>Remove from Cart</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                />
                            </View>
                            <View style={{ backgroundColor: COLORS.white, height: "18%" }}>
                                <View style={{ flexDirection: "row", height: "40%", width: "100%" }}>
                                    <View style={{ flexDirection: "column", width: "40%", alignItems: "flex-start" }}>
                                        <Text style={{ color: COLORS.black, padding: "2%", marginHorizontal: "8%", fontSize: RFValue(10), ...FONTS.robotomedium }}>Total items : {(cartData?.data?.Courses)?.length}</Text>
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
                                        <TouchableOpacity style={{ backgroundColor: COLORS.gray, borderRadius: 10, width: "90%", height: "90%", justifyContent: "center" }} onPress={() => { deleteCart(), setLoader(true) }}>
                                            <Text style={{ color: COLORS.white, padding: "2%", marginHorizontal: "5%", fontSize: RFValue(14), ...FONTS.robotoregular, textAlign: "center" }}>Empty the Cart</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: "column", width: "50%", alignItems: "center" }}>
                                        <TouchableOpacity style={{ backgroundColor: COLORS.primary, borderRadius: 10, width: "90%", height: "90%", justifyContent: "center" }} onPress={() => /* AlertPayment() */ handleMakePayment(Data)}>
                                            <Text style={{ color: COLORS.white, padding: "2%", marginHorizontal: "5%", fontSize: RFValue(14), ...FONTS.robotoregular, textAlign: "center" }}>Proceed
                                                {/* {'\n'} */}
                                                {/* <Text style={{ color: COLORS.white, marginHorizontal: "5%", fontSize: RFValue(8), ...FONTS.robotoregular, textAlign: "center" }}>You Will Be Redirected To Razor Pay </Text> */}
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
        </StripeProvider>
    );
}
const styles = StyleSheet.create({
    mainContainer: {
        height: "100%",
        width: "100%",
        backgroundColor: COLORS.lightGray,
    },
    mainTouchable: {
        borderRadius: 10,
        backgroundColor: Colors.white,
        marginBottom: 12,
        padding: 8
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        color: COLORS.black,
        backgroundColor: COLORS.primary,
        height: "8%",
        borderBottomStartRadius: 30,
        borderBottomEndRadius: 30,
        alignItems: "center",
        paddingHorizontal: 18
    },
    flatlistContainerstyle: {
        color: COLORS.black,
        backgroundColor: COLORS.lightGray,
        height: height / 1.3,
        padding: 12
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
    deleteButton: {
        flexDirection: "row",
        marginTop: 6,
        borderWidth: 1,
        borderRadius: 6,
        alignItems: "center",
        borderColor: COLORS.lightGray,
        width: "36%",
        padding: 4,
        justifyContent: "space-evenly"
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