import React, { useEffect, useState } from 'react';
import {
    View,
    Text, Image, ImageBackground, ActivityIndicator,
    TouchableOpacity,
    ScrollView, FlatList, StyleSheet, Pressable, ToastAndroid
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { images, icons, COLORS, FONTS, SIZES, me } from '../../../constants';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { metrices } from '../../../constants/metrices';
import { useSelector, useDispatch } from 'react-redux';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FA5 from 'react-native-vector-icons/FontAwesome5'
import AntIcon from 'react-native-vector-icons/AntDesign'
import Fontisto from 'react-native-vector-icons/Fontisto'
import OctIcon from 'react-native-vector-icons/Octicons'
import WebView from 'react-native-webview';
import { viewCourseHandler } from '../../../store/redux/viewCourse';
import { cartHandler } from '../../../store/redux/cart';
import { unwrapResult } from '@reduxjs/toolkit';
import { addtoCart } from '../../../services/cartService';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from "@react-navigation/core";
import NetInfo from '@react-native-community/netinfo';
import { getWishListedCourses, wishListRemoverApi, wishListApi } from '../../../services/wishlist';
import { getWishListDataHandler } from '../../../store/redux/getWishListData';
import OverlayLoader from '../../../components/overlayLoader';

const ViewCourse = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const wishArray = useSelector(state => state?.getWishList?.data?.data)
    const CartData = useSelector(state => state?.cartList?.data);
    const Data = useSelector(state => state?.viewCourse?.data)

    const [loader, setLoader] = useState(false);
    const [addLoader, setAddLoader] = useState(false);
    const [token, setToken] = useState("");
    const [network, setNetwork] = useState('')
    const [cartArray, setCartArray] = useState([]);
    const [wishArr, setWishArr] = useState([]);
    const listData = Data?.data;

    const bannerImage = listData?.recordsets[0][0].imageFiles[0].fileName;

    // console.log("List in view ", listData);
    // const wishListed = async (token) => {
    //     setAddLoader(true);
    //     await getWishListedCourses(token).then(response =>
    //         setWishData(response.data),

    //         // console.log("wishlist Data", WishData),
    //     ).catch(err => {
    //         setAddLoader(false)
    //     })
    // }
    useEffect(() => {
        if (wishArray) {
            let ListWishId = [];
            (wishArray).forEach((element) => {
                var Data = (element.ID);
                ListWishId.push(Data);
            }
            )
            setWishArr(ListWishId)
            setAddLoader(false)
        }
    }, [wishArray])

    useEffect(() => {
        if (isFocused) {
            const initialLoading = async () => {
                let newToken = await AsyncStorage.getItem("loginToken");
                setToken(newToken);
                // wishListed(newToken);
            }
            NetInfo.addEventListener(state => {
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

    const handleAddCart = async (id) => {
        setAddLoader(true)
        if (network) {
            if (token) {
                let result = await addtoCart(id, token).then((response) => {
                    dispatch(cartHandler(token))
                }).catch((error) => {
                    setAddLoader(false)
                    ToastAndroid.showWithGravity("Can't able add in Cart, please try again later", ToastAndroid.SHORT, ToastAndroid.CENTER)
                    console.error("Error................addwishList", error);
                });
            }
            else {
                navigation.navigate("Login");
                setAddLoader(false)
            }
        }
        else {
            navigation.navigate("NetworkError");
            setAddLoader(false)
        }
    }

    const handleNavigation = (valueFromButton) => {
        // console.log("value from button..........", valueFromButton)
        if (token) {
            valueFromButton === "Go to Cart" ?
                navigation.navigate("Cart") : navigation.navigate('Home', { screen: 'MyCourse' })
        }
        else {
            navigation.navigate("Login");
        }
    }

    const handleChangeCourse = (item) => {
        setLoader(true)
        // console.log("item.id", item.ID)
        dispatch(viewCourseHandler(item.ID)).then(unwrapResult)
            .then(() => {
                setLoader(false);
            }).catch(() => {
                setLoader(false);
            })
    }

    useEffect(() => {
        if (CartData?.data?.Courses) {
            var ListCartId = [];
            (CartData?.data?.Courses).forEach((element) => {
                var Data = (element.CourseId);
                ListCartId.push(Data);
            })
            setCartArray(ListCartId);
            setAddLoader(false);
        }
    }, [CartData])

    const addToWishlist = async (id) => {
        setAddLoader(true)
        if (token) {
            await wishListApi(id, token).then(response => {
                // wishListed(token)
                dispatch(getWishListDataHandler(token))
            }).catch((error) => {
                setAddLoader(false)
                ToastAndroid.showWithGravity("Can't able add in wishlist, please try again later", ToastAndroid.SHORT, ToastAndroid.CENTER)
                console.error("Error................addwishList", error);
            })
        }
        else {
            navigation.navigate('Login');
            setAddLoader(false)
        }
    }

    const removeFromWishlist = async (id) => {
        setAddLoader(true)
        if (token) {
            await wishListRemoverApi(id, token).then(response => {
                // wishListed(token)
                dispatch(getWishListDataHandler(token))
            }).catch((error) => {
                setAddLoader(false)
                ToastAndroid.showWithGravity("Can't able remove in wishlist, plaese try again later", ToastAndroid.SHORT, ToastAndroid.CENTER)
                console.log("Error in wistlishRemove.........", error)
            })
        }
        else {
            navigation.navigate('Login');
            setAddLoader(false)
        }
    }

    return (
        <>
            {Platform.OS == 'ios' ? <View style={{ height: "5%" }} /> : null}
            {(!listData || loader) ?
                <View style={{ height: "100%", width: "100%", }}>
                    <ImageBackground source={images.LoginBgImage} resizeMode="repeat" style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator size="large" />
                    </ImageBackground>
                </View> :
                <View>
                    {addLoader ? <OverlayLoader /> : null}
                    <View style={{ backgroundColor: "#e9ddf1" }}>
                        <View style={{ width: "100%", flexDirection: "row", backgroundColor: COLORS.primary, borderBottomStartRadius: 30, borderBottomEndRadius: 30, paddingVertical: "3%" }}>
                            <Pressable style={{ flexDirection: "column", alignItems: "flex-start", width: "8%", justifyContent: "center", borderWidth: 0, marginLeft: "5%" }}
                                onPress={() => navigation.goBack()}
                            >
                                <MCIcon name="keyboard-backspace" size={RFValue(25)} color={COLORS.white} />
                            </Pressable>
                            <View style={{ flexDirection: "column", borderWidth: 0, width: "65%", justifyContent: "center" }}>
                                <Text style={{ color: COLORS.white, fontSize: RFValue(16), ...FONTS.robotoregular, textAlign: "center" }}>
                                    {listData?.recordsets?.[0][0].CourseName}
                                </Text>
                            </View>
                            <View style={{ flexDirection: "column", borderWidth: 0, justifyContent: "center", width: "20%" }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                                    <TouchableOpacity style={{ margin: "0%" }}>
                                        <MCIcon name="share-variant" size={RFValue(18)} color={COLORS.white} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ margin: "0%" }} onPress={() => navigation.navigate("Cart")}>
                                        <MCIcon name="cart-variant" size={RFValue(20)} color={COLORS.white} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    <ScrollView style={styles.mainContainer} contentContainerStyle={{ paddingBottom: "5%", }} overScrollMode="never">
                        <View style={styles.colorContainer}>
                            <View style={styles.coulmnImage}>
                                {(listData?.recordsets?.[0][0]?.videoFiles.length > 0) ?
                                    <View style={{ height: "100%", width: "100%", borderWidth: 1, borderRadius: 5, borderColor: "#e9ddf1" }}>
                                        {(listData?.recordsets?.[0][0]?.imageFiles.length > 0) ?
                                            <ImageBackground
                                                source={{ uri: "https://cdn.edusity.com/" + listData?.recordsets[0][0].imageFiles[0].fileName }}
                                                style={{ justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}
                                                resizeMode="stretch"
                                            >
                                                <Pressable onPress={() => navigation.navigate("VideoPlayer", listData?.recordsets?.[0][0]?.videoFiles[0].fileName)}><MCIcon name="play" size={RFValue(60)} color={COLORS.white}></MCIcon></Pressable>
                                            </ImageBackground> :
                                            <ImageBackground
                                                source={{ uri: "https://cdn.edusity.com/" + "courses/2528/de3d968f-0f08-4383-8fe1-3278e996ae15.png" }}
                                                style={{ justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}
                                                resizeMode="stretch"
                                            >
                                                <Pressable onPress={() => navigation.navigate("VideoPlayer", listData?.recordsets?.[0][0]?.videoFiles[0].fileName)}><MCIcon name="play" size={RFValue(60)} color={COLORS.white}></MCIcon></Pressable>
                                            </ImageBackground>}
                                    </View>

                                    : (listData?.recordsets?.[0][0]?.imageFiles.length > 0) ?
                                        <Image
                                            source={{ uri: "https://cdn.edusity.com/" + listData?.recordsets[0][0].imageFiles[0].fileName }}
                                            resizeMode="contain"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                borderRadius: 8
                                            }}
                                        />
                                        : <Image
                                            source={{ uri: "https://cdn.edusity.com/" + "courses/2528/de3d968f-0f08-4383-8fe1-3278e996ae15.png" }}
                                            resizeMode="contain"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                borderRadius: 8
                                            }}
                                        />}
                            </View>
                            <Text style={{ color: COLORS.black, fontSize: RFValue(18), ...FONTS.robotomedium, textAlign: "center" }}>
                                {listData?.recordsets?.[0][0].CourseName}
                            </Text>
                            <Text style={{ color: COLORS.black, fontSize: RFValue(12), ...FONTS.robotomedium, textAlign: "center" }}>
                                {listData?.recordsets?.[0][0].Category}
                            </Text>
                            {(listData?.recordsets?.[0][0].courseOneLiner) ?
                                <Text style={{ color: COLORS.black, fontSize: RFValue(12), ...FONTS.robotoregular, textAlign: "center" }}>
                                    {listData?.recordsets?.[0][0].courseOneLiner}
                                </Text> : null
                            }
                            <View style={{ width: "95%", flexDirection: "row", marginTop: metrices(2) }}>
                                <View style={{ width: "50%" }}>
                                    <View style={{ flexDirection: "row" }}>
                                        <MCIcon name="clock-check" size={15} color={COLORS.primary} style={{ width: "10%" }} />
                                        <Text style={{ color: COLORS.black, ...FONTS.robotoregular, fontSize: RFValue(10), width: "90%" }}>Created on: {(listData?.recordsets?.[0][0].CreatedOn) ? moment(listData.recordsets?.[0][0].CreatedOn).format("MMM DD, YYYY") : "N/A"}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", paddingVertical: "2%" }}>
                                        <FontAwesome name="language" size={15} color={COLORS.primary} style={{ width: "10%" }} />
                                        <Text style={{ color: COLORS.black, fontSize: RFValue(10), ...FONTS.robotoregular, width: "90%" }}>Language: {(listData?.recordsets?.[0][0].Language) ? listData?.recordsets?.[0][0].Language : "N/A"}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <FA5 name="chalkboard-teacher" size={RFValue(15)} color={COLORS.primary} style={{ width: "14%" }} />
                                        <TouchableOpacity onPress={() => navigation.navigate("ViewInstructorProfile", listData.recordsets?.[0][0].instructorInfo)} style={{ width: "86%" }}>
                                            <Text style={{ color: COLORS.black, fontSize: RFValue(11), ...FONTS.robotoregular }}>{listData.recordsets?.[0][0].instructorInfo.firstName} {listData.recordsets?.[0][0].instructorInfo.lastName}{'\n'}
                                                <Text style={{ color: COLORS.primary, fontSize: RFValue(8) }}>View instructor profile</Text>
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                                <View style={{ width: "50%" }}>
                                    <Text style={styles.ratings}>
                                        {(listData?.recordsets?.[0][0].Rating == null) ? <Text style={{ color: COLORS.black, fontSize: RFValue(10), ...FONTS.robotoregular }}>Ratings: 0</Text> :
                                            <View style={{ backgroundColor: "#e9ddf1", }}>
                                                <Rating
                                                    type='star'
                                                    imageSize={20}
                                                    showRating={false}
                                                    isDisabled={true}
                                                    tintColor='#e9ddf1'
                                                    defaultRating={5}
                                                    ratingCount={(listData?.recordsets?.[0][0].Rating == null) ? 0 : listData?.recordsets?.[0][0].Rating}
                                                />
                                            </View>
                                        }
                                    </Text>
                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={{ color: COLORS.black, fontSize: RFValue(10), ...FONTS.robotoregular, width: "90%" }}>Course views: {(listData?.recordsets?.[0][0].courseViews) ? listData?.recordsets?.[0][0].courseViews : "N/A"}</Text>
                                    </View>
                                    {(Data.data.recordsets[0][0].isPurchased === false) ?
                                        <Text style={{ color: COLORS.black, fontSize: RFValue(20), ...FONTS.robotomedium }}>Price: ${listData?.recordsets?.[0][0].EnrollmentFee}
                                        </Text> : null
                                    }
                                </View>

                            </View>
                        </View>
                        <View style={{ backgroundColor: COLORS.white, borderColor: "red", paddingHorizontal: metrices(1) }}>
                            <View style={{ marginTop: "2%" }}>
                                {/* {(Data.data.recordsets[0][0].isPurchased === false) ?
                                    <TouchableOpacity style={{ width: "90%", alignItems: "center", justifyContent: "center", backgroundColor: COLORS.primary, marginHorizontal: "5%", marginTop: "5%", padding: "3%" }}>
                                        <Text style={{ color: COLORS.white, fontSize: RFValue(12), ...FONTS.robotoregular }}>Buy Now</Text>
                                    </TouchableOpacity> :
                                    null
                                } */}
                                <View style={{ flexDirection: "row" }}>
                                    {(Data.data.recordsets[0][0].isPurchased === false && wishArray) ?
                                        !(wishArr.includes(listData?.recordsets[0][0].ID)) ?
                                            <TouchableOpacity style={{ flexDirection: "column", width: "48%", alignItems: "center", justifyContent: "center", margin: "1%", borderWidth: 1, padding: "3%" }} onPress={() => addToWishlist(listData?.recordsets[0][0].ID)}>
                                                <Text style={{ color: COLORS.black, fontSize: RFValue(12), ...FONTS.robotoregular }}>Add To Wishlist</Text>
                                            </TouchableOpacity> :
                                            <TouchableOpacity style={{ flexDirection: "column", width: "48%", alignItems: "center", justifyContent: "center", margin: "1%", borderWidth: 1, padding: "3%", backgroundColor: COLORS.black }} onPress={() => removeFromWishlist(listData?.recordsets[0][0].ID)}>
                                                <Text style={{ color: COLORS.white, fontSize: RFValue(12), ...FONTS.robotoregular }}>Remove from Wishlist</Text>
                                            </TouchableOpacity>
                                        :
                                        null}
                                    {/* {console.log("Purchased..........", (Data.data.recordsets[0][0].isPurchased === false))}
                                    {console.log("Includes in cart..........", cartArray.includes(listData?.recordsets[0][0].ID), "cartArray....", cartArray, "id...........", listData?.recordsets[0][0].ID)}
                                    {(Data.data.recordsets[0][0].isPurchased === false) ?
                                        (cartArray.includes(listData?.recordsets[0][0].ID)) ?
                                            console.log("Go to cart") :
                                            console.log("Add to cart") :
                                        console.log("Purchased")
                                    } */}
                                    {/* {console.log("Cartarray..........", cartArray.length, cartArray.length != 0)} */}
                                    {/* (cartArray.length != 0) ? */
                                        (Data.data.recordsets[0][0].isPurchased === false) ?
                                            (cartArray.includes(listData?.recordsets[0][0].ID)) ?
                                                <TouchableOpacity style={{ flexDirection: "column", width: (Data.data.recordsets[0][0].isPurchased) ? "96%" : "48%", alignItems: "center", justifyContent: "center", backgroundColor: COLORS.gray, margin: "1%", borderWidth: 1, borderColor: COLORS.gray, padding: "3%" }} onPress={() => handleNavigation("Go to Cart")}>
                                                    <Text style={{ color: COLORS.white, fontSize: RFValue(12), ...FONTS.robotoregular }}>Go to Cart</Text>
                                                </TouchableOpacity> :
                                                <TouchableOpacity style={{ flexDirection: "column", width: (Data.data.recordsets[0][0].isPurchased) ? "96%" : "48%", alignItems: "center", justifyContent: "center", margin: "1%", borderWidth: 1, padding: "3%" }} onPress={() => handleAddCart(listData?.recordsets[0][0].ID)}>
                                                    <Text style={{ color: COLORS.black, fontSize: RFValue(12), ...FONTS.robotoregular }}>Add To Cart</Text>
                                                </TouchableOpacity> :
                                            <TouchableOpacity style={{ backgroundColor: COLORS.black, flexDirection: "column", width: (Data.data.recordsets[0][0].isPurchased) ? "96%" : "48%", alignItems: "center", justifyContent: "center", margin: "1%", borderWidth: 1, padding: "3%" }} onPress={() => handleNavigation("Purchased")}>
                                                <Text style={{ color: COLORS.white, fontSize: RFValue(12), ...FONTS.robotoregular }}>Purchased</Text>
                                            </TouchableOpacity>
                                        /* : null */}
                                </View>
                                <View style={styles.separator} />
                            </View>
                            {(listData?.recordsets[0][0]?.goals?.length != 0) ?
                                <View style={styles.componentshadow}>
                                    <View style={{ width: "100%", justifyContent: "center" }}>
                                        <Text style={styles.titles}>
                                            <MCIcon name="target" size={RFValue(16)} color={"red"} />{" "}COURSE HIGHLIGHTS
                                        </Text>
                                    </View>
                                    {(listData?.recordsets[0][0].goals).map((item, index) => {
                                        return (
                                            <View style={{ width: "90%", left: "4%" }}>
                                                <Text key={index} style={{ fontSize: RFValue(13), color: COLORS.black, ...FONTS.robotoregular }}><AntIcon name="checkcircleo" size={12} color={COLORS.primary} />{" "}{(item?.name).trim()}</Text>
                                            </View>)
                                    })}
                                    <View style={styles.separator} />
                                </View> : null
                            }

                            {(listData?.recordsets[0][0]?.syllabus?.length != 0) ?
                                <View style={styles.componentshadow}>
                                    <View style={{ width: "100%", justifyContent: "center" }}>
                                        <Text style={styles.titles}>
                                            <Fontisto name="angelist" size={RFValue(16)} color={"red"} />{" "}COURSE SYLLABUS
                                        </Text>
                                    </View>
                                    <View style={{ width: "90%", left: "4%" }}>
                                        {(listData?.recordsets[0][0].syllabus).map((item, index) => {
                                            return (
                                                <Text key={index} style={{ fontSize: RFValue(13), color: COLORS.black, ...FONTS.robotoregular }}>
                                                    <AntIcon name="checkcircleo" size={RFValue(12)} color={COLORS.primary} />{" "}{(item?.name).trim()}</Text>
                                            )
                                        })}
                                    </View>
                                    <View style={styles.separator} />
                                </View> : null
                            }

                            {(listData) ?
                                <View style={styles.componentshadow}>
                                    <View style={{ width: "100%", justifyContent: "center" }}>
                                        <Text style={styles.titles}>
                                            <MCIcon name="notebook" size={RFValue(16)} color={"red"} />{" "}COURSE DESCRIPTION
                                        </Text>
                                    </View>
                                    <View style={{ width: "90%", left: "4%" }}>
                                        <WebView style={{ width: "100%", height: metrices(22) }}
                                            source={{
                                                html: `<div>${listData?.recordsets[0][0].Description && typeof listData?.recordsets[0][0].Description === 'string' ? listData?.recordsets[0][0].Description.replace(/(<br>|[\n\r]+)/g, ' ').trim() : ''
                                                    }</div>`
                                            }}
                                            scalesPageToFit={false}
                                        />
                                        {/* <Text style={{ margin: "1%", fontSize: RFValue(13), color: COLORS.black, ...FONTS.robotoregular, }}><AntIcon name="checkcircleo" size={13} color={COLORS.primary} /> {listData?.recordsets[0][0].Description} </Text> */}
                                    </View>
                                    <View style={styles.separator} />
                                </View> :
                                <Text style={{ ...FONTS.robotoregular, fontSize: metrices(2), left: "6%", color: COLORS.black }}>Not Available for this course</Text>
                            }

                            <View style={styles.componentshadow}>
                                <View style={{ width: "100%", justifyContent: "center" }}>
                                    <Text style={styles.titles}>
                                        <OctIcon name="checklist" size={RFValue(16)} color={"red"} />{" "}This Includes
                                    </Text>
                                </View>
                                <View style={{ width: "90%", left: "4%" }}>
                                    <Text style={{ margin: "1%", fontSize: RFValue(13), color: COLORS.black, ...FONTS.robotoregular, }}><AntIcon name="youtube" size={RFValue(13)} color={COLORS.primary} /> of video material </Text>
                                    <Text style={{ margin: "1%", fontSize: RFValue(13), color: COLORS.black, ...FONTS.robotoregular, }}><FontAwesome name="language" size={RFValue(13)} color={COLORS.primary} /> Languanges : English </Text>
                                    <Text style={{ margin: "1%", fontSize: RFValue(13), color: COLORS.black, ...FONTS.robotoregular, }}><AntIcon name="clouddownloado" size={RFValue(13)} color={COLORS.primary} /> Downloadable Resources </Text>
                                    <Text style={{ margin: "1%", fontSize: RFValue(13), color: COLORS.black, ...FONTS.robotoregular, }}><AntIcon name="mobile1" size={RFValue(13)} color={COLORS.primary} /> Access from mobile and tablet </Text>
                                    <Text style={{ margin: "1%", fontSize: RFValue(13), color: COLORS.black, ...FONTS.robotoregular, }}><MCIcon name="brain" size={RFValue(13)} color={COLORS.primary} /> Self paced learning!</Text>
                                </View>
                                <View style={styles.separator} />
                            </View>
                            <View style={styles.componentshadow}>
                                <View style={{ width: "100%", justifyContent: "center" }}>
                                    <Text style={styles.titles}>
                                        <MCIcon name="book" size={RFValue(16)} color={"red"} />{" "}Related Course's
                                    </Text>
                                </View>
                                {(listData?.recordsets[0][0]?.relatedCourses.length != 0) ?
                                    <View style={{ width: "95%", left: "4%", marginTop: "2%" }}>
                                        <FlatList
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            data={listData?.recordsets[0][0]?.relatedCourses}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity style={styles.componentFlatlist} onPress={() => handleChangeCourse(item)}>
                                                    {(item.imageFiles.length > 0) ?
                                                        <Image
                                                            source={{ uri: "https://cdn.edusity.com/" + item.imageFiles[0].fileName }}
                                                            resizeMode="contain"
                                                            style={{
                                                                width: "96%",
                                                                height: RFValue(100),
                                                                margin: "2%",
                                                                borderTopLeftRadius: 20, borderBottomRightRadius: 20, padding: "5%"
                                                            }}
                                                        /> : <Image
                                                            source={{ uri: "https://cdn.edusity.com/" + "courses/2528/de3d968f-0f08-4383-8fe1-3278e996ae15.png" }}
                                                            resizeMode="contain"
                                                            style={{
                                                                width: "96%",
                                                                height: RFValue(100),
                                                                margin: "2%",
                                                                borderTopLeftRadius: 20, borderBottomRightRadius: 20, padding: "5%"
                                                            }}
                                                        />}
                                                    <Text style={{ marginLeft: "2%", fontSize: RFValue(12), color: COLORS.primary, ...FONTS.robotomedium }}>{item.CourseName}</Text>
                                                    <Text style={{ margin: "2%", fontSize: RFValue(12), color: COLORS.black, ...FONTS.robotoregular }}>
                                                        {item.Category} <Text style={{ fontSize: RFValue(12), color: COLORS.black, ...FONTS.robotoregular }}>({item.SubCategory})</Text>
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            keyExtractor={(item, index) => index}
                                        />
                                        {/* <Text style={{ margin: "1%", fontSize: RFValue(13), color: COLORS.black,...FONTS.robotoregular, }}>listDatarecordsets[0][0].Description </Text> */}
                                    </View> :
                                    <Text style={{ ...FONTS.robotoregular, fontSize: metrices(2), left: "6%", color: COLORS.black }}>Not Available for this course</Text>
                                }
                                <View style={styles.separator} />
                            </View>
                            {(listData?.recordsets[0][0]?.faqs?.length != 0) ?
                                <View style={styles.componentshadow}>
                                    <View style={{ width: "100%", justifyContent: "center" }}>
                                        <Text style={styles.titles}>
                                            <AntIcon name="key" size={RFValue(16)} color={"red"} />{" "}COURSE FAQS
                                        </Text>
                                    </View>
                                    {(listData?.recordsets[0][0].faqs).map((item, index) => {
                                        return (
                                            <View style={{ width: "90%", left: "4%" }}>
                                                <Text key={index} style={{ margin: "1%", fontSize: RFValue(14), color: COLORS.black, ...FONTS.robotoregular, }}>{item?.question} </Text>
                                                <Text key={index} style={{ marginLeft: "4%", fontSize: RFValue(14), color: COLORS.black, ...FONTS.robotoregular, }}><AntIcon name="checkcircleo" size={12} color={COLORS.primary} /> {item?.answer} </Text>
                                            </View>)
                                    })}
                                    <View style={styles.separator} />
                                </View> :
                                null
                            }
                        </View>
                        <View style={{ padding: metrices(2) }} />
                    </ScrollView >
                </View>
            }
        </>
    );
}
const styles = StyleSheet.create({
    mainContainer: {
        height: "100%",
        width: "100%",
        borderBottomStartRadius: 5,
        borderBottomEndRadius: 5,
        backgroundColor: COLORS.white
    },
    componentshadow: {
        // borderWidth: 2,
        backgroundColor: COLORS.white,
        width: "100%"
    },
    componentFlatlist: {
        backgroundColor: COLORS.lightGray,
        height: "100%",
        width: metrices(26),
        marginRight: metrices(1.5),
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 5
    },
    mainTouchable: {
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 2.25,
        shadowRadius: 3.84,
    },
    searchContainer: {
        backgroundColor: COLORS.white,
        height: "60%",
        borderRadius: 25,
        width: "90%",
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#FFFF",
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

    listItem: {
        flex: 1,
        right: "1.5%",
        margin: 10,
        padding: 5,
        backgroundColor: COLORS.white,
        width: '97%',
        height: "100%",
        lineHeight: "1.5",

    },
    listItemText: {
        fontSize: 18,
        color: "#000"
    },
    details: { flexDirection: "row", justifyContent: "space-between", paddingBottom: 5 },
    Brand: {
        fontSize: RFValue(10, 580), fontWeight: "300", color: COLORS.gray,
    },
    location: {
        fontSize: RFValue(12, 580), fontWeight: "800", color: COLORS.black, marginLeft: "8%", padding: "3%", top: "25%"
    },
    ratings: {
        fontSize: 10, color: COLORS.black, backgroundColor: "#e9ddf1",
    },
    colorContainer: {
        backgroundColor: "#e9ddf1",
        paddingBottom: metrices(2),
        width: "100%",
        alignItems: "center"
    },
    coulmnImage: {
        width: "95%",
        height: metrices(24),
        alignItems: "center",
        justifyContent: "space-around",
        marginTop: metrices(2)
    },
    separator: { borderBotomWidth: 2, borderBottomWidth: 2, marginVertical: metrices(1), borderColor: COLORS.lightGray },
    titles: { fontSize: RFValue(15), color: COLORS.black, ...FONTS.robotomedium }
});
export default ViewCourse;