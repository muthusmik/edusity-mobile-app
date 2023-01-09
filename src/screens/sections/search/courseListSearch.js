import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text, Image,
    TouchableOpacity,
    FlatList, StyleSheet, ImageBackground, ActivityIndicator, Pressable, ToastAndroid, RefreshControl
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import axios from 'axios';
import { images, icons, COLORS, FONTS, SIZES } from '../../../constants';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
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

const CourseList = ({ allCourses, cartData }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const childRef = useRef(null);
    const ScrollRef = useRef(null);
    const redxitems = useSelector(state => state.courseList.data.data);

    const [cartArray, setCartArray] = useState([]);

    const totalPage = redxitems.total_page;
    const totalCourses = redxitems.total;
    // console.log("iam inside search redxitemss", allCourses.data[0].isWishlisted);
    const [flalistRefresh, setFlatListRefresh] = useState(false);
    const [showHeart, setShowHeart] = useState([]);
    const [Data, setData] = useState("ttt");
    const [loader, SetLoader] = useState(false);
    const [cartLoad, setCartLoad] = useState(true);
    const [currentId, setCurrentId] = useState("");
    const [network, setNetwork] = useState('')
    const [refreshList, setRefreshList] = useState(false);
    const [totalFilterPage, setTotalFilterPage] = useState(0);
    const [filterPageNo, setFilterPageNo] = useState(0);
    const [filteredCount, setFilterdCourse] = useState(null);
    const isFocused = useIsFocused();
    const [page, setPage] = useState(1);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [submission, setSubmission] = useState(false);
    const [cartBtnLoader, setCartBtnLoader] = useState("");
    const [contentVerticalOffset, setContentVerticalOffset] = useState(null);
    // const token = useSelector((state) => state.loginHandle.data)

    useEffect(() => {
        if (isFocused) {
            NetInfo.addEventListener(networkState => {
                console.log("Is connected? - ", networkState.isConnected);
                // if ((networkState.isConnected) === "true") {
                setNetwork(networkState.isConnected);
                // }
            });
        }
    }, [isFocused])
    const handleWishlist = async (index) => {
        if (network) {
            if (showHeart[index] == 0) {
                showHeart[index] = 1;
                setShowHeart(showHeart)
                let wishlistedData = await wishListApi(Data[index].ID, key).then(data => { console.log("wishlisted", data) })
            } else {
                showHeart[index] = 0;
                setShowHeart(showHeart)
                let wishlistedData = await wishListRemoverApi(Data[index].ID, key).then(data => { console.log("wishlisted", data) })
            }
            setFlatListRefresh(!flalistRefresh);
        }
        else {
            navigation.navigate("NetworkError");
        }
    }
    const handleAddCart = async (id) => {
       
        // console.log("new token", key);
   if (network) {
        if (key) {
            // let arry=cartBtnLoader.push(id)
            setCartBtnLoader(cartBtnLoader.push(id));
            let result = await addtoCart(id, key).then(response=>{
                
                setCartBtnLoader([])
            });
            // console.log(result, "hello");
            dispatch(cartHandler(key));
        }
        else {
            navigation.navigate("Login");
}
        }
        else {
            navigation.navigate("NetworkError");
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
                // console.log(ListCartId, "Array")
            })
            setCartArray(ListCartId);
        }
    }, [cartData])

    useEffect(() => {
        if (page > 1 && page <= totalPage && !selectedLevel && !selectedCategory) {
            const addData = async () => {

                // console.log(key, "...........................token")
                var Url = "https://backend-linux-login.azurewebsites.net/course?page=" + page;
                const headers = { 'Content-Type': 'application/json', 'Authorization': "Bearer " + key }
                const callData = await axios.get(Url, { headers: headers }).then(response => {
                    const newdata = response.data.data.data
                    setData(Data.concat(newdata));
                    setShowHeart(Data.concat(newdata).map(a => a.isWishlisted))
                    setRefreshList(false);
                    return response.data
                })
                    .catch((err) => {
                        // console.log(err);
                        setRefreshList(false);
                    })
            }
            addData();
        } else if (filterPageNo > 1 && filterPageNo <= totalFilterPage && (selectedLevel || selectedCategory)) {
            const addData = async () => {

                // console.log(filterPageNo, "filterpageno")
                if (!selectedCategory) {
                    // console.log(selectedLevel, "level Only")
                    var Url = `https://backend-linux-login.azurewebsites.net/course?level=${selectedLevel}&page=${filterPageNo}`;
                } else if (!selectedLevel) {
                    //  console.log(selectedCategory, "category Only")
                    if (selectedCategory.url == "AllCourses") {
                        var Url = `https://backend-linux-login.azurewebsites.net/course?page=${filterPageNo}`;
                    } else {
                        var Url = `https://backend-linux-login.azurewebsites.net/course?category=${selectedCategory.url}&page=${filterPageNo}`;
                    }
                } else {
                    // console.log(selectedCategory, selectedLevel, "Both")
                    var Url = `https://backend-linux-login.azurewebsites.net/course?category=${selectedCategory.url}&level=${selectedLevel}&page=${filterPageNo}`;
                    if (selectedCategory.url == "AllCourses") {
                        var Url = `https://backend-linux-login.azurewebsites.net/course?level=${selectedLevel}&page=${filterPageNo}`;
                    }
                }
                const headers = { 'Content-Type': 'application/json', 'Authorization': "Bearer " + key }
                const callData = await axios.get(Url, { headers: headers }).then(response => {
                    const newdata = response.data.data.data
                    //  console.log(response.data.data.data, "newdata")
                    setData(Data.concat(newdata));
                    setShowHeart(Data.concat(newdata).map(a => a.isWishlisted))
                    setRefreshList(false);
                    return response.data
                })
                    .catch((err) => {
                        // console.log(err);
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
                    var Url = `https://backend-linux-login.azurewebsites.net/course?level=${selectedLevel}&page=1`;
                } else if (!selectedLevel) {
                    //  console.log(selectedCategory, "category Only")
                    if (selectedCategory.url == "AllCourses") {
                        var Url = `https://backend-linux-login.azurewebsites.net/course?page=1`;
                    } else {
                        var Url = `https://backend-linux-login.azurewebsites.net/course?category=${selectedCategory.url}&page=1`;
                    }
                    //    console.log(Url,"data")
                } else {
                    //console.log(selectedCategory.url, selectedLevel, "BothR")
                    var Url = `https://backend-linux-login.azurewebsites.net/course?category=${selectedCategory.url}&level=${selectedLevel}&page=1`;
                    if (selectedCategory.url == 'null') {
                        //  console.log("Url Changed for its is null",selectedCategory.url)
                        var Url = `https://backend-linux-login.azurewebsites.net/course?level=${selectedLevel}&page=1`;
                    }
                }
                const headers = { 'Content-Type': 'application/json', 'Authorization': "Bearer " + key }
                const callData = await axios.get(Url, { headers: headers }).then(response => {
                    const newdata = response.data.data.data
                    //  console.log(response.data.data.data, "newdata")
                    setFilterdCourse(response.data.data.total)
                    setTotalFilterPage(response.data.data.total_page);
                    setData(newdata);
                    setShowHeart(newdata.map(a => a.isWishlisted))
                    setFilterPageNo(1);
                    SetLoader(false); 
                    setRefreshList(false)
                    if (contentVerticalOffset > 200) { ScrollRef.current.scrollToOffset({ offset: 0, animated: true }) };
                    return response.data
                })
                    .catch((err) => {
                        console.log(err);
                    })

                setRefreshList(false);
            }
            addData();
        } else {
            setData(allCourses.data);
            setShowHeart(allCourses.data.map(a => a.isWishlisted))
            setRefreshList(false);
            if (contentVerticalOffset > 200) { ScrollRef.current.scrollToOffset({ offset: 0, animated: true }) };
            setPage(1);
            SetLoader(false);

        }
    }, [submission])
    // useEffect(()=>{
    //     console.log("changed",Data)
    // },[Data])

    const [key, setKey] = useState("")
    useEffect(() => {

        const initial = async () => {
            setRefreshList(true);
            SetLoader(true)
            let newToken = await AsyncStorage.getItem("loginToken")
            // console.log("ffff",allCourses,newToken,"gggg");
            if (newToken) { 
            setKey(newToken); 
            setData(allCourses.data)
            setShowHeart(allCourses.data.map(a => a.isWishlisted))
            // console.log("there........................",Data)
            setRefreshList(false);
            SetLoader(false)
            // console.log("there........................",allCourses.data.map(a => a.isWishlisted))
            // console.log("there........................",Data)
            }else{
                // console.log("helooo not working ",allCourses.data)
                setKey(null); 
                setData(allCourses.data);
                setRefreshList(false);
                SetLoader(false)
            }
      setFlatListRefresh(!flalistRefresh)
    //   console.log("there........................",Data)

        }
        initial()

    }, [allCourses])

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
        SetLoader(true);
        dispatch(viewCourseHandler(item.ID)).then(unwrapResult)
            .then((originalPromiseResult) => {
                // console.log("successfully returned to login with response CourseList ", originalPromiseResult);
                SetLoader(false);
                navigation.navigate("ViewCourse");

            })
            .catch((rejectedValueOrSerializedError) => {
                // console.log(" Inside catch", rejectedValueOrSerializedError);
                SetLoader(false);
            })

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
            setShowHeart(resultData.map(a => a.isWishlisted))
            if (contentVerticalOffset > 200) {
                ScrollRef.current.scrollToOffset({ offset: 0, animated: true })
            };
        } else if (name == "Sort-Low-High") {
            resultData = Data.slice().sort((a, b) => a.EnrollmentFee - b.EnrollmentFee)
            setData(resultData);
            setShowHeart(resultData.map(a => a.isWishlisted))
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
                        name={'BallPulse'} // Optional: see list of animations below
                        size={50} // Required on iOS
                        color={COLORS.primary} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
                    />
                </ImageBackground>
            </View> :
            <View style={styles.mainContainer}>
                {(Data?.length != 0) ? <Text style={{ color: COLORS.black, fontSize: RFValue(12, 580), ...FONTS.robotoregular, margin: "1%" }}>All Courses({(selectedLevel || selectedCategory) ? filteredCount : totalCourses})</Text> : null}
                {(Data?.length !== 0 && showHeart.length>0) ?

                    <>
                         {/* {console.log( key)} */}
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
                                // (!item.isPurchased) ?
                                    <View onPress={() => handleViewNavigation(item)} style={styles.mainTouchable}>
                                       {/* {console.log("Dataaaaaaa",Data[0].CourseName)} */}
                                       {/* {console.log("GTfrfrfrfrfrfrfr",item)} */} 
                                        <View style={{ backgroundColor: COLORS.white, marginVertical: "1%", marginHorizontal: "2%", borderRadius: 10, padding: "2%" }}>
                                            <View style={{ width: "100%", flexDirection: "row" }}>
                                                <TouchableOpacity style={{ backgroundColor: COLORS.white, width: "35%", flexDirection: "column", justifyContent: "center" }} onPress={() => handleViewNavigation(item)}>
                                                    <View style={styles.coulmnImage}>
                                                        {(item.imageFiles.length > 0) ?
                                                            <Image
                                                                source={{ uri: "https://cdn.edusity.com/" + item.imageFiles[0].fileName }}
                                                                resizeMode="contain"

                                                                style={{
                                                                    width: "98%",
                                                                    height: 130,
                                                                    margin: "1%",
                                                                    borderRadius: 8,
                                                                }}
                                                            /> : <Image
                                                                source={{ uri: "https://cdn.edusity.com/" + "courses/2382/85883a4c-c61f-456f-953f-01b94482088d.png" }}
                                                                resizeMode="contain"

                                                                style={{
                                                                    width: "88%",
                                                                    height: 100,
                                                                    margin: "1%",
                                                                    borderRadius: 8,
                                                                }}
                                                            />}
                                                    </View>
                                                </TouchableOpacity>
                                                <View style={{ width: "65%", flexDirection: "column", padding: "1%" }}>
                                                    <View style={{ width: "100%", flexDirection: "row", borderWidth: 0 }}>
                                                        <View style={{ width: "90%", flexDirection: "column" }}>
                                                            <Text style={{ fontSize: RFValue(16), marginVertical: "2%", color: COLORS.black, ...FONTS.robotomedium }}>{item.CourseName}{"\n"}
                                                                <Text style={{ fontSize: RFValue(10), marginVertical: "2%", color: COLORS.black, ...FONTS.robotoregular }}>{item.Category}</Text></Text>
                                                        </View>
                                                        {key ? <TouchableOpacity onPress={() => handleWishlist(index)} style={{ width: "10%", flexDirection: "column", alignItems: "center", justifyContent: "space-around" }}>
                                                           
                                                            {(showHeart[index] == 0) ? <MCIcon name="cards-heart-outline" size={RFValue(20)} color={"red"} /> :
                                                                <MCIcon name="cards-heart" size={RFValue(20)} color={"red"} />}
                                                        </TouchableOpacity> : null}
                                                    </View>
                                                    <Text style={{ padding: "1%" }}>
                                                        <Image
                                                            source={icons.LevelIcon}
                                                            resizeMode="contain"
                                                            style={{ width: RFValue(15), height: RFValue(15), }}
                                                        />
                                                        <Text style={{ fontSize: RFValue(13), marginVertical: "2%", color: COLORS.black, ...FONTS.robotoregular }} > {item.Level}</Text>
                                                    </Text>
                                                    <View style={styles.details}>
                                                        <View style={{ flexDirection: "column", width: "100%" }}>
                                                            <View style={{ flexDirection: "row", width: "100%" }}>
                                                                <View style={{ flexDirection: "column", width: "70%" }}>
                                                                    <Text style={{ padding: "2%" }}>
                                                                        <Image
                                                                            source={icons.Tutor}
                                                                            resizeMode="contain"
                                                                            style={{ width: RFValue(15), height: RFValue(15), }}
                                                                        />
                                                                        <Text style={styles.Brand}>  {item.instructorName}</Text></Text>
                                                                    <Text style={styles.ratings}>
                                                                        <View>
                                                                            <Rating
                                                                                type='star'
                                                                                ratingCount={(item.StarRating) ? item.StarRating : 5}
                                                                                imageSize={RFValue(16)}
                                                                                showRating={false}
                                                                                isDisabled={true}
                                                                                ratingColor='#8830c4'
                                                                            />

                                                                        </View>
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={{ alignItems: "center" }}>
                                                        <Text style={styles.location}>${item.EnrollmentFee}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            {/* <Divider /> */}
                                           { (!item.isPurchased) ?
                                            <View style={{ flexDirection: "row", marginVertical: "2%" }}>
                                                <View style={{ flexDirection: "column", width: "50%", justifyContent: "center", alignItems: "center" }}>

                                                    <TouchableOpacity style={{ backgroundColor: COLORS.primary, width: "80%", flexDirection: "row", padding: "4%", alignItems: "center", borderRadius: 10 }} onPress={() => navigation.navigate("Cart")} >
                                                        <MCIcon name="cart-heart" size={RFValue(20)} color={"white"} style={{ marginHorizontal: "5%", flexDirection: "column", alignSelf: "center" }} />
                                                        <Text style={{ color: "white", ...FONTS.robotoregular, marginLeft: "6%" }}>Buy Now</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                {/* {console.log("This is value", (cartArray.includes(`${item.ID}`)))} */}
                                                <View style={{ flexDirection: "column", width: "50%", alignItems: "center" }}>
                                                    {/* {console.log(item.isPurchased)} */}
                                                    {!(cartArray.includes(`${item.ID}`)) ?
                                                        <>
                                                            {(cartBtnLoader!=item.ID) ?
                                                                <TouchableOpacity style={{ backgroundColor: COLORS.primary, width: "80%", flexDirection: "row", padding: "4%", alignItems: "center", borderRadius: 10 }} onPress={() => handleAddCart(item.ID)} >
                                                                    <MCIcon name="cart-plus" size={RFValue(20)} color={"white"} style={{ marginHorizontal: "5%", flexDirection: "column" }} />
                                                                    <Text style={{ color: "white", ...FONTS.robotoregular, marginLeft: "6%" }}>Add to Cart</Text>
                                                                </TouchableOpacity> :
                                                                <View style={{ backgroundColor: COLORS.primary, width: "80%", justifyContent:"center" ,padding: "4%", alignItems: "center", borderRadius: 10 }} >
                                                                    {/* {console.log("working", cartBtnLoader)} */}
                                                                    <LoaderKit
                                                                        style={{ width: RFValue(20), height: RFValue(20) }}
                                                                        name={'BallPulse'} // Optional: see list of animations below
                                                                        size={50} // Required on iOS
                                                                        color={COLORS.white} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
                                                                    />
                                                                </View>}
                                                        </>
                                                        :
                                                        <TouchableOpacity style={{ backgroundColor: COLORS.primary, width: "80%", flexDirection: "row", padding: "4%", alignItems: "center", borderRadius: 10 }} onPress={() => navigation.navigate("Cart")} >
                                                            <MCIcon name="cart" size={RFValue(20)} color={"white"} style={{ marginHorizontal: "5%", flexDirection: "column" }} />
                                                            <Text style={{ color: "white", ...FONTS.robotoregular, marginLeft: "6%" }}>View cart</Text>
                                                        </TouchableOpacity>
                                                    }
                                                </View>
                                            </View>: 
                                             <View style={{ backgroundColor: COLORS.white, width: "90%", flexDirection: "row", padding: "4%", alignItems: "center", borderRadius: 10 }} onPress={() => navigation.navigate("Cart")} >
                                                            <MCIcon name="check-decagram-outline" size={RFValue(20)} color={COLORS.primary} style={{ marginHorizontal: "5%", flexDirection: "column" }} />
                                                            <Text style={{ color: COLORS.primary, ...FONTS.robotoregular, marginLeft: "6%" }}>Already Purchased</Text>
                                                        </View>}

                                        </View>
                                    </View> 
                            )
                            }
                            onEndReachedThreshold={0.2}
                            onEndReached={refresh}
                        /></> : <View style={{ flex: 1, justifyContent: "center", alignItems: "center", }}>
                        <Image source={images.NoData} resizeMode="contain" style={{ height: "30%", width: "40%" }} />
                        <Text style={{ color: COLORS.black, fontSize: RFValue(16), ...FONTS.robotoregular }}>No Course Found</Text>
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
                    {(!refreshList) ? (Data?.length != 0) ? <Text style={{ color: COLORS.gray, fontSize: RFValue(10, 580), ...FONTS.robotoregular }}>-------Total of {(selectedLevel || selectedCategory) ? filteredCount : totalCourses} Courses-------</Text> : null
                        : <LoaderKit
                            style={{ width: 50, height: 25, marginLeft: "6%" }}
                            name={'BallPulse'} // Optional: see list of animations below
                            size={10} // Required on iOS
                            color={COLORS.primary} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',
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
                    style={{ margiTop: "15%" }} />
            </View>



    );
}
const styles = StyleSheet.create({

    mainContainer: {

        height: "100%",
        width: "100%",
        borderBottomStartRadius: 5,
        borderBottomEndRadius: 5,
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
        fontSize: RFValue(12, 580), ...FONTS.robotoregular, color: COLORS.gray,
    },
    location: {
        fontSize: RFValue(16, 580), ...FONTS.robotomedium, color: COLORS.black, color: COLORS.primary
    },
    ratings: {
        fontSize: 10, color: COLORS.black,
    },

    coulmnImage: {
        width: "100%",
        flexDirection: "column",
        // alignItems: "center",
        // justifyContent: "space-around",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    }
});
export default CourseList;