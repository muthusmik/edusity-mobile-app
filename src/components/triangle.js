import React from 'react';
import { View } from 'react-native';
import { COLORS } from '../constants';

const Triangle = ({ area }) => {
    return (
        <View style={{
            width: 0,
            height: 0,
            borderLeftWidth: area / 2,
            position: "absolute",
            zIndex: 2,
            borderRightWidth: area / 2,
            borderBottomWidth: area,
            bottom: 64,
            alignSelf: "flex-end",
            right: 8,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: COLORS.gray,
        }} />
    );
};

export default Triangle;
