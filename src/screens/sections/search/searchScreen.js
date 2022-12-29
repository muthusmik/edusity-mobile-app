import React, { memo, useCallback, useRef, useState, useEffect } from 'react'
import { Button, Dimensions, Text, View, Platform, StyleSheet } from 'react-native'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { COLORS, FONTS } from '../../../constants'
import Feather from 'react-native-vector-icons/Feather'
import { useSelector, useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { viewCourseHandler } from "../../../store/redux/viewCourse"
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { RFValue } from 'react-native-responsive-fontsize';
import { TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

Feather.loadFont()

const SearchScreen = ({ setIsSearchLoader,cartCount }) => {
    useEffect(() => {
        console.log(selectedItem, "selected item")
    }, [selectedItem])
    // console.log("iam inside SearchBar");
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [suggestionsList, setSuggestionsList] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const dropdownController = useRef(null);
    const items = useSelector(state => state.courseList.data.data.data);
    const Token = useSelector((state) => state.loginHandle.data)
    const [keyToken, setKeyToken] = useState();
    const searchRef = useRef(null);
    // const [isSearchLoader, setIsSearchLoader] = useState(false);
    const cartData = useSelector((state) => state.cartList.data.data)
    const [Data, setData] = useState([]);
    const [totalValue, setTotalValue] = useState(0);

    useEffect(() => {

        const initialLoading = async () => {
            let newToken = await AsyncStorage.getItem("loginToken");
            // console.log("new token", newToken);
            if (newToken) {
                if (cartData) {
                    let cartValue = 0
                    let course = cartData.Courses;
                    // console.log(course, "course detail")
                    setData(cartData);
                    for (let i = 0; i < course.length; i++) {
                        cartValue = cartValue + course[i].enrollmentFee;
        
                    }
                    setTotalValue(cartValue);
                }
        
                setKeyToken(newToken);
            }else{
                setKeyToken(null);
            }
           
        }
        initialLoading();
        // console.log(cartData, "cartData2");
       
    }, [cartData,cartCount])

    const handleSelelction = (data) => {
        setIsSearchLoader(true)
        setSelectedItem(data);
        // console.log(data, "Data")
        dispatch(viewCourseHandler(data)).then(unwrapResult)
            .then((originalPromiseResult) => {
                // console.log("successfully Search returned to login with response CourseList ", originalPromiseResult);
                setIsSearchLoader(false);
                navigation.navigate("ViewCourse");
                // SetLoader(false);
            })
            .catch((rejectedValueOrSerializedError) => {
                // console.log(" Inside catch", rejectedValueOrSerializedError);
                // SetLoader(false);
                // setViewLoader(false)
            })

    }

    const suggestionCallApi = async (data) => {
        const searchUrl = "https://backend-linux-login.azurewebsites.net/search/course?search=" + data;
        const headers = { 'Content-Type': 'application/json', 'Authorization': "Bearer " + Token }
        return await axios.get(searchUrl, { headers: headers }).then(response => {
            const suggestions = response.data.data
                .filter(item => item.CourseName.toLowerCase().includes(data))
                .map(item => ({
                    id: item.ID,
                    title: <View style={{ justifyContent: "space-between", }}><Text style={{ ...FONTS.robotoregular, color: COLORS.black }}>{item.CourseName}</Text><Text style={{ ...FONTS.robotomedium }}>({item.Category})</Text></View>
                }))
            setSuggestionsList(suggestions)
            // console.log("success", suggestions)
            return response.data.data
        })
            .catch((err) => {
                console.log(err);
            })

    }

    const getSuggestions = useCallback(async q => {
        const filterToken = q.toLowerCase()
        // console.log('getSuggestions', q)
        if (typeof q !== 'string' || q.length < 4) {
            setSuggestionsList(null)
            return
        }
        setLoading(true)
        const SearchSuggestion = await suggestionCallApi(filterToken);
        setLoading(false)
    }, [])

    const onClearPress = useCallback(() => {
        setSuggestionsList(null)
    }, [])

    const onOpenSuggestionsList = useCallback(isOpened => { }, [])
    const handlecart =() => {
        // console.log(keyToken,"hello")
        if (keyToken) {
            navigation.navigate("Cart")
        }
        else
            navigation.navigate("Login");
    }

    return (
        <>
            <View
                style={[
                    { flexDirection: 'row', backgroundColor: COLORS.primary, height: "100%", borderWidth: 0 },
                    Platform.select({ ios: { zIndex: 1 } }),
                ]}>
                <View style={[
                    { height: "90%", width: "78%", backgroundColor: COLORS.primary, borderWidth: 0, flexDirection: "column", marginTop: "2%" },
                    Platform.select({ ios: { zIndex: 1 } }),
                ]}>
                    <AutocompleteDropdown
                        ref={searchRef}
                        controller={controller => {
                            dropdownController.current = controller
                        }}
                        // initialValue={'1'}
                        direction={Platform.select({ ios: 'down' })}
                        dataSet={suggestionsList}
                        onChangeText={getSuggestions}
                        onSelectItem={(item) =>
                            item && handleSelelction(item.id)}

                        debounce={600}
                        suggestionsListMaxHeight={Dimensions.get('window').height * 0.6}
                        onClear={onClearPress}
                        //  onSubmit={(e) => onSubmitSearch(e.nativeEvent.text)}
                        onOpenSuggestionsList={onOpenSuggestionsList}
                        loading={loading}
                        useFilter={false} // set false to prevent rerender twice
                        textInputProps={{

                            placeholder: 'Search Courses',
                            placeholderTextColor: COLORS.black,
                            autoCorrect: false,
                            autoCapitalize: 'none',
                            style: {
                                borderRadius: 25,
                                backgroundColor: COLORS.white,
                                color: COLORS.black,
                                paddingLeft: 18,
                                ...FONTS.robotoregular
                            },
                        }}
                        rightButtonsContainerStyle={{
                            right: 8,
                            height: 30,
                            alignSelf: 'center',
                            borderWidth: 0
                        }}
                        inputContainerStyle={{
                            backgroundColor: 'white',
                            borderRadius: 25,
                        }}
                        suggestionsListContainerStyle={{
                            backgroundColor: COLORS.white,
                            marginTop: "0%",
                            borderWidth: 1,
                            borderColor: COLORS.black

                        }}
                        containerStyle={{ justifyContent: "space-around", marginTop: "5%", marginHorizontal: "5%" }}
                        renderItem={(item, text) => <Text style={{ color: COLORS.black, padding: 10, ...FONTS.robotoregular }}>{item.title}</Text>}
                        ChevronIconComponent={<Feather name="chevron-down" size={20} color="red" />}
                        ClearIconComponent={<Feather name="x-circle" size={18} color="red" />}
                        inputHeight={40}
                        showChevron={false}
                        closeOnBlur={false}
                    //  showClear={false}
                    />
                </View>
                {/* <View style={{ width: 10, height: 10 }} /> */}
                {/* <View style={{height:"90%",width:"20%",backgroundColor:COLORS.primary,alignItems:"center",justifyContent:"space-around"}}>
                <Button title="List" onPress={() => dropdownController.current.toggle()} />
                </View> */}
                <View style={[
                    { height: "90%", width: "18%", backgroundColor: COLORS.primary, justifyContent: "center", flexDirection: "column", marginTop: "1.5%", borderWidth: 0 },
                    Platform.select({ ios: { zIndex: 1 } }),
                ]}>
                    <TouchableOpacity style={{ alignItems: 'center', flexDirection: "row", borderWidth: 0, justifyContent: "center", borderColor: COLORS.white, borderRadius: 10 }} onPress={() => handlecart()}>
                        <FontAwesome name="shopping-cart" size={RFValue(35)} color="white" style={{ flexDirection: "column" }} />
                        {console.log("hi,",keyToken)}
                        {(Data && keyToken) ? <View style={{
                            flexDirection: "column", borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
                            width: Dimensions.get('window').width * 0.05,
                            height: Dimensions.get('window').width * 0.05,
                            backgroundColor: "red",
                            justifyContent: 'center',
                            alignItems: 'center',
                            // marginLeft:"8%"
                            position: "absolute",
                            bottom: "54%",
                            left: "41%",
                            borderWidth: 1,
                            borderColor: "red"
                        }}>
                            <Text style={{ color: COLORS.white, fontSize: RFValue(10), ...FONTS.robotomedium, }}>{(Data.Courses).length}</Text>
                        </View> : null}
                    </TouchableOpacity>
                </View>
                {/* <Text style={{ color: '#668', fontSize: 13 }}>Selected item id: {JSON.stringify(selectedItem)}</Text> */}
            </View>
        </>

    );
}
const styles = StyleSheet.create({

    mainContainer: {
        backgroundColor: COLORS.primary,
        height: "100%",
        width: "100%",
        borderBottomStartRadius: 5,
        borderBottomEndRadius: 5,
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 2.25,
        shadowRadius: 3.84,
        elevation: 5,
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
        borderWidth: 1,
    },
});
export default SearchScreen;