import React from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import { COLORS } from '../constants';
import LoaderKit from 'react-native-loader-kit';

const OverlayLoader = () => {
    return (
        <View style={styles.overlay} >
            <LoaderKit
                style={{ width: 50, height: 50, position: 'absolute' }}
                name={'BallPulse'}
                size={50}
                color={COLORS.white}
            />
        </View>
    );
}

const styles = StyleSheet.create({
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
        justifyContent: "center",
        alignItems: "center"
    }
})
export default OverlayLoader;