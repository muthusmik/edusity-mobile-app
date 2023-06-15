import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    TouchableOpacity, ScrollView, Alert, Keyboard, ToastAndroid
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { icons, COLORS, FONTS } from '../../../constants';
import { DeleteProfile, updateProfile } from '../../../services/userService';
import { useDispatch, useSelector } from 'react-redux';
import { metrices } from '../../../constants/metrices';
import { userLoginHanlder } from '../../../store/redux/userLogin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { unwrapResult } from '@reduxjs/toolkit';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import OverlayLoader from '../../../components/overlayLoader';
import { TextInput } from 'react-native-paper';

const ProfileInput = (props) => {
    const { label, placeholder, value, settedValue, setError, checkForChange } = props;
    const handleError = () => {
        if (label == "First name") {
            setError(prevState => ({ ...prevState, firstName: "" }))
        }
        else if (label == "Last name") {
            setError(prevState => ({ ...prevState, lastName: "" }))
        }
        else if (label == "Address line1") {
            setError(prevState => ({ ...prevState, addressLine1: "" }))
            setError({ ...{ "addressLine1": "" } })
        }
        else if (label == "Address line2") {
            setError(prevState => ({ ...prevState, addressLine2: "" }))
        }
        else if (label == "City") {
            setError(prevState => ({ ...prevState, city: "" }))
        }
        else if (label == "State/Province") {
            setError(prevState => ({ ...prevState, province: "" }))
        }
        else if (label == "Country") {
            setError(prevState => ({ ...prevState, country: "" }))
        }
        else if (label == "Facebook Url") {
            setError(prevState => ({ ...prevState, facebook: "" }))
        }
        else if (label == "Linkedin Url") {
            setError(prevState => ({ ...prevState, linkedin: "" }))
        }
        else if (label == "Youtube Url") {
            setError(prevState => ({ ...prevState, youtube: "" }))
        }
        else if (label == "Twitter Url") {
            setError(prevState => ({ ...prevState, twitter: "" }))
        }
    }

    return (
        <View style={{ width: "100%", borderRadius: 20, justifyContent: "center" }}>
            <TextInput
                theme={{ fonts: { regular: { fontFamily: 'Roboto-Regular' } }, colors: { primary: COLORS.primary, background: COLORS.white, text: COLORS.black, placeholder: COLORS.gray } }}
                mode='outlined'
                label={label}
                placeholder={placeholder}
                style={{ width: "100%", height: metrices(5.4) }}
                value={value}
                placeholderTextColor={COLORS.gray}
                onChangeText={e => { settedValue(e), checkForChange(true), handleError() }}
            />
        </View>
    )
}

const General = () => {

    const dispatch = useDispatch();
    const scrollRef = useRef(null);
    const navigation = useNavigation();
    // const Token = useSelector(state => state.loginHandle.data.data);
    const ProfileDetails = useSelector(state => state.userLoginHandle)
    const [Error, setError] = useState({});
    const [Token, setToken] = useState("");
    const [addLoader, setAddLoader] = useState(false);
    const [userDetails, setUserDetails] = useState();
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
        setIsKeyboardOpen(true);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        setIsKeyboardOpen(false);
    });
    useEffect(() => {
        const initialLoading = async () => {
            const newToken = await AsyncStorage.getItem("loginToken")
            setToken(newToken)
        }
        initialLoading();
    }, [])

    useEffect(() => {
        setUserDetails([ProfileDetails?.data?.data])
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

    const handleSave = () => {
        setAddLoader(true)
        const putProfile = async () => {
            if (checkForChange) {
                const Payload = {
                    addressLine1: addressLine1 ? addressLine1 : null,
                    addressLine2: addressLine2 ? addressLine2 : null,
                    bio: "Default bio for",
                    city: city ? city : null,
                    country: country ? country : null,
                    facebookProfile: facebook ? facebook : null,
                    firstName: firstName,
                    introduction: null,
                    introductionLink: null,
                    languages: null,
                    lastName: lastName,
                    linkedProfile: linkedin ? linkedin : null,
                    phoneNumber: phoneNumber,
                    publicLocation: null,
                    publicLocationCountry: null,
                    state: province ? province : null,
                    twitterProfile: twitter ? twitter : null,
                    youtubeProfile: youtube ? youtube : null,
                }
                let updateprofile = await updateProfile(Token, Payload).then(data => {
                    if (originalPromiseResult == "error") {
                        navigation.navigate("ServerError");
                    }
                    else if (data && data.error == true) {
                        setAddLoader(false);
                        ToastAndroid.showWithGravity(data.message, ToastAndroid.BOTTOM, ToastAndroid.LONG)
                    }
                    else {
                        dispatch(userLoginHanlder(Token)).then(unwrapResult).then((originalPromiseResult) => {
                            setchange(false);
                            setAddLoader(false);
                            if (originalPromiseResult.error == false) {
                                ToastAndroid.showWithGravity("User data updated successfully!", ToastAndroid.BOTTOM, ToastAndroid.LONG)
                            } else {
                                Alert.alert(
                                    "",
                                    "Something went wrong, Please try again later!",
                                    [{
                                        text: "Ok"
                                    }]
                                )
                            }
                        }).catch((rejectedValueOrSerializedError) => {
                            setAddLoader(false)
                            ToastAndroid.showWithGravity("Something went wrong, please try again later!", ToastAndroid.BOTTOM, ToastAndroid.LONG)
                        })
                    }
                }).catch((rejectedValueOrSerializedError) => {
                    setAddLoader(false)
                    ToastAndroid.showWithGravity("Something went wrong, please try again later!", ToastAndroid.BOTTOM, ToastAndroid.LONG)
                })
            } else {
                setAddLoader(false)
                Alert.alert(
                    "Alert",
                    "No Changes were made to Update!",
                    [{
                        text: "Ok"
                    }]
                )
            }
        }
        if (firstName && firstName.length >= 3 && firstName.length <= 15) {
            if (lastName && lastName.length >= 3 && lastName.length <= 15) {
                if (addressLine1 && addressLine1.length <= 100 && addressLine1.length >= 3 || !addressLine1) {
                    if (addressLine2 && addressLine2.length <= 100 && addressLine2.length >= 3 || !addressLine2) {
                        if (city && city.length <= 30 && city.length >= 3 || !city) {
                            if (province && province.length <= 30 && province.length >= 3 || !province) {
                                if (country && country.length <= 30 && country.length >= 2 || !country) {
                                    if (facebook && urlRegex.test(facebook) || !facebook) {
                                        if (linkedin && linkedin.length <= 30 && linkedin.length >= 2 && urlRegex.test(linkedin) || !linkedin) {
                                            if (youtube && youtube.length <= 30 && youtube.length >= 2 && urlRegex.test(youtube) || !youtube) {
                                                if (twitter && twitter.length <= 30 && twitter.length >= 2 && urlRegex.test(twitter) || !twitter) {
                                                    putProfile();
                                                    setError("");
                                                }
                                                else {
                                                    setError(prevState => ({ ...prevState, twitter: "Given twitter url is not a valid url" }))
                                                    if (contentVerticalOffset > 80) {
                                                        scrollRef?.current.scrollTo({ y: 180, animated: true })
                                                    };
                                                    setAddLoader(false)
                                                }
                                            }
                                            else {
                                                setError(prevState => ({ ...prevState, youtube: "Given youtube url is not a valid url" }))
                                                if (contentVerticalOffset > 80) {
                                                    scrollRef?.current.scrollTo({ y: 160, animated: true })
                                                };
                                                setAddLoader(false)
                                            }
                                        }
                                        else {
                                            setError(prevState => ({ ...prevState, linkedin: "Given linkedin url is not a valid url" }))
                                            if (contentVerticalOffset > 80) {
                                                scrollRef?.current.scrollTo({ y: 140, animated: true })
                                            };
                                            setAddLoader(false)
                                        }
                                    }
                                    else {
                                        setError(prevState => ({ ...prevState, facebook: "Given facebook url is not a valid url" }))
                                        if (contentVerticalOffset > 80) {
                                            scrollRef?.current.scrollTo({ y: 100, animated: true })
                                        };
                                        setAddLoader(false)
                                    }
                                }
                                else {
                                    setError(prevState => ({ ...prevState, country: "Country must not exceed more than 30 characters and must have min 2 characters!" }))
                                    if (contentVerticalOffset > 80) {
                                        scrollRef?.current.scrollTo({ y: 0, animated: true })
                                    };
                                    setAddLoader(false)
                                }
                            }
                            else {
                                setError(prevState => ({ ...prevState, province: "Province must not exceed more than 30 characters and must have min 3 characters!" }))
                                if (contentVerticalOffset > 80) {
                                    scrollRef?.current.scrollTo({ y: 0, animated: true })
                                };
                                setAddLoader(false)
                            }
                        }
                        else {
                            setError(prevState => ({ ...prevState, city: "City must not exceed more than 30 characters and must have min 3 characters!" }))
                            if (contentVerticalOffset > 80) {
                                scrollRef?.current.scrollTo({ y: 0, animated: true })
                            };
                            setAddLoader(false)
                        }
                    }
                    else {
                        setError(prevState => ({ ...prevState, addressLine2: "Address should have min 3 and must not exceed more than 100 characters!" }))
                        if (contentVerticalOffset > 80) {
                            scrollRef?.current.scrollTo({ y: 0, animated: true })
                        };
                        setAddLoader(false)
                    }
                }
                else {
                    setError(prevState => ({ ...prevState, addressLine1: "Address must not exceed more than 100 characters!" }))
                    if (contentVerticalOffset > 80) {
                        scrollRef?.current.scrollTo({ y: 0, animated: true })
                    };
                    setAddLoader(false)
                }
            }
            else {
                setError(prevState => ({ ...prevState, lastName: "Lastname should have min 3 characters and should not exceed more than 15 characters!" }))
                if (contentVerticalOffset > 80) {
                    scrollRef?.current.scrollTo({ y: 0, animated: true })
                };
                setAddLoader(false)
            }
        }
        else {
            setError(prevState => ({ ...prevState, firstName: "Firstname should have min 3 characters and should not exceed more than 15 characters!" }))
            if (contentVerticalOffset > 80) {
                scrollRef?.current.scrollTo({ y: 0, animated: true })
            };
            setAddLoader(false)
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
        await DeleteProfile(Token).then(response => {
            AsyncStorage.removeItem("loginToken");
            navigation.navigate("Home", { screen: "Search" })
        })
    }


    return (
        <View style={{ height: metrices(56.5), backgroundColor: COLORS.white }}>
            {addLoader ? <OverlayLoader /> : null}
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: isKeyboardOpen ? metrices(14) : 0 }}
                ref={scrollRef}
                onScroll={event => {
                    setContentVerticalOffset(event.nativeEvent.contentOffset.y);
                }}
            >
                <View style={{ margin: "3%" }}>
                    <Text style={{ color: COLORS.primary, fontSize: RFValue(14), ...FONTS.robotoregular }}>Public Profile</Text>
                    <Text style={{ color: COLORS.black, fontSize: RFValue(10), ...FONTS.robotoregular }}>Tell Us Something About Yourself..</Text>
                </View>
                <View style={styles.textInputTwo}>
                    <View style={styles.textInputBoxStyle}>
                        <ProfileInput label="First name" placeholder="First name" value={firstName} settedValue={setFirstName} setError={setError} checkForChange={setchange} />
                        {(Error?.firstName) ? <Text style={styles.errorText}>{Error?.firstName}</Text> : null}
                    </View>
                    <View style={styles.textInputBoxStyle}>
                        <ProfileInput label="Last name" placeholder="Last name" value={lastName} settedValue={setLastName} setError={setError} checkForChange={setchange} />
                        {(Error?.lastName) ? <Text style={styles.errorText}>{Error?.lastName}</Text> : null}
                    </View>
                </View>
                <View style={styles.textInputTwo}>
                    <View style={styles.textInputBoxStyle}>
                        <ProfileInput label="Address line1" placeholder="Address line1" value={addressLine1} settedValue={setAddressLine1} checkForChange={setchange} setError={setError} />
                        {(Error?.addressLine1) ? <Text style={styles.errorText}>{Error?.addressLine1}</Text> : null}
                    </View>
                    <View style={styles.textInputBoxStyle}>
                        <ProfileInput label="Address line2" placeholder="Address line2" value={addressLine2} settedValue={setAddressLine2} checkForChange={setchange} setError={setError} />
                        {(Error?.addressLine2) ? <Text style={styles.errorText}>{Error?.addressLine2}</Text> : null}
                    </View>
                </View>
                <View style={styles.textInputTwo}>
                    <View style={styles.textInputBoxStyle}>
                        <ProfileInput label="City" placeholder="City" value={city} settedValue={setCity} checkForChange={setchange} setError={setError} />
                        {(Error?.city) ? <Text style={styles.errorText}>{Error?.city}</Text> : null}
                    </View>
                    <View style={styles.textInputBoxStyle}>
                        <ProfileInput label="State/Province" placeholder="State/Province" value={province} settedValue={setProvince} checkForChange={setchange} setError={setError} />
                        {(Error?.province) ? <Text style={styles.errorText}>{Error?.province}</Text> : null}
                    </View>
                </View>
                <View style={styles.textInputTwo}>
                    <View style={styles.textInputBoxStyle}>
                        <ProfileInput label="Country" placeholder="Country" value={country} settedValue={setCountry} checkForChange={setchange} setError={setError} />
                        {(Error?.country) ? <Text style={styles.errorText}>{Error?.country}</Text> : null}
                    </View>
                    {/* <View style={styles.textInputBoxStyle}>
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
                <View style={styles.textInputBoxStyle}>
                    <ProfileInput placeholder="Phone Number" value={phoneNumber} settedValue={setPhoneNumber} />
                </View>
                <View style={styles.textInputBoxStyle}>
                    <ProfileInput placeholder="Email" value={email} settedValue={setEmail} />
                </View>
            </View> */}
                <View style={{ margin: "3%" }}>
                    <Text style={{ color: COLORS.primary, fontSize: RFValue(14), ...FONTS.robotoregular }}>Social Links</Text>
                </View>

                <View style={styles.textInputTwo}>
                    <View style={[styles.textInputBoxStyle, { width: "100%" }]}>
                        <ProfileInput label="Facebook Url" placeholder="Facebook Url" value={facebook} settedValue={setFacebook} checkForChange={setchange} setError={setError} />
                        {(Error?.facebook) ? <Text style={styles.errorText}>{Error?.facebook}</Text> : null}
                    </View>
                </View>
                <View style={styles.textInputTwo}>
                    <View style={[styles.textInputBoxStyle, { width: "100%" }]}>
                        <ProfileInput label="Linkedin Url" placeholder="Linkedin Url" value={linkedin} settedValue={setLinkedIn} checkForChange={setchange} setError={setError} />
                        {(Error?.linkedin) ? <Text style={styles.errorText}>{Error?.linkedin}</Text> : null}
                    </View>
                </View>

                <View style={styles.textInputTwo}>
                    <View style={[styles.textInputBoxStyle, { width: "100%" }]}>
                        <ProfileInput label="Youtube Url" placeholder="Youtube Url" value={youtube} settedValue={setYoutube} checkForChange={setchange} setError={setError} />
                        {(Error?.youtube) ? <Text style={styles.errorText}>{Error?.youtube}</Text> : null}
                    </View>
                </View>
                <View style={styles.textInputTwo}>
                    <View style={[styles.textInputBoxStyle, { width: "100%" }]}>
                        <ProfileInput label="Twitter Url" placeholder="Twitter Url" value={twitter} settedValue={setTwitter} checkForChange={setchange} setError={setError} />
                        {(Error?.twitter) ? <Text style={styles.errorText}>{Error?.twitter}</Text> : null}
                    </View>
                </View>

                <TouchableOpacity style={[styles.deleteButton, { backgroundColor: COLORS.edusity }]}
                    onPressIn={() => { handleSave() }}
                >
                    <Text style={styles.buttonText}>Save Details</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.deleteButton, { marginBottom: 12 }]}
                    onPressIn={() => { deactivateTwoButtonAlert() }}
                >
                    <MCIcon name="account-remove" size={RFValue(18)} color={COLORS.white} />
                    <Text style={styles.buttonText}>  Delete Account</Text>
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
    textInputTwo: {
        flexDirection: "row",
        width: "90%",
        alignSelf: "center",
        justifyContent: "space-between",
        marginBottom: 6
    },
    textInputBoxStyle: {
        flexDirection: "column",
        width: "48.5%"
    },
    deleteButton: {
        backgroundColor: "red",
        width: "50%",
        paddingVertical: 8,
        borderRadius: 10,
        flexDirection: "row",
        marginTop: 10,
        justifyContent: "center",
        alignSelf: "center"
    },
    buttonText: {
        color: COLORS.white,
        textAlign: "center",
        ...FONTS.robotoregular,
        fontSize: RFValue(16)
    }
})