import React, { useEffect, useState } from 'react';
import {
    View,
    Text, Image, ImageBackground, ActivityIndicator,
    TouchableOpacity,
    StatusBar, ScrollView, FlatList, StyleSheet, Pressable, Dimensions, useWindowDimensions
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { images, icons, COLORS, FONTS, SIZES } from '../../../constants';
import { useSelector, useDispatch } from 'react-redux';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FA5 from 'react-native-vector-icons/FontAwesome5'
import AntIcon from 'react-native-vector-icons/AntDesign'
import Fontisto from 'react-native-vector-icons/Fontisto'
import OctIcon from 'react-native-vector-icons/Octicons'

// import StarRating from 'react-native-star-rating-widget';
import { viewCourseHandler } from '../../../store/redux/viewCourse';
import { cartHandler } from '../../../store/redux/cart';
import { unwrapResult } from '@reduxjs/toolkit';
import { addtoCart } from '../../../services/cartService';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ViewCourse = () => {
    console.log("iam inside search allCourses");
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const Width=useWindowDimensions.width;
    console.log(Width,"ScreenWidth")
    const bannerImage= listData?.recordsets[0][0].imageFiles[0].fileName;
    // const Token = useSelector((state) => state.loginHandle.data)
    const Data = useSelector(state => state.viewCourse.data)
    // console.log(Data.data.recordsets[0][0].isPurchased, "Data")
    const [loader, setLoader] = useState(false);
    const [cartArray, setCartArray] = useState([]);
    const CartData = useSelector(state => state.cartList.data);
    //   console.log(CartData);
    const listData = Data?.data;
    const handleAddCart = async (id) => {
        let newToken = await AsyncStorage.getItem("loginToken");
        console.log("new token", newToken);
        if (newToken) {
            //let result = await addtoCart(id, Token.data);
            let result = await addtoCart(id, newToken);
            console.log(result, "hello");
            dispatch(cartHandler(newToken));
        }
        else {
            navigation.navigate("login");
        }
    }

    const handleChangeCourse = (item) => {
        setLoader(true)
        console.log("item.id", item.ID)
        dispatch(viewCourseHandler(item.ID)).then(unwrapResult)
            .then(() => {
                setLoader(false);
            }).catch(() => {
                setLoader(false);
            })
    }

    useEffect(() => {
        console.log(CartData, "cartData h7h7h7h7h7h77h7h7")
        if(CartData?.data?.Courses){
            var ListCartId = [];
            (CartData?.data?.Courses).forEach((element) => {
                var Data = (element.CourseId);
                ListCartId.push(Data);
                //console.log(ListCartId, "Array")
            })
            setCartArray(ListCartId);
        }
    }, [CartData])

    const goToCart=()=>{
        navigation.navigate("Cart");
    }
// const handleWishlist=()=>{
//       let wishlistedData = await wishListApi(Data[index].ID, key).then(data => { console.log("wishlisted",data) })
// }

    return (
        <>
            {
                (!listData || loader) ?
                    <View style={{ height: "100%", width: "100%", }}>
                        <ImageBackground source={images.LoginBgImage} resizeMode="repeat" style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center" }}>
                            <ActivityIndicator size="large" />
                        </ImageBackground>
                    </View> :
                    <ScrollView style={styles.mainContainer} contentContainerStyle={{ paddingBottom: "5%" }}>
                        <View style={{ backgroundColor: "#e9ddf1",paddingBottom:"15%" }}>
                            <View style={{ width: "100%", flexDirection: "row", backgroundColor: COLORS.primary, borderBottomStartRadius: 35, borderBottomEndRadius: 35,paddingVertical:"3%" }}>
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
                                        <TouchableOpacity style={{ margin: "0%" }} onPress={() =>navigation.navigate("Cart")}>
                                            <MCIcon name="cart-variant" size={RFValue(20)} color={COLORS.white} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>



                            <View style={{ width: "100%", top: "5%", borderWidth: 0 }}>
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
                                                    width: "88%",
                                                    height: 140,
                                                    margin: "1%",
                                                    borderRadius: 8, padding: "5%"
                                                }}
                                            />
                                            : <Image
                                                source={{ uri: "https://cdn.edusity.com/" + "courses/2528/de3d968f-0f08-4383-8fe1-3278e996ae15.png" }}
                                                resizeMode="contain"

                                                style={{
                                                    width: "88%",
                                                    height: 120,
                                                    margin: "1%",
                                                    borderRadius: 8,
                                                }}
                                            />}
                                </View>
                                <Text style={{ color: COLORS.black, fontSize: RFValue(16), ...FONTS.robotomedium, textAlign: "center" }}>
                                    {listData?.recordsets?.[0][0].CourseName}
                                </Text>
                                <Text style={{ color: COLORS.black, fontSize: RFValue(12), ...FONTS.robotoregular, textAlign: "center", }}>
                                    {listData?.recordsets?.[0][0].Category}

                                </Text>
                                <Text style={{ color: COLORS.black, fontSize: RFValue(12), ...FONTS.robotomedium, marginLeft: "10%", paddingVertical: "1%" }}>
                                    Created by <Text style={{ color: COLORS.primary }}> Academind by Maximilian Schwarzmuller</Text>
                                </Text>
                                <View style={{ marginLeft: "10%", paddingVertical: "1%", flexDirection: "row" }}>
                                    <Text style={{ flexDirection: "column" }}><MCIcon name="clock-check" size={15} color={COLORS.primary} /></Text>
                                    <Text style={{ color: COLORS.black, ...FONTS.robotoregular, fontSize: RFValue(10), flexDirection: "column" }}> Last Updated  {moment(listData.recordsets?.[0][0].CreatedOn).format("DD/MMM/yy")}</Text>
                                </View>
                                <View style={{ flexDirection: "row", marginLeft: "10%", paddingVertical: "1%" }}>
                                    <Text style={{ flexDirection: "column" }}><FontAwesome name="language" size={15} color={COLORS.primary} /></Text>
                                    <Text style={{ color: COLORS.black, fontSize: RFValue(10), ...FONTS.robotoregular, flexDirection: "column" }}> {listData.recordsets?.[0][0].Language}</Text>
                                </View>
                                <View style={{ flexDirection: "row", marginLeft: "10%", paddingVertical: "1%", alignItems: "center" }}>
                                    <Text style={{ flexDirection: "column", borderWidth: 0 }}><FA5 name="chalkboard-teacher" size={RFValue(15)} color={COLORS.primary} /></Text>
                                    <TouchableOpacity style={{ flexDirection: "column" }} onPress={() => navigation.navigate("ViewInstructorProfile", listData.recordsets?.[0][0].instructorInfo)}>
                                        <Text style={{ color: COLORS.black, fontSize: RFValue(11), ...FONTS.robotoregular }}> {listData.recordsets?.[0][0].instructorInfo.firstName} {listData.recordsets?.[0][0].instructorInfo.lastName}{'\n'}
                                            <Text style={{ color: COLORS.primary, fontSize: RFValue(8) }}> View instructor profile</Text>
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={{ color: COLORS.black, fontSize: RFValue(20), ...FONTS.robotomedium, textAlign: "right", top: "5%",marginRight:"8%" }}>
                                    $ {listData.recordsets?.[0][0].EnrollmentFee}.00
                                </Text>

                            </View>
                        </View>
                        <View style={{ backgroundColor: COLORS.white }}>
                            <View>
                                <TouchableOpacity style={{ width: "90%", alignItems: "center", justifyContent: "center", backgroundColor: COLORS.primary, margin: "5%", padding: "3%" }}>
                                    <Text style={{ color: COLORS.white, fontSize: RFValue(12), ...FONTS.robotoregular }}>Buy Now</Text>
                                </TouchableOpacity>
                                <View style={{ flexDirection: "row", width: "90%", marginHorizontal: "5%" }}>
                                    <TouchableOpacity style={{ flexDirection: "column", width: "48%", alignItems: "center", justifyContent: "center", margin: "1%", borderWidth: 1, padding: "3%" }}>
                                        <Text style={{ color: COLORS.black, fontSize: RFValue(12), ...FONTS.robotoregular }}>Add To Wishlist</Text>
                                    </TouchableOpacity>
                                    {(Data.data.recordsets[0][0].isPurchased === false) ? (cartArray.includes(`${listData?.recordsets[0][0].ID}`)) ?
                                          <TouchableOpacity style={{ flexDirection: "column", width: "48%", alignItems: "center", justifyContent: "center", margin: "1%", borderWidth: 1, padding: "3%" }} onPress={() => navigation.navigate("Cart")}>
                                            <Text style={{ color: COLORS.black, fontSize: RFValue(12), ...FONTS.robotoregular }}>Go to Cart</Text>
                                        </TouchableOpacity> :<TouchableOpacity style={{ flexDirection: "column", width: "48%", alignItems: "center", justifyContent: "center", margin: "1%", borderWidth: 1, padding: "3%" }} onPress={() => handleAddCart(listData?.recordsets[0][0].ID)}>
                                            <Text style={{ color: COLORS.black, fontSize: RFValue(12), ...FONTS.robotoregular }}>Add To Cart</Text>
                                        </TouchableOpacity>:
                                        <View style={{ backgroundColor: COLORS.black, flexDirection: "column", width: "48%", alignItems: "center", justifyContent: "center", margin: "1%", borderWidth: 1, padding: "3%" }} onPress={() => navigation.navigate("Cart")}>
                                            <Text style={{ color: COLORS.white, fontSize: RFValue(12), ...FONTS.robotoregular }}>Purchased</Text>
                                        </View>
                                    }
                                    {/* {console.log("purchased", (Data.data.recordsets[0][0].isPurchased))} */}

                                    {/* {console.log("purchased3", (cartArray.includes(`${listData?.recordsets[0][0].ID}`)))} */}
                                </View>
                            </View>
                            {(listData) ?
                                <View style={styles.componentshadow}>
                                    <View style={{ width: "90%", justifyContent: "center", marginHorizontal: "5%", marginVertical: "2%" }}>
                                        <Text style={{ fontSize: RFValue(15), color: COLORS.black, ...FONTS.robotomedium }}>
                                            <MCIcon name="target" size={RFValue(16)} color={"red"} /> Goals
                                        </Text>
                                    </View>
                                    {(listData?.recordsets[0][0].goals).map((item, index) => {
                                        return (
                                            <View style={{ width: "90%", left: "8%" }}>
                                                <Text key={index} style={{ margin: "1%", fontSize: RFValue(13), color: COLORS.black, ...FONTS.robotoregular, }}><AntIcon name="checkcircleo" size={12} color={COLORS.primary} /> {item?.name} </Text>
                                            </View>)
                                    })}
                                </View> : null}

                            {(listData) ?
                                <View style={styles.componentshadow}>
                                    <View style={{ width: "90%", justifyContent: "center", marginHorizontal: "5%", marginVertical: "2%" }}>
                                        <Text style={{ fontSize: RFValue(15), color: COLORS.black, ...FONTS.robotomedium }}>
                                            <Fontisto name="angelist" size={RFValue(16)} color={"red"} />  What you'll learn
                                        </Text>
                                    </View>
                                    <View style={{ width: "90%", left: "8%" }}>
                                        {(listData?.recordsets[0][0].syllabus).map((item, index) => {
                                            return (
                                                <Text key={index} style={{ margin: "1%", fontSize: RFValue(13), color: COLORS.black, ...FONTS.robotoregular, }}>
                                                    <AntIcon name="checkcircleo" size={RFValue(12)} color={COLORS.primary} /> {item?.name}
                                                </Text>
                                            )
                                        })}
                                    </View>
                                </View> : null}

                            {(listData) ?
                                <View style={styles.componentshadow}>
                                    <View style={{ width: "90%", justifyContent: "center", marginHorizontal: "5%", marginVertical: "2%" }}>
                                        <Text style={{ fontSize: RFValue(15), color: COLORS.black, ...FONTS.robotomedium }}>
                                            <MCIcon name="notebook" size={RFValue(16)} color={"red"} /> Description
                                        </Text>
                                    </View>
                                    <View style={{ width: "90%", left: "8%" }}>
                                        <Text style={{ margin: "1%", fontSize: RFValue(13), color: COLORS.black, ...FONTS.robotoregular, }}><AntIcon name="checkcircleo" size={13} color={COLORS.primary} /> {listData?.recordsets[0][0].Description} </Text>
                                    </View>
                                </View> : null}

                            <View style={styles.componentshadow}>
                                <View style={{ width: "90%", justifyContent: "center", marginHorizontal: "5%", marginVertical: "2%" }}>
                                    <Text style={{ fontSize: RFValue(15), color: COLORS.black, ...FONTS.robotomedium }}>
                                        <OctIcon name="checklist" size={RFValue(16)} color={"red"} /> This Includes
                                    </Text>
                                </View>
                                <View style={{ width: "90%", left: "8%" }}>
                                    <Text style={{ margin: "1%", fontSize: RFValue(13), color: COLORS.black, ...FONTS.robotoregular, }}><AntIcon name="youtube" size={RFValue(13)} color={COLORS.primary} /> of video material </Text>
                                    <Text style={{ margin: "1%", fontSize: RFValue(13), color: COLORS.black, ...FONTS.robotoregular, }}><FontAwesome name="language" size={RFValue(13)} color={COLORS.primary} /> Languanges : English </Text>
                                    <Text style={{ margin: "1%", fontSize: RFValue(13), color: COLORS.black, ...FONTS.robotoregular, }}><AntIcon name="clouddownloado" size={RFValue(13)} color={COLORS.primary} /> Downloadable Resources </Text>
                                    <Text style={{ margin: "1%", fontSize: RFValue(13), color: COLORS.black, ...FONTS.robotoregular, }}><AntIcon name="mobile1" size={RFValue(13)} color={COLORS.primary} /> Access from mobile and tablet </Text>
                                    <Text style={{ margin: "1%", fontSize: RFValue(13), color: COLORS.black, ...FONTS.robotoregular, }}><MCIcon name="brain" size={RFValue(13)} color={COLORS.primary} /> Self paced learning!</Text>
                                </View>
                            </View>
                            <View style={styles.componentshadow}>
                                <View style={{ width: "90%", justifyContent: "center", marginHorizontal: "5%", marginVertical: "2%" }}>
                                    <Text style={{ fontSize: RFValue(15), color: COLORS.black, ...FONTS.robotomedium }}>
                                    <MCIcon name="book" size={RFValue(18)} color={"red"} /> Related Course's
                                    </Text>
                                </View>
                                <View style={{ width: "95%", left: "3%", paddingBottom: "5%", }}>
                                    <FlatList
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        data={listData?.recordsets[0][0]?.relatedCourses}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity style={styles.componentFlatlist} onPress={() => handleChangeCourse(item)}>
                                                {/* {console.log(item.CourseName, "CourseName")} */}
                                                {(item.imageFiles.length > 0) ?
                                                    <Image
                                                        source={{ uri: "https://cdn.edusity.com/" + item.imageFiles[0].fileName }}
                                                        resizeMode="contain"

                                                        style={{
                                                            width: "96%",
                                                            height: RFValue(100),
                                                            margin: "2%",
                                                            borderTopLeftRadius: 20,borderBottomRightRadius:20, padding: "5%"
                                                        }}
                                                    /> : <Image
                                                        source={{ uri: "https://cdn.edusity.com/" + "courses/2528/de3d968f-0f08-4383-8fe1-3278e996ae15.png" }}
                                                        resizeMode="contain"

                                                        style={{
                                                            width: "88%",
                                                            height: 80,
                                                            margin: "1%",
                                                            borderRadius: 8, padding: "5%"
                                                        }}
                                                    />}
                                                <Text style={{ marginLeft: "5%", fontSize: RFValue(12), color: COLORS.black, ...FONTS.robotoregular, }}>{item.CourseName}</Text>
                                                <Text style={{ marginLeft: "5%", fontSize: RFValue(12), color: COLORS.black, ...FONTS.robotoregular, }}>
                                                    {item.Category} <Text style={{ margin: "1%", fontSize: RFValue(12), color: COLORS.black, ...FONTS.robotoregular, }}>({item.SubCategory})</Text>
                                                </Text>

                                            </TouchableOpacity>
                                        )}
                                        keyExtractor={(item, index) => index}
                                    />
                                    {/* <Text style={{ margin: "1%", fontSize: RFValue(13), color: COLORS.black,...FONTS.robotoregular, }}>listDatarecordsets[0][0].Description </Text> */}
                                </View>
                            </View>
                            {(listData) ?
                                <View style={styles.componentshadow}>
                                    <View style={{ width: "90%", justifyContent: "center", marginHorizontal: "5%", marginVertical: "2%" }}>
                                        <Text style={{ fontSize: RFValue(15), color: COLORS.black, ...FONTS.robotoregular }}>
                                            <AntIcon name="key" size={RFValue(16)} color={"red"} /> FAQ's
                                        </Text>
                                    </View>
                                    {(listData?.recordsets[0][0].faqs).map((item, index) => {
                                        return (
                                            <View style={{ width: "90%", left: "8%" }}>
                                                <Text key={index} style={{ margin: "1%", fontSize: RFValue(14), color: COLORS.black, ...FONTS.robotoregular, }}>{item?.question} </Text>
                                                <Text key={index} style={{ marginLeft: "4%", fontSize: RFValue(14), color: COLORS.black, ...FONTS.robotoregular, }}><AntIcon name="checkcircleo" size={12} color={COLORS.primary} /> {item?.answer} </Text>
                                            </View>)
                                    })}
                                </View> : null}
                        </View>
                    </ScrollView >
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
        backgroundColor: COLORS.white,

    },
    componentshadow: {
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 2.25,
        shadowRadius: 3.84,
        borderBottomWidth:1,
        borderColor: COLORS.lightGray,
        backgroundColor: COLORS.white,
        // borderRadius: 10,
        margin: "2%",
        width: "96%",
        paddingBottom: "2%"


    },
    componentFlatlist: {
        shadowColor: COLORS.gray,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 2.25,
        shadowRadius: 3.84,
        backgroundColor: COLORS.lightGray,
        height: "100%",
        width: RFValue(200),
        marginEnd: 5,
        borderWidth: 0,
        paddingHorizontal: "6%",
        // paddingVertical:"2%",
        borderColor: COLORS.black,
        // paddingBottom:"10%"
        // borderRadius: 8


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
        fontSize: 10, color: COLORS.black,
    },

    coulmnImage: {
        width: "95%",
        height: 200,
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
        marginVertical: "2%",
        left: "3%"
    }
});
export default ViewCourse;