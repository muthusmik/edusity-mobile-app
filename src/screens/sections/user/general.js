import React, { useState, useEffect ,useRef} from 'react';
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    TextInput, TouchableOpacity, ScrollView, Alert
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { icons, COLORS, FONTS } from '../../../constants';
import { updateProfile } from '../../../services/userService';
import { useDispatch, useSelector } from 'react-redux';
import { userLoginHanlder } from '../../../store/redux/userLogin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { unwrapResult } from '@reduxjs/toolkit';

const ProfileInput = (props) => {
    const { placeholder, value, settedValue } = props;

    console.log(value, placeholder)
    return (
        <View style={{ borderBottomWidth: 1, width: "90%", borderRadius: 20, justifyContent: "center", }}>
            <TextInput
                placeholder={placeholder}
                style={{ marginHorizontal: 10, ...FONTS.robotoregular }}
                value={value}
                placeholderTextColor={COLORS.gray}
                selectionColor={COLORS.blue}
                onChangeText={e => { settedValue(e) }} />
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
    const scrollRef = useRef(null);

    useEffect(() => {
        const initialLoading = async () => {
            const newToken = await AsyncStorage.getItem("loginToken")
            setToken(newToken)
        }
        initialLoading();
    }, [])

    useEffect(() => {
        console.log(ProfileDetails, "hhhh")
        setUserDetails([ProfileDetails?.data?.data])
        console.log("data success", [ProfileDetails?.data?.data][0].phoneNumber)
    }, [ProfileDetails])
    
    const [contentVerticalOffset, setContentVerticalOffset] = useState(null);


    const [firstName, setFirstName] = useState([ProfileDetails?.data?.data][0].firstName);
    const [lastName, setLastName] = useState([ProfileDetails?.data?.data][0].lastName);
    const [addressLine1, setAddressLine1] = useState([ProfileDetails?.data?.data][0].addressLine1);
    const [addressLine2, setAddressLine2] = useState([ProfileDetails?.data?.data][0].addressLine2);
    const [city, setCity] = useState([ProfileDetails?.data?.data][0].city);
    const [province, setProvince] = useState([ProfileDetails?.data?.data][0].state);
    const [country, setCountry] = useState("IN");
    const [phoneNumber, setPhoneNumber] = useState([ProfileDetails?.data?.data][0].phoneNumber);
    const [email, setEmail] = useState([ProfileDetails?.data?.data][0].email);
    const [facebook, setFacebook] = useState([ProfileDetails?.data?.data][0].facebookProfile);
    const [linkedin, setLinkedIn] = useState([ProfileDetails?.data?.data][0].linkedProfile);
    const [youtube, setYoutube] = useState([ProfileDetails?.data?.data][0].youtubeProfile);
    const [twitter, setTwitter] = useState([ProfileDetails?.data?.data][0].twitterProfile);



    const handleSave = () => {
        const putProfile = async () => {
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
                console.log(data.data, "hello");
                // setError("");
                dispatch(userLoginHanlder(Token)).then(unwrapResult).then((originalPromiseResult) => {
                    if(!originalPromiseResult.erroCode){
                        Alert.alert(
                            "",
                            "Successfully Updated!",
                            [{
                                text:"OK"
                            }]
                        );
                      }else{
                        Alert.alert(
                            "",
                            "Something went wrong, Please try again later!",
                            [{
                                text:"Ok"
                            }]
                            )
                      }
                }
                )
                .catch((rejectedValueOrSerializedError) => {
                    Alert.alert(
                        "",
                        "Something went wrong, Please try again later!",
                        [{
                            text:"Ok"
                        }]
                        )
                })
            })
        }       
        // console.log("First name jbubbub", firstName == "");
        if(firstName.length>=3){
            if(lastName.length>=3){
                putProfile();
                setError("");
            }
            else{
                setError({"lastName":"Minimum 3 characters is required!"})
                if (contentVerticalOffset > 80) { 
                    scrollRef?.current.scrollTo({ y: 0, animated: true }) 
                };

            }
        }
        else{
            setError({"firstName":"Minimum 3 characters is required!"})
            if (contentVerticalOffset > 80) {
                scrollRef?.current.scrollTo({ y: 0, animated: true }) 
            };

        }
    }



    return (
        <ScrollView contentContainerStyle={{paddingBottom:"40%"}}
            ref={scrollRef}
            onScroll={event => {
                setContentVerticalOffset(event.nativeEvent.contentOffset.y);
            }}
        >
            <View style={{ margin: "3%" }}>
                <Text style={{ color: COLORS.primary, fontSize: RFValue(14), ...FONTS.robotoregular }}>Public Profile</Text>
                <Text style={{ color: COLORS.black, fontSize: RFValue(10), ...FONTS.robotoregular }}>Add short description about yourself</Text>
            </View>
            <View style={{ flexDirection: "row", margin: "2%" }}>
                <View style={{ flexDirection: "column", width: "50%" }}>
                    <ProfileInput placeholder="First Name" value={firstName} settedValue={setFirstName} setError={setError} />
                    {(Error?.firstName) ? <Text style={styles.errorText}>{Error?.firstName}</Text> : null}
                </View>
                <View style={{ flexDirection: "column", width: "50%" }}>
                    <ProfileInput placeholder="Last Name" value={lastName} settedValue={setLastName} setError={setError} />
                    {(Error?.lastName) ? <Text style={styles.errorText}>{Error?.lastName}</Text> : null}
                </View>
            </View>
            <View style={{ flexDirection: "row", margin: "2%" }}>
                <View style={{ flexDirection: "column", width: "50%" }}>
                    <ProfileInput placeholder="Address Line1" value={addressLine1} settedValue={setAddressLine1} />
                </View>
                <View style={{ flexDirection: "column", width: "50%" }}>
                    <ProfileInput placeholder="Address Line2" value={addressLine2} settedValue={setAddressLine2} />
                </View>
            </View>
            <View style={{ flexDirection: "row", margin: "2%" }}>
                <View style={{ flexDirection: "column", width: "50%" }}>
                    <ProfileInput placeholder="City" value={city} settedValue={setCity} />
                </View>
                <View style={{ flexDirection: "column", width: "50%" }}>
                    <ProfileInput placeholder="state Province" value={province} settedValue={setProvince} />
                </View>
            </View>
            {/* <View style={{ margin: "3%" }}>
                <Text style={{ color: COLORS.primary, fontSize: RFValue(14), ...FONTS.robotoregular }}>Contact Information
                    <Text style={{ color: COLORS.black, fontSize: RFValue(10), ...FONTS.robotoregular }}> (Only for Admin/Instructor use)
                    </Text>
                </Text>

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
                <ProfileInput placeholder="Facebook url" value={facebook} settedValue={setFacebook} />
            </View>
            <View style={{ flexDirection: "row", width: "100%", margin: "2%" }}>
                <ProfileInput placeholder="Linkedin Url" value={linkedin} settedValue={setLinkedIn} />
            </View>


            <View style={{ flexDirection: "row", width: "100%", margin: "2%" }}>
                <ProfileInput placeholder="Youtube Url" value={youtube} settedValue={setYoutube} />
            </View>
            <View style={{ flexDirection: "row", width: "100%", margin: "2%" }}>
                <ProfileInput placeholder=" Twitter Url" value={twitter} settedValue={setTwitter} />
            </View>

            <TouchableOpacity
                style={{ backgroundColor: COLORS.primary, width: "30%", borderRadius: 10, padding: "2%", marginTop: "5%", alignSelf: "center" }}
                onPressIn={() => { handleSave() }}
            >
                <Text style={{ color: COLORS.white, textAlign: "center", ...FONTS.robotoregular }}>Save Details</Text>
            </TouchableOpacity>

        </ScrollView>

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
    }
})