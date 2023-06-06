import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text, Image,
    TouchableOpacity,
    FlatList, StyleSheet, ImageBackground, ToastAndroid, RefreshControl
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import axios from 'axios';
import { images, icons, COLORS, FONTS, SIZES } from '../../../constants';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Rating, AirbnbRating } from 'react-native-ratings';
import LoaderKit from 'react-native-loader-kit'
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { viewCourseHandler } from '../../../store/redux/viewCourse';
import { cartHandler } from '../../../store/redux/cart';
import { PopUpFilterModal } from './filterModal';
import { Divider } from '@rneui/base';
import { FloatingAction } from "react-native-floating-action";
import { addtoCart } from '../../../services/cartService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wishListApi, wishListRemoverApi } from '../../../services/wishlist';
import NetInfo from "@react-native-community/netinfo";
import { useIsFocused } from "@react-navigation/core";
import { baseUrl, baseUrl_payment } from '../../../services/constant';
import { getWishListedCourses } from '../../../services/wishlist';
import { getWishListDataHandler } from '../../../store/redux/getWishListData';
import OverlayLoader from '../../../components/overlayLoader';
import { metrices } from '../../../constants/metrices';

const CourseList = ({ allCourses, cartData }) => {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const childRef = useRef(null);
    const isFocused = useIsFocused();
    const ScrollRef = useRef(null);
    const redxitems = useSelector(state => state?.courseList?.data?.data);
    const getWishListData = useSelector(state => state?.getWishList?.data?.data)
    const totalPage = redxitems?.total_page;
    const totalCourses = redxitems?.total;
    const [flalistRefresh, setFlatListRefresh] = useState(false);
    const [cartArray, setCartArray] = useState([]);
    const [showHeart, setShowHeart] = useState([]);
    const [Data, setData] = useState([]);
    const [key, setKey] = useState("")
    const [loader, SetLoader] = useState(false);
    const [network, setNetwork] = useState('')
    const [refreshList, setRefreshList] = useState(false);
    const [totalFilterPage, setTotalFilterPage] = useState(0);
    const [filterPageNo, setFilterPageNo] = useState(0);
    const [filteredCount, setFilterdCourse] = useState(null);
    const [page, setPage] = useState(1);
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [submission, setSubmission] = useState(false);
    const [cartBtnLoader, setCartBtnLoader] = useState(false);
    const [contentVerticalOffset, setContentVerticalOffset] = useState(null);

    useEffect(() => {
        if (isFocused) {
            NetInfo.addEventListener(networkState => {
                // console.log("Is connected? - ", networkState.isConnected);
                // if ((networkState.isConnected) === "true") {
                setNetwork(networkState.isConnected);
                // }
            });
        }
    }, [isFocused, network])

    const handleWishlist = async (itemId) => {
        setCartBtnLoader(true)
        if (network) {
            if (!showHeart.includes(itemId)) {
                let wishlistedData = await wishListApi(itemId, key).then((response) => {
                    dispatch(getWishListDataHandler(key))
                }).catch((error) => {
                    setCartBtnLoader(false)
                    ToastAndroid.showWithGravity("Can't able add in WishList, please try again later", ToastAndroid.SHORT, ToastAndroid.CENTER)
                    console.error("Error................addwishList", error);
                })
            } else {
                let wishlistedData = await wishListRemoverApi(itemId, key).then((response) => {
                    dispatch(getWishListDataHandler(key))
                }).catch((error) => {
                    setCartBtnLoader(false)
                    ToastAndroid.showWithGravity("Can't able remove in WishList, please try again later", ToastAndroid.SHORT, ToastAndroid.CENTER)
                    console.error("Error................removewishList", error);
                })
            }
            setFlatListRefresh(!flalistRefresh);
        }
        else {
            setCartBtnLoader(false)
            navigation.navigate("NetworkError");
        }
    }

    const handleAddCart = async (id) => {
        // console.log("Id...........", id)
        setCartBtnLoader(true);
        if (network) {
            if (key) {
                let result = await addtoCart(id, key).then(response => {
                    // console.log("Response for add to cart...........", response)
                    if (response.error) { ToastAndroid.showWithGravity(response.message, ToastAndroid.TOP, ToastAndroid.LONG) }
                    dispatch(cartHandler(key))
                }).catch((error) => {
                    setCartBtnLoader(false)
                    ToastAndroid.showWithGravity("Can't able add in Cart, please try again later", ToastAndroid.SHORT, ToastAndroid.CENTER);
                    console.error("Error................handleAddCart", error);
                })
            }
            else {
                navigation.navigate("Login");
                setCartBtnLoader(false);
            }
        }
        else {
            navigation.navigate("NetworkError");
            setCartBtnLoader(false);
        }
    }

    const refresh = () => {
        if (!selectedLevel && !selectedCategory) {
            if (page < totalPage) {
                setPage(page + 1);
                setRefreshList(true);
            }
        } else {
            if (filterPageNo < totalFilterPage) {
                setFilterPageNo(filterPageNo + 1);
                setRefreshList(true);
            }
        }
    }

    useEffect(() => {
        if (cartData) {
            var ListCartId = [];
            (cartData?.Courses).forEach((element) => {
                var Data = (element.CourseId);
                ListCartId.push(Data);
            })
            setCartArray(ListCartId);
            setCartBtnLoader(false)
        }
    }, [cartData])

    useEffect(() => {
        if (getWishListData) {
            setShowHeart(getWishListData?.map(a => a.ID))
            setCartBtnLoader(false)
        }
    }, [getWishListData])

    useEffect(() => {
        if (page > 1 && page <= totalPage && !selectedLevel && !selectedCategory) {
            const addData = async () => {
                // console.log(key, "...........................token")
                // var Url = "https://livelogin.edusity.com/course?page=" + page;
                var Url = `${baseUrl_payment}v1/course?page=${page}`;
                console.log("Url...........", Url)
                const headers = { 'Content-Type': 'application/json', 'Authorization': "Bearer " + key }
                const callData = await axios.post(Url).then(response => {
                    const newdata = response.data.data.courses
                    setData(Data.concat(newdata));
                    // setShowHeart(getWishListData?.map(a => a.ID))
                    setRefreshList(false);
                    return response.data
                })
                    .catch((err) => {
                        navigation.navigate("ServerError");
                        setRefreshList(false);
                    })
            }
            addData();
        } else if (filterPageNo > 1 && filterPageNo <= totalFilterPage && (selectedLevel || selectedCategory)) {
            const addData = async () => {
                // console.log(filterPageNo, "filterpageno")
                if (!selectedCategory) {
                    // console.log(selectedLevel, "level Only")
                    var Url = `${baseUrl}course?level=${selectedLevel}&page=${filterPageNo}`;
                } else if (!selectedLevel) {
                    //  console.log(selectedCategory, "category Only")
                    if (selectedCategory.url == "AllCourses") {
                        var Url = `${baseUrl}course?page=${filterPageNo}`;
                    } else {
                        var Url = `${baseUrl}course?category=${selectedCategory.url}&page=${filterPageNo}`;
                    }
                } else {
                    // console.log(selectedCategory, selectedLevel, "Both")
                    var Url = `${baseUrl}course?category=${selectedCategory.url}&level=${selectedLevel}&page=${filterPageNo}`;
                    if (selectedCategory.url == "AllCourses") {
                        var Url = `${baseUrl}course?level=${selectedLevel}&page=${filterPageNo}`;
                    }
                }
                const headers = { 'Content-Type': 'application/json', 'Authorization': "Bearer " + key }
                const callData = await axios.get(Url, { headers: headers }).then(response => {
                    const newdata = response.data.data.data
                    //  console.log(response.data.data.data, "newdata")
                    console.log("3 setdatasde");
                    setData(Data.concat(newdata));
                    setRefreshList(false);
                    return response.data
                }).catch((err) => {
                    navigation.navigate("ServerError");
                    setRefreshList(false);
                })
            }
            addData();
        }

    }, [page, filterPageNo])

    useEffect(() => {
        //console.log(selectedCategory, "mother", selectedLevel, submission)
        SetLoader(true);
        if (selectedLevel || selectedCategory) {
            const addData = async () => {
                if (!selectedCategory) {
                    // console.log(selectedLevel, "level Only")
                    var Url = `${baseUrl}course?level=${selectedLevel}&page=1`;
                } else if (!selectedLevel) {
                    //  console.log(selectedCategory, "category Only")
                    if (selectedCategory.url == "AllCourses") {
                        var Url = `${baseUrl}course?page=1`;
                    } else {
                        var Url = `${baseUrl}course?category=${selectedCategory.url}&page=1`;
                    }
                    //    console.log(Url,"data")
                } else {
                    //console.log(selectedCategory.url, selectedLevel, "BothR")
                    var Url = `${baseUrl}course?category=${selectedCategory.url}&level=${selectedLevel}&page=1`;
                    if (selectedCategory.url == 'null') {
                        //  console.log("Url Changed for its is null",selectedCategory.url)
                        var Url = `${baseUrl}course?level=${selectedLevel}&page=1`;
                    }
                }
                const headers = { 'Content-Type': 'application/json', 'Authorization': "Bearer " + key }
                const callData = await axios.get(Url, { headers: headers }).then(response => {
                    const newdata = response.data.data.data
                    //  console.log(response.data.data.data, "newdata")
                    setFilterdCourse(response.data.data.total)
                    setTotalFilterPage(response.data.data.total_page);
                    console.log("4 setdatasde");
                    setData(newdata);
                    // setShowHeart(getWishListData?.map(a => a.ID))
                    setFilterPageNo(1);
                    SetLoader(false);
                    setRefreshList(false)
                    if (contentVerticalOffset > 200) { ScrollRef.current.scrollToOffset({ offset: 0, animated: true }) };
                    return response.data
                })
                    .catch((err) => {
                        navigation.navigate("ServerError");
                    })

                setRefreshList(false);
            }
            addData();
        } else {
            console.log("5 setdatasde");
            setData(allCourses.courses);
            setRefreshList(false);
            if (contentVerticalOffset > 200) { ScrollRef.current.scrollToOffset({ offset: 0, animated: true }) };
            setPage(1);
            SetLoader(false);
        }
    }, [submission])

    const initial = async () => {
        setRefreshList(true);
        SetLoader(true)
        let newToken = await AsyncStorage.getItem("loginToken")
        if (newToken) {
            setKey(newToken);
            console.log("6 setdatasde");
            setData(allCourses.courses)
            // let wishListedCourses = await getWishListedCourses(newToken).then(response => {
            //     console.log("Response for wishListed data.........", response.data);
            //     return response.data
            // }).catch((error) => {
            //     console.log("error.........", error);
            // })
            // console.log("wishListedCourses............after login...", wishListedCourses)
            // setShowHeart(getWishListData?.map(a => a.ID))
            setRefreshList(false);
            SetLoader(false)
        } else {
            // console.log("helooo not working ",allCourses.data)
            setKey(null);
            console.log("7 setdatasde");
            setData(allCourses.courses);
            setRefreshList(false);
            SetLoader(false)
        }
        setFlatListRefresh(!flalistRefresh)
    }

    useEffect(() => {
        initial()
    }, [allCourses])

    const handleViewCart = () => {
        if (key) {
            navigation.navigate("Cart");
        }
        else {
            navigation.navigate("Login");
        }
    }

    const actions = [
        {
            text: "Price Low-High",
            textStyle: { fontSize: 16, ...FONTS.robotomedium, justifyContent: "center" },
            textBackground: COLORS.white,
            textColor: COLORS.black,
            icon: <MCIcon name="sort-descending" size={RFValue(16)} color={COLORS.white} />,
            name: "Sort-Low-High",
            position: 2,
        },
        {
            text: "Price High-Low",
            textStyle: { fontSize: 16, ...FONTS.robotomedium, justifyContent: "center" },
            icon: <MCIcon name="sort-ascending" size={RFValue(16)} color={COLORS.white} />,
            name: "Sort-High-Low",
            position: 1,
            textBackground: COLORS.white,
            textColor: COLORS.black,
        },
        {
            text: "Advanced Filter",
            textStyle: { fontSize: 16, ...FONTS.robotomedium, justifyContent: "center" },
            icon: <MCIcon name="image-filter-vintage" size={RFValue(16)} color={COLORS.white} />,
            name: "Advanced-Filter",
            position: 3,
            textBackground: COLORS.white,
            textColor: COLORS.black,
        },
    ]

    const handleViewNavigation = (item) => {
        if (network) {
            SetLoader(true);
            dispatch(viewCourseHandler(item.ID)).then(unwrapResult)
                .then((originalPromiseResult) => {
                    navigation.navigate("ViewCourse");
                    // SetLoader(false);
                })
                .catch((rejectedValueOrSerializedError) => {
                    navigation.navigate("ServerError");
                    SetLoader(false);
                })
        }
        else {
            navigation.navigate("NetworkError");
        }
    }

    const popUpFilter = () => {
        childRef.current.childFunction1();
        childRef.current.childFunction2();
    };

    const handleFiltertype = (name) => {
        var resultData = "";
        if (name == "Advanced-Filter") {
            popUpFilter();
        } else if (name == "Sort-High-Low") {
            resultData = Data.slice().sort((a, b) => b.EnrollmentFee - a.EnrollmentFee)
            setData(resultData);
            if (contentVerticalOffset > 200) {
                ScrollRef.current.scrollToOffset({ offset: 0, animated: true })
            };
        } else if (name == "Sort-Low-High") {
            resultData = Data.slice().sort((a, b) => a.EnrollmentFee - b.EnrollmentFee)
            setData(resultData);
            if (contentVerticalOffset > 200) { ScrollRef.current.scrollToOffset({ offset: 0, animated: true }) };
        }
        setFlatListRefresh(!flalistRefresh);
    }

    return (
        (loader) ?
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
            <View style={styles.mainContainer}>
                {cartBtnLoader ? <OverlayLoader /> : null}
                {(Data?.length != 0) ? <Text style={{ color: COLORS.black, fontSize: RFValue(12, 580), ...FONTS.robotoregular, margin: "1%" }}>All Courses({(selectedLevel || selectedCategory) ? filteredCount : totalCourses})</Text> : null}
                {(Data?.length !== 0) ?
                    <>
                        <FlatList
                            data={Data}
                            ref={ScrollRef}
                            onScroll={event => {
                                setContentVerticalOffset(event.nativeEvent.contentOffset.y);
                            }}
                            scrollEnabled={true}
                            keyExtractor={item => item.ID}
                            extraData={flalistRefresh}
                            renderItem={({ item, index }) => (
                                <View style={styles.mainStyle}>
                                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
                                        <TouchableOpacity style={{ backgroundColor: COLORS.white, width: "45%", flexDirection: "column", justifyContent: "center" }} onPress={() => handleViewNavigation(item)}>
                                            <View style={styles.coulmnImage}>
                                                {(item?.imageFiles?.fileName) ?
                                                    <Image
                                                        source={{ uri: "https://cdn.edusity.com/" + item?.imageFiles?.fileName }}
                                                        resizeMode="stretch"
                                                        style={{
                                                            width: "100%",
                                                            height: 130,
                                                            borderRadius: 8
                                                        }}
                                                    /> : <Image
                                                        source={{ uri: "https://cdn.edusity.com/" + "courses/2382/85883a4c-c61f-456f-953f-01b94482088d.png" }}
                                                        resizeMode="stretch"

                                                        style={{
                                                            width: "88%",
                                                            height: 100,
                                                            borderRadius: 8
                                                        }}
                                                    />}
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{ width: "55%", paddingLeft: metrices(1) }}>
                                            <View style={{ width: "100%" }}>
                                                <Text style={{ fontSize: RFValue(16), color: COLORS.black, ...FONTS.robotomedium }}>{(item.CourseName) ? item.CourseName : "N/A"}{"\n"}
                                                    <Text style={{ fontSize: RFValue(10), color: COLORS.black, ...FONTS.robotoregular }}>{(item.Category) ? item.Category : "N/A"}</Text></Text>
                                            </View>
                                            <View style={{ width: "100%", flexDirection: "row" }}>
                                                <View style={{ width: "80%", flexDirection: "row", alignItems: "center" }}>
                                                    <Image
                                                        source={icons.LevelIcon}
                                                        resizeMode="contain"
                                                        style={{ width: RFValue(15), height: RFValue(15), }}
                                                    />
                                                    <Text style={{ fontSize: RFValue(13), color: COLORS.black, ...FONTS.robotoregular }} > {(item.Level) ? item.Level : "N/A"}</Text>
                                                </View>
                                                {key ? <TouchableOpacity onPress={() => handleWishlist(item.ID)} style={{ width: "20%", flexDirection: "column", alignItems: "center", justifyContent: "space-around" }}>
                                                    {!(showHeart?.includes(item.ID)) ? <MCIcon name="cards-heart-outline" size={RFValue(20)} color={"red"} /> :
                                                        <MCIcon name="cards-heart" size={RFValue(20)} color={"red"} />}
                                                </TouchableOpacity> : null}
                                            </View>

                                            <View style={{ flexDirection: "row", width: "100%", alignItems: "center" }}>
                                                <View style={{ width: "10%" }}>
                                                    <Image
                                                        source={icons.Tutor}
                                                        resizeMode="contain"
                                                        style={{ width: RFValue(15), height: RFValue(15), }}
                                                    />
                                                </View>
                                                <Text style={[styles.Brand, { width: "90%" }]}>{(item.instructorName) ? item.instructorName : "N/A"}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.location}>Price: ${(item.EnrollmentFee) ? item.EnrollmentFee : "N/A"}</Text>
                                            </View>
                                            <Text style={styles.ratings}>
                                                <View>
                                                    <Rating
                                                        type='star'
                                                        ratingCount={(item.StarRating) ? item.StarRating : 5}
                                                        imageSize={RFValue(14)}
                                                        showRating={false}
                                                        isDisabled={true}
                                                        ratingColor='#8830c4'
                                                    />
                                                </View>
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ borderBottomColor: COLORS.lightGray, borderBottomWidth: 1, width: "100%", marginVertical: metrices(1) }} />
                                    {(!item.isPurchased) ?
                                        <View style={styles.buttonRow}>
                                            <View style={styles.buttonColumn}>
                                                {!(cartArray.includes(item.ID)) ?
                                                    <>
                                                        {(cartBtnLoader != item.ID) ?
                                                            <TouchableOpacity style={styles.addCartButton} onPress={() => handleAddCart(item.ID)} >
                                                                <MCIcon name="cart-plus" size={RFValue(20)} color={"white"} style={styles.iconAddCart} />
                                                                <Text style={styles.addCartText}>Add to Cart</Text>
                                                            </TouchableOpacity> :
                                                            <View style={{ backgroundColor: COLORS.primary, width: "80%", justifyContent: "center", padding: "4%", alignItems: "center", borderRadius: 10 }} >
                                                                <LoaderKit
                                                                    style={{ width: RFValue(20), height: RFValue(20) }}
                                                                    name={'BallPulse'}
                                                                    size={50}
                                                                    color={COLORS.white}
                                                                />
                                                            </View>}
                                                    </>
                                                    :
                                                    <TouchableOpacity style={styles.addCartButton} onPress={() => handleViewCart()} >
                                                        <MCIcon name="cart" size={RFValue(20)} color={"white"} style={styles.iconAddCart} />
                                                        <Text style={styles.addCartText}>View Cart</Text>
                                                    </TouchableOpacity>
                                                }
                                            </View>
                                            <View style={styles.buttonColumn}>
                                                <TouchableOpacity style={styles.addCartButton} onPress={() => handleViewNavigation(item)} >
                                                    <MCIcon name="information" size={RFValue(20)} color={COLORS.white} style={styles.iconAddCart} />
                                                    <Text style={styles.addCartText}>For more info</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View> :
                                        <View style={{ backgroundColor: COLORS.white, width: "90%", flexDirection: "row", padding: "4%", alignItems: "center", borderRadius: 10 }} onPress={() => handleViewCart()} >
                                            <MCIcon name="check-decagram-outline" size={RFValue(20)} color={COLORS.primary} style={{ marginHorizontal: "5%", flexDirection: "column" }} />
                                            <Text style={{ color: COLORS.primary, ...FONTS.robotoregular, marginLeft: "6%" }}>Already Purchased</Text>
                                        </View>}

                                </View>
                            )
                            }
                            onEndReachedThreshold={0.2}
                            onEndReached={refresh}
                        /></> : <View style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>
                        <Image source={images.NoData} resizeMode="contain" style={{ height: "30%", width: "40%" }} />
                        <Text style={{ color: COLORS.black, fontSize: RFValue(16), ...FONTS.robotoregular }}>No Courses Found!</Text>
                    </View>}

                <FloatingAction
                    actions={actions}
                    floatingIcon={<MCIcon name="filter-plus" size={RFValue(16)} color={"white"} />}
                    showBackground={true}
                    animated={true}
                    color={COLORS.primary}
                    overlayColor='rgba(70, 70, 70, 0.9)'
                    onPressItem={name => { handleFiltertype(name) }}
                />

                <View style={{ width: "100%", alignItems: "center" }}>
                    {(!refreshList) ? (Data?.length != 0) ? <Text style={{ color: COLORS.gray, fontSize: RFValue(10, 580), ...FONTS.robotoregular, }}>-------Total of {(selectedLevel || selectedCategory) ? filteredCount : totalCourses} Courses-------</Text> : null
                        : <LoaderKit
                            style={{ width: 50, height: 25, marginLeft: "6%" }}
                            name={'BallPulse'}
                            size={10}
                            color={COLORS.primary}
                        />}
                </View>

                <PopUpFilterModal
                    ref={childRef}
                    selectedLevel={selectedLevel}
                    setSelectedLevel={setSelectedLevel}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    submission={submission}
                    setSubmission={setSubmission}
                />
            </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        height: metrices(83.6),
        width: "100%"
    },
    mainStyle: {
        backgroundColor: COLORS.white,
        marginHorizontal: metrices(1),
        borderRadius: 6,
        marginBottom: 10,
        padding: metrices(1)
    },
    buttonRow: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    buttonColumn: {
        width: "45%"
    },
    addCartButton: {
        backgroundColor: COLORS.buttonOne,
        width: "100%",
        flexDirection: "row",
        height: metrices(4),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5
    },
    addCartText: {
        color: "white",
        ...FONTS.robotoregular,
        fontSize: 18,
        width: "76%"
    },
    iconAddCart: {
        marginLeft: "5%",
        width: "16%"
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
    Brand: {
        fontSize: RFValue(12, 580), ...FONTS.robotoregular, color: COLORS.gray
    },
    location: {
        fontSize: RFValue(16, 580), ...FONTS.robotoregular, color: COLORS.primary
    },
    ratings: {
        fontSize: 10, color: COLORS.black,
    },
    coulmnImage: {
        width: "100%"
    }
});

export default CourseList;