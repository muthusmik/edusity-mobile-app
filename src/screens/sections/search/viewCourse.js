import React, { useEffect, useState } from 'react';
import {
    View,
    Text, Image, ImageBackground,
    TouchableOpacity, Share,
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
import { viewCourseHandler } from '../../../store/redux/viewCourse';
import { cartHandler } from '../../../store/redux/cart';
import { unwrapResult } from '@reduxjs/toolkit';
import { addtoCart } from '../../../services/cartService';
import moment from 'moment';
import LoaderKit from 'react-native-loader-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from "@react-navigation/core";
import NetInfo from '@react-native-community/netinfo';
import { getWishListedCourses, wishListRemoverApi, wishListApi } from '../../../services/wishlist';
import { getWishListDataHandler } from '../../../store/redux/getWishListData';
import OverlayLoader from '../../../components/overlayLoader';
import WebView from 'react-native-render-html';

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

    const shareLink = async () => {
        const category = (listData?.recordsets?.[0][0].Category).toLowerCase().replace(/\s/g, '-');
        const courseName = (listData?.recordsets?.[0][0].CourseName).toLowerCase().replace(/\s/g, '-') + "-" + listData?.recordsets[0][0].ID;
        const link = `https://dev.edusity.com/categories/${category}/${courseName}`;

        try {
            await Share.share({
                message: link,
            });
        } catch (error) {
            ToastAndroid.show(error, ToastAndroid.BOTTOM, ToastAndroid.LONG);
            console.log('Error sharing:', error.message);
        }
    };

    return (
        <>
            {Platform.OS == 'ios' ? <View style={{ height: "5%" }} /> : null}
            {(!listData || loader) ?
                <View style={{ height: "100%", width: "100%", }}>
                    <ImageBackground source={images.LoginBgImage} resizeMode="repeat" style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center" }}>
                        <LoaderKit
                            style={{ width: 50, height: 50 }}
                            name={'BallPulse'}
                            size={50}
                            color={COLORS.primary}
                        />
                    </ImageBackground>
                </View> :
                <View style={{ backgroundColor: COLORS.white }}>
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
                                    <TouchableOpacity style={{ margin: "0%" }} onPress={shareLink}>
                                        <MCIcon name="share-variant" size={RFValue(18)} color={COLORS.white} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ margin: "0%" }} onPress={() => handleNavigation("Go to Cart")}>
                                        <MCIcon name="cart-variant" size={RFValue(20)} color={COLORS.white} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    <ScrollView style={styles.mainContainer} contentContainerStyle={{ paddingBottom: "5%" }} overScrollMode="never">
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
                            {/* <Text style={{ color: COLORS.black, fontSize: RFValue(18), ...FONTS.robotomedium, textAlign: "center" }}>
                                {listData?.recordsets?.[0][0].CourseName}
                            </Text> */}
                            <Text style={{ color: COLORS.black, fontSize: RFValue(14), ...FONTS.robotomedium, textAlign: "center" }}>Category: {listData?.recordsets?.[0][0].Category}</Text>
                            {(listData?.recordsets?.[0][0].courseOneLiner) ?
                                <Text style={{ color: COLORS.black, fontSize: RFValue(12), ...FONTS.robotoregular, textAlign: "center" }}>
                                    {listData?.recordsets?.[0][0].courseOneLiner}
                                </Text> : null
                            }
                            <View style={{ width: "94%", flexDirection: "row", marginTop: metrices(1) }}>
                                <View style={{ width: "50%" }}>
                                    <View style={styles.infoDetails}>
                                        <MCIcon name="clock-check" size={20} color={COLORS.primary} style={{ width: "14%" }} />
                                        <Text style={{ color: COLORS.black, ...FONTS.robotoregular, fontSize: RFValue(12), width: "86%" }}>Created on: {(listData?.recordsets?.[0][0].CreatedOn) ? moment(listData.recordsets?.[0][0].CreatedOn).format("MMM DD, YYYY") : "N/A"}</Text>
                                    </View>
                                    <View style={styles.infoDetails}>
                                        <FontAwesome name="language" size={20} color={COLORS.primary} style={{ width: "14%" }} />
                                        <Text style={{ color: COLORS.black, fontSize: RFValue(12), ...FONTS.robotoregular, width: "86%" }}>Language: {(listData?.recordsets?.[0][0].Language) ? listData?.recordsets?.[0][0].Language : "N/A"}</Text>
                                    </View>
                                    <View style={styles.infoDetails}>
                                        <FA5 name="chalkboard-teacher" size={20} color={COLORS.primary} style={{ width: "14%" }} />
                                        <TouchableOpacity onPress={() => navigation.navigate("ViewInstructorProfile", listData.recordsets?.[0][0].instructorInfo)} style={{ width: "86%" }}>
                                            <Text style={{ color: COLORS.black, fontSize: RFValue(12), ...FONTS.robotoregular }}>{listData.recordsets?.[0][0].instructorInfo.firstName} {listData.recordsets?.[0][0].instructorInfo.lastName}{'\n'}
                                                <Text style={{ color: COLORS.primary, fontSize: RFValue(8) }}>View instructor profile</Text>
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ width: "50%" }}>
                                    <Text style={styles.infoDetails}>
                                        {(listData?.recordsets?.[0][0].Rating == null) ?
                                            <View style={styles.infoDetails}>
                                                <FontAwesome name="star" size={20} color={COLORS.primary} style={{ width: "14%" }} />
                                                <Text style={{ color: COLORS.black, fontSize: RFValue(12), ...FONTS.robotoregular, width: "86%" }}>{"   "}Ratings: 0</Text>
                                            </View> :
                                            <View style={{ backgroundColor: "#e9ddf1" }}>
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
                                    <View style={styles.infoDetails}>
                                        <FontAwesome name="street-view" size={20} color={COLORS.primary} style={{ width: "14%" }} />
                                        <Text style={{ color: COLORS.black, fontSize: RFValue(12), ...FONTS.robotoregular, width: "86%" }}>Course views: {(listData?.recordsets?.[0][0].courseViews) ? listData?.recordsets?.[0][0].courseViews : "N/A"}</Text>
                                    </View>

                                    <TouchableOpacity>
                                        <Text style={{ color: COLORS.black, fontSize: RFValue(18), ...FONTS.robotomedium }}>Price: ${listData?.recordsets?.[0][0].EnrollmentFee}</Text>
                                        <Text style={{ color: COLORS.black, fontSize: RFValue(10), ...FONTS.robotomedium }}>Got a Discount code?</Text>
                                    </TouchableOpacity>


                                </View>
                            </View>
                        </View>
                        <View style={{ backgroundColor: COLORS.white, borderColor: "red", paddingHorizontal: metrices(1) }}>
                            {token &&
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
                                                <TouchableOpacity style={[styles.wishListbutton, { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]} onPress={() => addToWishlist(listData?.recordsets[0][0].ID)}>
                                                    <Text style={styles.wishListText}>Add To Wishlist</Text>
                                                </TouchableOpacity> :
                                                <TouchableOpacity style={[styles.wishListbutton, { backgroundColor: COLORS.black }]} onPress={() => removeFromWishlist(listData?.recordsets[0][0].ID)}>
                                                    <Text style={{ color: COLORS.white, fontSize: RFValue(12), ...FONTS.robotoregular }}>Remove from Wishlist</Text>
                                                </TouchableOpacity>
                                            :
                                            null}

                                        {/* (cartArray.length != 0) ? */
                                            (Data.data.recordsets[0][0].isPurchased === false) ?
                                                (cartArray.includes(listData?.recordsets[0][0].ID)) ?
                                                    <TouchableOpacity style={{ flexDirection: "column", width: (Data.data.recordsets[0][0].isPurchased) ? "96%" : "48%", alignItems: "center", justifyContent: "center", backgroundColor: COLORS.black, margin: "1%", borderWidth: 1, borderColor: COLORS.black, padding: "3%" }} onPress={() => handleNavigation("Go to Cart")}>
                                                        <Text style={styles.wishListText}>Go to Cart</Text>
                                                    </TouchableOpacity> :
                                                    <TouchableOpacity style={{ flexDirection: "column", width: (Data.data.recordsets[0][0].isPurchased) ? "96%" : "48%", alignItems: "center", justifyContent: "center", backgroundColor: COLORS.buttonOne, margin: "1%", borderWidth: 1, borderColor: COLORS.buttonOne, padding: "3%" }} onPress={() => handleAddCart(listData?.recordsets[0][0].ID)}>
                                                        <Text style={styles.wishListText}>Add To Cart</Text>
                                                    </TouchableOpacity> :
                                                <TouchableOpacity style={styles.isPurchased} onPress={() => handleNavigation("Purchased")}>
                                                    <Text style={styles.wishListText}>Purchased</Text>
                                                </TouchableOpacity>
                                        /* : null */}
                                    </View>
                                    <View style={styles.separator} />
                                </View>
                            }


                            {(listData?.recordsets[0][0]?.goals?.length != 0) ?
                                <View style={styles.componentshadow}>
                                    <View style={styles.courseStyles}>
                                        <View style={{ flexDirection: "row" }}>
                                            {/* <MCIcon name="target" size={RFValue(20)} color={"red"} /> */}
                                            <Text style={styles.titles}>COURSE HIGHLIGHTS</Text>
                                        </View>
                                    </View>
                                    {(listData?.recordsets[0][0].goals).map((item, index) => {
                                        return (
                                            <View style={styles.mapItems}>
                                                <Text key={index} style={{ fontSize: RFValue(13), color: COLORS.black, ...FONTS.robotoregular }}>{/* <AntIcon name="checkcircleo" size={12} color={COLORS.primary} /> */}{(item?.name).trim()}</Text>
                                            </View>)
                                    })}
                                    <View style={styles.separator} />
                                </View> : null
                            }

                            {(listData?.recordsets[0][0]?.preRequisites?.length != 0) ?
                                <View style={styles.componentshadow}>
                                    <View style={styles.courseStyles}>
                                        <View style={{ flexDirection: "row" }}>
                                            {/* <MCIcon name="notebook" size={RFValue(20)} color={"red"} /> */}
                                            <Text style={styles.titles}>COURSE REQUIREMENTS</Text>
                                        </View>
                                    </View>
                                    {(listData?.recordsets[0][0].preRequisites).map((item, index) => {
                                        return (
                                            <View style={styles.mapItems}>
                                                <Text key={index} style={{ fontSize: RFValue(13), color: COLORS.black, ...FONTS.robotoregular }}>{index + 1}. {item?.name}</Text>
                                            </View>)
                                    })}
                                    <View style={styles.separator} />
                                </View> :
                                null
                            }

                            {(listData?.recordsets[0][0]?.syllabus?.length != 0) ?
                                <View style={styles.componentshadow}>
                                    <View style={styles.courseStyles}>
                                        <View style={{ flexDirection: "row" }}>
                                            {/* <Fontisto name="angelist" size={RFValue(20)} color={"red"} /> */}
                                            <Text style={styles.titles}>COURSE SYLLABUS</Text>
                                        </View>
                                    </View>
                                    <View style={styles.mapItems}>
                                        {(listData?.recordsets[0][0].syllabus).map((item, index) => {
                                            return (
                                                <Text key={index} style={{ fontSize: RFValue(13), color: COLORS.black, ...FONTS.robotoregular }}>{/* <AntIcon name="checkcircleo" size={RFValue(12)} color={COLORS.primary} /> */}{(item?.name).trim()}</Text>
                                            )
                                        })}
                                    </View>
                                    <View style={styles.separator} />
                                </View> : null
                            }
                            
                            {(listData?.recordsets[0][0]?.Description.length != 0) ?
                                <View style={styles.componentshadow}>
                                    <View style={styles.courseStyles}>
                                        <View style={{ flexDirection: "row" }}>
                                            {/* <MCIcon name="notebook" size={RFValue(20)} color={"red"} /> */}
                                            <Text style={styles.titles}>COURSE DESCRIPTION</Text>
                                        </View>
                                    </View>
                                    <View style={styles.mapItems}>
                                        <WebView
                                            source={{ html: listData?.recordsets[0][0].Description }}
                                            contentWidth="100%"
                                            baseStyle={{ fontSize: 14, fontFamily: "Roboto-Regular", color: COLORS.black }}
                                            renderersProps={{ p: { style: { marginLeft: 0 } } }}
                                        />
                                        {/* <WebView style={{ width: "100%", paddingVertical: "5%" }}
                                            source={{
                                                html: `<div>${listData?.recordsets[0][0].Description && typeof listData?.recordsets[0][0].Description === 'string' ? listData?.recordsets[0][0].Description.replace(/(<br>|[\n\r]+)/g, ' ').trim() : ''
                                                    }</div>`
                                            }}
                                            scalesPageToFit={false}
                                        /> */}
                                    </View>
                                    <View style={styles.separator} />
                                </View> :
                                null
                            }

                            <View style={styles.componentshadow}>
                                <View style={styles.courseStyles}>
                                    <View style={{ flexDirection: "row" }}>
                                        {/* <OctIcon name="checklist" size={RFValue(20)} color={"red"} /> */}
                                        <Text style={styles.titles}>This Includes</Text>
                                    </View>
                                </View>
                                <View style={styles.mapItems}>
                                    <Text style={{ margin: "1%", fontSize: RFValue(13), color: COLORS.black, ...FONTS.robotoregular }}><AntIcon name="youtube" size={RFValue(13)} color={COLORS.primary} /> of video material</Text>
                                    <Text style={{ margin: "1%", fontSize: RFValue(13), color: COLORS.black, ...FONTS.robotoregular }}><FontAwesome name="language" size={RFValue(13)} color={COLORS.primary} /> Languanges: English</Text>
                                    <Text style={{ margin: "1%", fontSize: RFValue(13), color: COLORS.black, ...FONTS.robotoregular }}><AntIcon name="clouddownloado" size={RFValue(13)} color={COLORS.primary} /> Downloadable Resources</Text>
                                    <Text style={{ margin: "1%", fontSize: RFValue(13), color: COLORS.black, ...FONTS.robotoregular }}><AntIcon name="mobile1" size={RFValue(13)} color={COLORS.primary} /> Access from mobile and tablet</Text>
                                    <Text style={{ margin: "1%", fontSize: RFValue(13), color: COLORS.black, ...FONTS.robotoregular }}><MCIcon name="brain" size={RFValue(13)} color={COLORS.primary} /> Self paced learning!</Text>
                                </View>
                                <View style={styles.separator} />
                            </View>

                            {(listData?.recordsets[0][0]?.faqs?.length != 0) ?
                                <View style={styles.componentshadow}>
                                    <View style={styles.courseStyles}>
                                        <View style={{ flexDirection: 'row' }}>
                                            {/* <AntIcon name="key" size={RFValue(16)} color={"red"} /> */}
                                            <Text style={styles.titles}>COURSE FAQS</Text>
                                        </View>
                                    </View>
                                    {(listData?.recordsets[0][0].faqs).map((item, index) => {
                                        return (
                                            <View style={styles.mapItems}>
                                                <Text key={index} style={{ margin: "1%", fontSize: RFValue(14), color: COLORS.black, ...FONTS.robotoregular, }}>{index + 1}. {item?.question}</Text>
                                                <Text key={index} style={{ marginLeft: "4%", fontSize: RFValue(14), color: COLORS.black, ...FONTS.robotoregular, }}>{item?.answer} </Text>
                                            </View>)
                                    })}
                                    <View style={styles.separator} />
                                </View> :
                                null
                            }

                            {(listData?.recordsets[0][0]?.relatedCourses.length != 0) ?
                                <View style={styles.componentshadow}>
                                    <View style={styles.courseStyles}>
                                        <View style={{ flexDirection: "row" }}>
                                            {/* <MCIcon name="book" size={RFValue(20)} color={"red"} /> */}
                                            <Text style={styles.titles}>Related Course's</Text>
                                        </View>
                                    </View>

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
                                                            style={styles.flatlistImages}
                                                        /> : <Image
                                                            source={{ uri: "https://cdn.edusity.com/" + "courses/2528/de3d968f-0f08-4383-8fe1-3278e996ae15.png" }}
                                                            resizeMode="contain"
                                                            style={styles.flatlistImages}
                                                        />}
                                                    <Text style={{ marginLeft: "2%", fontSize: RFValue(14), color: COLORS.primary, ...FONTS.robotomedium }}>{item.CourseName}</Text>
                                                    <Text style={{ margin: "2%", fontSize: RFValue(14), color: COLORS.black, ...FONTS.robotoregular }}>
                                                        {item.Category} <Text style={{ fontSize: RFValue(14), color: COLORS.black, ...FONTS.robotoregular }}>({item.SubCategory})</Text>
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            keyExtractor={(item, index) => index}
                                        />
                                    </View>
                                    <View style={styles.separator} />
                                </View>
                                : null
                            }
                        </View>
                        {/* <View style={{ padding: metrices(2) }} /> */}
                    </ScrollView >
                </View>
            }
        </>
    );
}
const styles = StyleSheet.create({
    mainContainer: {
        height: metrices(93.5),
        width: "100%"
    },
    componentshadow: {
        backgroundColor: COLORS.white,
        width: "100%"
    },
    componentFlatlist: {
        backgroundColor: COLORS.lightGray,
        height: "100%",
        width: metrices(38),
        marginRight: metrices(1.5),
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 5
    },
    courseStyles: {
        width: "100%"
    },
    flatlistImages: {
        width: "96%",
        height: metrices(24),
        margin: "2%",
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        padding: "5%"
    },
    mapItems: {
        width: "90%",
        left: "4%"
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
    infoDetails: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: metrices(0.8)
    },
    listItem: {
        flex: 1,
        right: "1.5%",
        margin: 10,
        padding: 5,
        backgroundColor: COLORS.white,
        width: '97%',
        height: "100%",
        lineHeight: "1.5"
    },
    wishListbutton: {
        flexDirection: "column",
        width: "48%",
        alignItems: "center",
        justifyContent: "center",
        margin: "1%",
        borderWidth: 1,
        padding: "3%"
    },
    wishListText: {
        color: COLORS.white,
        fontSize: RFValue(12),
        ...FONTS.robotoregular
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
        fontSize: 10,
        color: COLORS.black,
        backgroundColor: "#e9ddf1"
    },
    isPurchased: {
        backgroundColor: COLORS.black,
        flexDirection: "column",
        width: "98%",
        alignItems: "center",
        justifyContent: "center",
        margin: "1%",
        borderWidth: 1,
        padding: "3%"
    },
    colorContainer: {
        backgroundColor: "#e9ddf1",
        paddingBottom: metrices(2),
        width: "100%",
        alignItems: "center"
    },
    coulmnImage: {
        width: "94%",
        height: metrices(24),
        alignItems: "center",
        justifyContent: "space-around",
        marginVertical: metrices(2)
    },
    separator: {
        borderBotomWidth: 2,
        borderBottomWidth: 2,
        marginVertical: metrices(1),
        borderColor: COLORS.lightGray
    },
    titles: {
        fontSize: RFValue(15),
        color: COLORS.primary,
        ...FONTS.robotomedium,
        textDecorationLine: "underline"
    }
});
export default ViewCourse;