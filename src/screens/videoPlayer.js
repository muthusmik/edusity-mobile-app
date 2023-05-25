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
import { metrices } from '../constants/metrices'
const ViPlayer = ({ route }) => {

    const videoLink = route.params;
    // console.log(videoLink, "LINk");
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [network, setNetwork] = useState('')

    useEffect(() => {
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
    }, [isFocused, network])

    return (
        <View style={{ backgroundColor: COLORS.black }}>
            <StatusBar
                animated={true}
                backgroundColor={COLORS.primary}
            />
            {Platform.OS == 'ios' ? <View style={{ padding: "5%" }} /> : null}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <MCIcon name="keyboard-backspace" size={RFValue(25)} color={COLORS.white} />
                </TouchableOpacity>
            </View>
            <View style={styles.video}>
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
    header: {
        width: "100%",
        height: metrices(6),
        justifyContent: "center",
        paddingLeft: 18
    },
    video: {
        height: metrices(94),
        width: "100%",
        alignContent: "center"
    }
});
export default ViPlayer;