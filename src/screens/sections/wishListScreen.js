import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StatusBar, TouchableOpacity, FlatList, Image, StyleSheet, BackHandler, ToastAndroid
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LoaderKit from 'react-native-loader-kit'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images, icons, COLORS, FONTS, SIZES } from '../../constants';
import { RFValue } from 'react-native-responsive-fontsize';
import { useSelector, useDispatch } from 'react-redux';
import { wishListRemoverApi } from '../../services/wishlist';
import { useNavigation } from '@react-navigation/native';
import WebView from 'react-native-webview';
import { useIsFocused } from "@react-navigation/core";
import NoWishList from "../../screens/Exceptions/noWishList";
import { getWishListedCourses } from '../../services/wishlist';
import NetInfo from '@react-native-community/netinfo';
import { addtoCart } from '../../services/cartService';
import { cartHandler } from '../../store/redux/cart';
import { unwrapResult } from '@reduxjs/toolkit';
import { viewCourseHandler } from '../../store/redux/viewCourse';
import OverlayLoader from '../../components/overlayLoader';

const WishListScreen = () => {
    // console.log("wishlist");
    const dispatch = useDispatch();
    const navigation = useNavigation();
    // const Token = useSelector(state => state.loginHandle?.data?.data);
    const [Data, setData] = useState([]);
    const [loginToken, setLoginToken] = useState();
    const [totalCourses, setTotalCourse] = useState(0);
    // const [totalPage, setTotalPage] = useState(0);
    const [refreshList, setRefreshList] = useState(false);
    const [loader, setLoader] = useState(false);
    const [flalistRefresh, setFlatListRefresh] = useState(false);
    // // const [CoursesCount, setCourseCount] = useState(0);
    const getWishListData = useSelector(state => state?.getWishList?.data?.data)
    const [page, setPage] = useState(1);
    const [addLoader, setAddLoader] = useState(false);
    const isFocused = useIsFocused();
    const LoginData = useSelector(state => state.userLoginHandle.data)
    const cartData = useSelector((state) => state.cartList.data.data)
    const [cartArray, setCartArray] = useState([]);
    const [network, setNetwork] = useState('')
    const username = LoginData?.data?.userName;
    // console.log("wishList data.............", getWishListData);

    useEffect(() => {
        if (isFocused) {
            NetInfo.refresh().then(state => {
                setNetwork(state.isConnected)
                if (state.isConnected) {
                    getWishListed();
                }
                else {
                    navigation.navigate("NetworkError");
                }
            })
            const getWishListed = async () => {
                setLoader(true);
                let token = await AsyncStorage.getItem("loginToken");
                setLoginToken(token);
                if (token) {
                    let purchasedData = await getWishListedCourses(token).then(data => {
                        console.log(data, "hellosegwrgwrgwr");
                        setLoader(false);
                        if (data.data) {
                            setData(data?.data);
                            setTotalCourse(data?.data.length);
                            // setRefreshList(false);
                        }
                    }).catch((err) => {
                        console.log("Error in handling the data............", err);
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
    }, [isFocused, network, refreshList])

    useEffect(() => {
        if (cartData) {
            var ListCartId = [];
            (cartData?.Courses).forEach((element) => {
                var Data = (element.CourseId);
                ListCartId.push(Data);
            })
            setCartArray(ListCartId);
            setAddLoader(false)
            console.log("ListCartId....heloo................", ListCartId)
        }
    }, [cartData])

    function handleBackButtonClick() {
        // console.log("navigation done")
        navigation.navigate('Home', { screen: 'Search' });
        return true;
    }

    const removeFromList = async (id) => {
        // setShowHeart(showHeart)
        await wishListRemoverApi(id, loginToken).then(data => {
            setRefreshList(!refreshList);
        })
    }

    const addToCart = async (id) => {
        setAddLoader(true)
        let result = await addtoCart(id, loginToken).then(response => {
            if (response.error) { ToastAndroid.showWithGravity(response.message, ToastAndroid.TOP, ToastAndroid.LONG) }
            dispatch(cartHandler(loginToken));
        }).catch(() => {
            setAddLoader(false);
            ToastAndroid.showWithGravity("Can't able to add in cart, please try again later", ToastAndroid.CENTER, ToastAndroid.LONG)
        });
    }


    // const refresh = () => {

    //     if (page < totalPage) {
    //         setPage(page + 1);
    //         setRefreshList(true);
    //     }
    // }


    // const handleViewNavigation = (item) => {
    //     console.log(item, "ID")
    //     dispatch(viewCourseHandler(item.ID)).then(unwrapResult)
    //         .then((originalPromiseResult) => {
    //             console.log("successfully returned to login with response CourseList ", originalPromiseResult);
    //             navigation.navigate("ViewCourse");
    //         })
    //         .catch((rejectedValueOrSerializedError) => {
    //             console.log(" Inside catch", rejectedValueOrSerializedError);
    //         })

    // };

    return (
        (!loader) ?
            <SafeAreaView>
                <StatusBar
                    animated={true}
                    backgroundColor={COLORS.primary}
                />
                {addLoader ? <OverlayLoader /> : null}
                <View style={{ height: "100%", backgroundColor: COLORS.lightGray }}>
                    <>
                        <Text style={{ color: COLORS.primary, marginHorizontal: "5%", marginVertical: "2%", ...FONTS.robotoregular }}>No of WishLists: {Data.length}</Text>
                    </>
                    {(Data.length >= 1) ?
                        <FlatList
                            data={Data}
                            // ref={ScrollRef}
                            // onScroll={event => {
                            //     setContentVerticalOffset(event.nativeEvent.contentOffset.y);
                            // }}
                            scrollEnabled={true}
                            keyExtractor={item => item.ID}
                            // extraData={flalistRefresh}
                            overScrollMode={'never'}
                            renderItem={({ item }) => (
                                <View style={styles.flatListContainer}>
                                    <View style={{ width: "100%", flexDirection: "row", padding: 10 }}>
                                        <View style={styles.coulmnImage}>
                                            <Image
                                                source={{ uri: "https://cdn.edusity.com/" + item.fileName }}
                                                resizeMode="contain"
                                                style={{
                                                    width: "100%",
                                                    height: 120,
                                                    borderRadius: 8,
                                                }}
                                            />
                                        </View>
                                        <View style={styles.columnDetails}>
                                            <Text style={{ color: COLORS.primary, ...FONTS.robotomedium, fontSize: 16 }}>{item.CourseName}</Text>
                                            <Text style={{ color: COLORS.black, ...FONTS.robotoregular, fontSize: 14 }}>{item.Category}</Text>
                                            <View style={styles.buttonContainer}>
                                                {!(cartArray.includes(item.ID)) ?
                                                    <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.primary }]} onPressIn={() => { addToCart(item.ID) }}>
                                                        <Text style={styles.buttonText}>Add to Cart</Text>
                                                    </TouchableOpacity> :
                                                    <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.gray }]} onPressIn={() => { navigation.navigate("Cart") }}>
                                                        <Text style={styles.buttonText}>View Cart</Text>
                                                    </TouchableOpacity>
                                                }
                                                <TouchableOpacity style={[styles.button, { backgroundColor: "red" }]} onPressIn={() => { removeFromList(item.ID) }}>
                                                    <Text style={styles.buttonText}>Remove</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}
                        // onEndReachedThreshold={0.2}
                        // onEndReached={refresh}
                        /> :
                        <View>
                            <NoWishList data={username} />
                        </View>
                    }
                    {/* <View style={{ height: "3%", width: "100%" }}>
                        {(!refreshList) ? null
                            : <LoaderKit
                                style={{ height: 25 }}
                                name={'Pacman'} 
                                size={10}
                                color={COLORS.primary} 
                            />}
                    </View> */}
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
    flatListContainer: {
        backgroundColor: COLORS.white,
        marginHorizontal: 10,
        marginBottom: 10,
        borderRadius: 10
    },
    coulmnImage: {
        width: "40%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around"
    },
    columnDetails: {
        flexDirection: "column",
        width: "60%",
        paddingLeft: 6,
        alignItems: "center"
    },
    buttonText: {
        color: COLORS.white,
        ...FONTS.robotoregular,
        fontSize: RFValue(10)
    },
    buttonContainer: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        marginTop: 20,
        justifyContent: "space-evenly"
    },
    button: {
        width: "40%",
        padding: "5%",
        flexDirection: "column",
        borderRadius: 10,
        alignItems: "center"
    }
})
export default WishListScreen;