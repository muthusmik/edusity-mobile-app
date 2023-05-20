import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    TextInput, TouchableOpacity, ScrollView, Alert
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { icons, COLORS, FONTS } from '../../../constants';
import { DeleteProfile, updateProfile } from '../../../services/userService';
import { useDispatch, useSelector } from 'react-redux';
import { userLoginHanlder } from '../../../store/redux/userLogin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { unwrapResult } from '@reduxjs/toolkit';
import LoaderKit from 'react-native-loader-kit'
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { pro } from '../../../constants/icons';
import { useNavigation } from '@react-navigation/native';

const ProfileInput = (props) => {
    const { placeholder, value, settedValue, checkForChange } = props;

    // console.log(value, placeholder)
    return (
        <View style={{ borderBottomWidth: 1, width: "90%", borderRadius: 20, justifyContent: "center", }}>
            <TextInput
                placeholder={placeholder}
                style={{ marginHorizontal: 10, ...FONTS.robotoregular }}
                value={value}
                placeholderTextColor={COLORS.gray}
                selectionColor={COLORS.blue}
                onChangeText={e => { settedValue(e), checkForChange(true) }} />
        </View>
    )
}

const General = () => {

    const [userDetails, setUserDetails] = useState();
    const dispatch = useDispatch();
    const [Token, setToken] = useState("");
    // const Token = useSelector(state => state.loginHandle.data.data);
    const ProfileDetails = useSelector(state => state.userLoginHandle)
    const [Error, setError] = useState({});
    const [addLoader, setAddLoader] = useState(false);
    const scrollRef = useRef(null);
    const navigation=useNavigation();

    useEffect(() => {
        const initialLoading = async () => {
            const newToken = await AsyncStorage.getItem("loginToken")
            setToken(newToken)
        }
        initialLoading();
    }, [])

    useEffect(() => {
        // console.log([ProfileDetails?.data?.data][0].countryCode, "hhhh")
        setUserDetails([ProfileDetails?.data?.data])
        // console.log("data success", [ProfileDetails?.data?.data][0].phoneNumber)
    }, [ProfileDetails])

    const [contentVerticalOffset, setContentVerticalOffset] = useState(null);

    const [firstName, setFirstName] = useState([ProfileDetails?.data?.data][0].firstName);
    const [lastName, setLastName] = useState([ProfileDetails?.data?.data][0].lastName);
    const [addressLine1, setAddressLine1] = useState([ProfileDetails?.data?.data][0].addressLine1);
    const [addressLine2, setAddressLine2] = useState([ProfileDetails?.data?.data][0].addressLine2);
    const [city, setCity] = useState([ProfileDetails?.data?.data][0].city);
    const [province, setProvince] = useState([ProfileDetails?.data?.data][0].state);
    const [country, setCountry] = useState([ProfileDetails?.data?.data][0].country);
    const [phoneNumber, setPhoneNumber] = useState([ProfileDetails?.data?.data][0].phoneNumber);
    const [email, setEmail] = useState([ProfileDetails?.data?.data][0].email);
    const [facebook, setFacebook] = useState([ProfileDetails?.data?.data][0].facebookProfile);
    const [linkedin, setLinkedIn] = useState([ProfileDetails?.data?.data][0].linkedProfile);
    const [youtube, setYoutube] = useState([ProfileDetails?.data?.data][0].youtubeProfile);
    const [twitter, setTwitter] = useState([ProfileDetails?.data?.data][0].twitterProfile);
    const [checkForChange, setchange] = useState(false);
    console.log("ProfileDetails............................................", ProfileDetails)
    const handleSave = () => {
        const putProfile = async () => {
            if (checkForChange) {
                console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiidddjj", checkForChange)
                const Payload = {

                    addressLine1: addressLine1,
                    addressLine2: addressLine2,
                    bio: "Default bio for",
                    city: city,
                    country: country,
                    facebookProfile: facebook,
                    firstName: firstName,
                    introduction: null,
                    introductionLink: null,
                    languages: null,
                    lastName: lastName,
                    linkedProfile: linkedin,
                    phoneNumber: phoneNumber,
                    publicLocation: null,
                    publicLocationCountry: null,
                    state: province,
                    twitterProfile: twitter,
                    youtubeProfile: youtube,
                }
                let updateprofile = await updateProfile(Token, Payload).then(data => {
                    // console.log(data.data, "hello");
                    // setError("");
                    setAddLoader(true)
                    dispatch(userLoginHanlder(Token)).then(unwrapResult).then((originalPromiseResult) => {
                        console.log("result", originalPromiseResult);
                        setchange(false);
                        setAddLoader(false)
                        //  console.log("Payload",Payload)
                        if (!originalPromiseResult.erroCode) {
                            Alert.alert(
                                "",
                                "Successfully Updated!",
                                [{
                                    text: "OK"
                                }]
                            );
                        } else {
                            Alert.alert(
                                "",
                                "Something went wrong, Please try again later!",
                                [{
                                    text: "Ok"
                                }]
                            )
                        }
                    }
                    )
                        .catch((rejectedValueOrSerializedError) => {
                            setAddLoader(false)
                            Alert.alert(
                                "",
                                "Something went wrong, Please try again later!",
                                [{
                                    text: "Ok"
                                }]
                            )
                        })

                })
            } else {
                Alert.alert(
                    "",
                    "No Changes were made to Update!",
                    [{
                        text: "Ok"
                    }]
                )

            }
        }
        // console.log("First name jbubbub", firstName == "");
        if (firstName && firstName.length >= 3 && firstName.length <= 15) {
            if (lastName && lastName.length >= 3 && lastName.length <= 15) {
                if (addressLine1 && addressLine1.length <= 100 && addressLine1.length >= 3 || !addressLine1) {
                    if (addressLine2 && addressLine2.length <= 100 && addressLine2.length >= 3 || !addressLine2) {
                        if (city && city.length <= 30 && city.length >= 3 || !city) {
                            if (province && province.length <= 30 && province.length >= 3 || !province) {
                                if (country && country.length <= 30 && country.length >= 2 || !country) {
                                    putProfile();
                                    setError("");
                                }
                                else {
                                    setError({ "country": " Country must not exceed more than 30 characters and must have min 2 characters !" })
                                    if (contentVerticalOffset > 80) {
                                        scrollRef?.current.scrollTo({ y: 0, animated: true })
                                    };
                                }
                            }
                            else {
                                setError({ "province": "Province must not exceed more than 30 characters  and must have min 3 characters !" })
                                if (contentVerticalOffset > 80) {
                                    scrollRef?.current.scrollTo({ y: 0, animated: true })
                                };
                            }
                        }
                        else {
                            setError({ "city": "City must not exceed more than 30 characters  and must have min 3 characters !" })
                            if (contentVerticalOffset > 80) {
                                scrollRef?.current.scrollTo({ y: 0, animated: true })
                            };
                        }
                    }
                    else {
                        setError({ "addressLine2": "Address should have min 3 and must not exceed more than 100 characters !" })
                        if (contentVerticalOffset > 80) {
                            scrollRef?.current.scrollTo({ y: 0, animated: true })
                        };
                    }
                }
                else {
                    setError({ "addressLine1": "Address must not exceed more than 100 characters !" })
                    if (contentVerticalOffset > 80) {
                        scrollRef?.current.scrollTo({ y: 0, animated: true })
                    };
                }
            }
            else {
                setError({ "lastName": "Lastname should have min 3 characters and should not exceed more than 15 characters !" })
                if (contentVerticalOffset > 80) {
                    scrollRef?.current.scrollTo({ y: 0, animated: true })
                };

            }
        }
        else {
            setError({ "firstName": "Firstname should have min 3 characters and should not exceed more than 15 characters !" })
            if (contentVerticalOffset > 80) {
                scrollRef?.current.scrollTo({ y: 0, animated: true })
            };

        }
    }

    const deactivateTwoButtonAlert = () =>
        Alert.alert(
            "Delete Account",
            "Are you sure? you want to delete your Account, your account will be removed if you continue!",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => handleDeactivate() }
            ]
        );

    const handleDeactivate = async () => {
        //setLoader(true)
     await DeleteProfile(Token).then(response=>{
             AsyncStorage.removeItem("loginToken");
            navigation.navigate("Home", { screen: "Search" })
        })
    }


    return (
        <View style={{ height: "100%" }}>
            {addLoader ?
                <View style={styles.overlay} >
                    {/* <ActivityIndicator size="large" color={COLORS.white} /> */}
                    <LoaderKit
                        style={{ width: 50, height: 50, position: 'absolute' }}
                        name={'BallPulse'} // Optional: see list of animations below
                        size={50} // Required on iOS
                        color={COLORS.primary} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
                    />
                </View>
                : null}
            <ScrollView contentContainerStyle={{ paddingBottom: "40%" }}
                ref={scrollRef}
                onScroll={event => {
                    setContentVerticalOffset(event.nativeEvent.contentOffset.y);
                }}
            >


                <View style={{ margin: "3%" }}>
                    <Text style={{ color: COLORS.primary, fontSize: RFValue(14), ...FONTS.robotoregular }}>Public Profile</Text>
                    <Text style={{ color: COLORS.black, fontSize: RFValue(10), ...FONTS.robotoregular }}>Tell Us Something About Yourself..</Text>
                </View>
                <View style={{ flexDirection: "row", margin: "2%" }}>
                    <View style={{ flexDirection: "column", width: "50%" }}>
                        <ProfileInput placeholder="First Name" value={firstName} settedValue={setFirstName} setError={setError} checkForChange={setchange} />
                        {(Error?.firstName) ? <Text style={styles.errorText}>{Error?.firstName}</Text> : null}
                    </View>
                    <View style={{ flexDirection: "column", width: "50%" }}>
                        <ProfileInput placeholder="Last Name" value={lastName} settedValue={setLastName} setError={setError} checkForChange={setchange} />
                        {(Error?.lastName) ? <Text style={styles.errorText}>{Error?.lastName}</Text> : null}
                    </View>
                </View>
                <View style={{ flexDirection: "row", margin: "2%" }}>
                    <View style={{ flexDirection: "column", width: "50%" }}>
                        <ProfileInput placeholder="Address Line1" value={addressLine1} settedValue={setAddressLine1} checkForChange={setchange} />
                        {(Error?.addressLine1) ? <Text style={styles.errorText}>{Error?.addressLine1}</Text> : null}
                    </View>
                    <View style={{ flexDirection: "column", width: "50%" }}>
                        <ProfileInput placeholder="Address Line2" value={addressLine2} settedValue={setAddressLine2} checkForChange={setchange} />
                        {(Error?.addressLine2) ? <Text style={styles.errorText}>{Error?.addressLine2}</Text> : null}
                    </View>
                </View>
                <View style={{ flexDirection: "row", margin: "2%" }}>
                    <View style={{ flexDirection: "column", width: "50%" }}>
                        <ProfileInput placeholder="City" value={city} settedValue={setCity} checkForChange={setchange} />
                        {(Error?.city) ? <Text style={styles.errorText}>{Error?.city}</Text> : null}
                    </View>
                    <View style={{ flexDirection: "column", width: "50%" }}>
                        <ProfileInput placeholder="State/Province" value={province} settedValue={setProvince} checkForChange={setchange} />
                        {(Error?.province) ? <Text style={styles.errorText}>{Error?.province}</Text> : null}
                    </View>
                </View>
                <View style={{ flexDirection: "row", margin: "2%" }}>
                    <View style={{ flexDirection: "column", width: "50%" }}>
                        <ProfileInput placeholder="Country" value={country} settedValue={setCountry} checkForChange={setchange} />
                        {(Error?.country) ? <Text style={styles.errorText}>{Error?.country}</Text> : null}
                    </View>
                    {/* <View style={{ flexDirection: "column", width: "50%" }}>
                    <ProfileInput placeholder="State/Province" value={province} settedValue={setProvince} />
                    {(Error?.province) ? <Text style={styles.errorText}>{Error?.province}</Text> : null}
                </View> */}
                </View>
                {/* <View style={{ margin: "3%" }}>
                <Text style={{ color: COLORS.primary, fontSize: RFValue(14), ...FONTS.robotoregular }}>Contact Information
                    <Text style={{ color: COLORS.black, fontSize: RFValue(10), ...FONTS.robotoregular }}> (Only for Admin/Instructor use)
                    </Text>
                </Text>
​
            </View>
            <View style={{ flexDirection: "row", marginHorizontal: "2%" }}>
                <View style={{ flexDirection: "column", width: "50%" }}>
                    <ProfileInput placeholder="Phone Number" value={phoneNumber} settedValue={setPhoneNumber} />
                </View>
                <View style={{ flexDirection: "column", width: "50%" }}>
                    <ProfileInput placeholder="Email" value={email} settedValue={setEmail} />
                </View>
            </View> */}
                <View style={{ margin: "3%" }}>
                    <Text style={{ color: COLORS.primary, fontSize: RFValue(14), ...FONTS.robotoregular }}>Social Links

                    </Text>
                </View>

                <View style={{ flexDirection: "row", width: "100%", margin: "2%" }}>
                    <ProfileInput placeholder="Facebook url" value={facebook} settedValue={setFacebook} checkForChange={setchange} />
                </View>
                <View style={{ flexDirection: "row", width: "100%", margin: "2%" }}>
                    <ProfileInput placeholder="Linkedin Url" value={linkedin} settedValue={setLinkedIn} checkForChange={setchange} />
                </View>

                <View style={{ flexDirection: "row", width: "100%", margin: "2%" }}>
                    <ProfileInput placeholder="Youtube Url" value={youtube} settedValue={setYoutube} checkForChange={setchange} />
                </View>
                <View style={{ flexDirection: "row", width: "100%", margin: "2%" }}>
                    <ProfileInput placeholder=" Twitter Url" value={twitter} settedValue={setTwitter} checkForChange={setchange} />
                </View>

                <TouchableOpacity
                    style={{ backgroundColor: COLORS.primary, width: "30%", borderRadius: 10, padding: "2%", marginTop: "5%", alignSelf: "center" }}
                    onPressIn={() => { handleSave() }}
                >
                    <Text style={{ color: COLORS.white, textAlign: "center", ...FONTS.robotoregular }}>Save Details</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ backgroundColor: "red", width: "96%", borderRadius: 10, padding: "4%", marginTop: "5%", alignSelf: "center" }}
                    onPressIn={() => { deactivateTwoButtonAlert() }}
                >
                    <View style={{ flexDirection: "row",alignSelf:"center"}}>
                        <MCIcon name="account-remove" size={RFValue(18)} color={COLORS.white} />
                        <Text style={{ color: COLORS.white,fontWeight:"700", textAlign: "center", ...FONTS.robotoregular,fontSize:RFValue(16) }}> Delete Account</Text>
                    </View>
                </TouchableOpacity>

            </ScrollView>
        </View>

    )
}
export default General;
const styles = StyleSheet.create({
    iconStyle: {
        fontSize: 40,
        marginTop: 30,
        color: 'black',
    },
    errorText: {
        color: "red",
        ...FONTS.robotoregular,
        fontSize: RFValue(10),
        paddingLeft: "2%"
    },
    overlay: {
        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: 0.5,
        backgroundColor: 'black',
        width: "100%",
        height: "100%",
        zIndex: 1,
        justifyContent: "center"
        , alignItems: "center"
    }
})