import React, { useEffect, useState } from 'react';
import {
    View,
    Text, Image,
    TouchableOpacity,
    ImageBackground, ActivityIndicator,
    StatusBar, ScrollView, FlatList, StyleSheet, KeyboardAvoidingView, Pressable,
} from 'react-native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { COLORS } from '../constants';
import { RFValue } from 'react-native-responsive-fontsize';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from "@react-navigation/core";
import NetInfo from '@react-native-community/netinfo';

const ViPlayer = ({ route }) => {

    const videoLink = route.params;
    // console.log(videoLink, "LINk");
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [network, setNetwork] = useState('')

    useEffect(()=>{
        if (isFocused) {
            NetInfo.refresh().then(state => {
                setNetwork(state.isConnected)
                if (!state.isConnected) {
                    navigation.navigate("NetworkError");
                }
                // else {
                //     navigation.navigate("NetworkError");
                // }
            })
        }
    },[isFocused,network])

    return (
        <View style={{ backgroundColor: COLORS.black }}>
             <StatusBar
                        animated={true}
                        backgroundColor={COLORS.primary}
                    />
                     {Platform.OS=='ios'?
                    <View style={{height:"5%"}}>

                    </View>:null}
            <View style={{ width: "100%", height: "5%",}}>
                <TouchableOpacity style={{ flexDirection: "column", alignItems: "flex-start", width: "8%", justifyContent: "center", borderWidth: 0, marginLeft: "5%" }}
                    onPress={() => navigation.goBack()}
                >
                    <MCIcon name="keyboard-backspace" size={RFValue(25)} color={COLORS.white} />
                </TouchableOpacity>
            </View>
            <View style={{ height: "95%", width: "100%",alignContent:"center" }}>
                <Video
                    controls={true}
                    resizeMode="contain"
                    source={{ uri: "https://cdn.edusity.com/" + videoLink }}
                    style={{ width: "100%", height: "100%" }}
                />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    mainContainer: {
        height: "100%",
        width: "100%",
    },
    listItem: {
        flex: 1,
        marginTop: ".5%",
        padding: 22,
        backgroundColor: COLORS.white,
        width: '100%',
        flexDirection: 'row',
        height: 130,
        lineHeight: "1.5",
        shadowColor: "#000",
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
});
export default ViPlayer;