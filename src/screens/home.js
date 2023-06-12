
import React from 'react';
import { useSelector } from 'react-redux';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../constants';
import { RFValue } from 'react-native-responsive-fontsize';



const Home = () => {
    const loginData = useSelector(state => state.loginHandle);
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ height: "100%", width: "100%", alignItems: "center", marginTop: "80%" }}>
                <Text style={{ color: COLORS.black, justifyContent: "center", fontSize: RFValue(30, 580), fontWeight: "600", lineHeight: 100 }}>Welcome to</Text>
                <Text style={{ color: "#8830c4", justifyContent: "center", fontSize: RFValue(40, 580), fontWeight: "800", ...FONTS.largeTitle }}>Edusity</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.back,
    },

});

export default Home;
