import React from 'react';
import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity, Image,
} from 'react-native';

import { RFValue } from 'react-native-responsive-fontsize';
import { icons, COLORS, images, FONTS } from '../../../constants';
// import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import LinearGradient from 'react-native-linear-gradient';
const AddCard = () => {

    const ProfileInput = (props) => {
        const { placeholder } = props;
        return (
            <View style={{ width: "100%", justifyContent: "center", }}>
                <TextInput
                    placeholder={placeholder}
                    style={{ marginHorizontal: 10, ...FONTS.robotoregular,borderBottomWidth:1,borderRadius:6 }}
                    placeholderTextColor={COLORS.gray}
                    selectionColor={COLORS.blue}
                    onChangeText={e => console.log(e)} />
            </View>
        )
    }

    const onFocus = () => {
        console.log("hello")
    }
    const onChange = () => {
        console.log("hebrews")
    }
    return (
        <View style={{paddingBottom:"35%"}}>

            <View style={{ width: "100%", marginVertical: "8%" }}>
                <LinearGradient
                    style={[{ flex: 1, borderRadius: 10, height: 200, marginHorizontal: "5%" }]}
                    colors={['#939393', '#717171']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={{ flexDirection: "row", width: "90%", margin: "2%", }}>
                        <Image source={images.chip} resizeMode="cover" style={{ height: 45, width: 45, marginLeft: "5%" }} />
                    </View>
                    <View style={{ flexDirection: "row", width: "90%", marginHorizontal: "10%", marginVertical: "4%" }}>
                        <Text style={{ fontSize: RFValue(40), color: "#fff" }}>•••• •••• •••• ••••</Text>
                    </View>
                    <View style={{ flexDirection: "row", width: "90%", marginHorizontal: "10%", }}>
                        <View style={{ flexDirection: "column", width: "45%", marginVertical: "4%", alignItems: "flex-start", justifyContent: "center" }}>
                            <Text style={{ fontSize: RFValue(12), color: "#fff", justifyContent: "flex-start" ,...FONTS.robotomedium}}>Your Name Here</Text>
                        </View>
                        <View style={{ flexDirection: "column", width: "45%", alignItems: "flex-end" }}>
                            <Text style={{ fontSize: RFValue(8), color: "#fff",...FONTS.robotomedium }}>valid till</Text>
                            <Text style={{ fontSize: RFValue(20), color: "#fff", }}>••/••</Text>
                        </View>
                    </View>

                </LinearGradient>
                {/* <CreditCardInput
                        autoFocus
                        requireName={true}
                        requireCVC={true}
                        requirePostalCode={true}
                        validColor="black"
                        invalidColor="red"
                        placeholderColor="black"
                        labelStyle={{color:'black',fontSize:RFValue(12)}}
                        inputStyle={{color:'black',fontSize:RFValue(12)}}
                        onFocus={()=>onFocus()}
                        onChange={()=>onChange()}
                /> */}
            </View>

            <View style={{height:"63%"}}>
                <View style={{ marginHorizontal: "2%" }}>
                    <View style={{ flexDirection: "column", width: "100%" }}>
                        <ProfileInput placeholder="Credit Card Number" />
                    </View>
                    <View style={{ flexDirection: "column", width: "100%" }}>
                        <ProfileInput placeholder="Name on Card" />
                    </View>
                    <View style={{ flexDirection: "row", }}>
                        <View style={{ flexDirection: "column", width: "50%" }}>
                            <ProfileInput placeholder="MM/YY" />
                        </View>
                        <View style={{ flexDirection: "column", width: "50%" }}>
                            <ProfileInput placeholder="CVV" />
                        </View>
                    </View>

                </View>

                <View style={{ flexDirection: "row", margin: "2%" }}>
                    <View style={{ flexDirection: "column", width: "50%" }}>
                        <ProfileInput placeholder="Address Line 1" />
                    </View>
                    <View style={{ flexDirection: "column", width: "50%" }}>
                        <ProfileInput placeholder="Address Line 2" />
                    </View>
                </View>
                <View style={{ flexDirection: "row", margin: "2%" }}>
                    <View style={{ flexDirection: "column", width: "50%" }}>
                        <ProfileInput placeholder="City" />
                    </View>
                    <View style={{ flexDirection: "column", width: "50%" }}>
                        <ProfileInput placeholder="State or Province" />
                    </View>
                </View>
                <View style={{ flexDirection: "row", margin: "2%" }}>
                    <View style={{ flexDirection: "column", width: "50%" }}>
                        <ProfileInput placeholder="Postal or Zip code" />
                    </View>
                    <View style={{ flexDirection: "column", width: "50%" }}>
                        <ProfileInput placeholder="Country" />
                    </View>
                </View>
                <TouchableOpacity style={{backgroundColor:COLORS.primary,width:"30%",borderRadius:10,padding:"2%",marginTop:"5%",alignSelf:"center" }}>
                    <Text style={{ color: COLORS.white,...FONTS.robotoregular,textAlign:"center" }}>Add Card</Text>
                </TouchableOpacity>
            </View>
        </View>



    );
}
export default AddCard;
const styles = StyleSheet.create({
    iconStyle: {
        fontSize: 40,
        marginTop: 30,
        color: 'black',
    },
})