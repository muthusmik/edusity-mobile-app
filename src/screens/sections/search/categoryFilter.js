import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Pressable,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, icons } from "../../../constants";
import { useDispatch } from "react-redux";
import { RFValue } from "react-native-responsive-fontsize";
import { CategoryList } from "../../../constants/staticData/categoryList";
import SelectDropdown from 'react-native-select-dropdown'

export const CategoryFilter = (props) => {
    
    const { selectedCategory, setSelectedCategory } = props;
    const [index, setIndex] = useState(null);
    const [open, setopen] = useState(true);

    return (
        <>
            <View style={{ flexDirection: "row", width: "94%", marginHorizontal: "2%", marginVertical: "2%", justifyContent: "space-between", }}>
                <SelectDropdown
                    data={CategoryList}
                    defaultValue={selectedCategory}
                    onSelect={(selectedItem, index) => {
                        setSelectedCategory(selectedItem);
                        // console.log(selectedItem,"selected item");
                        setIndex(index)
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        // console.log(selectedItem.url,"url")
                        // text represented after item is selected
                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                        return selectedItem.label
                    }}
                    rowTextForSelection={(item, index) => {
                        // text represented for each item in dropdown
                        // if data array is an array of objects then return item.property to represent item in dropdown
                        return item.label
                    }}
                    dropdownStyle={{ height: "20%", width: "80%" }}
                    searchInputStyle={{ width: "80%", backgroundColor: COLORS.white, borderWidth: 1, ...FONTS.robotoregular }}
                    buttonStyle={styles.categoryContainer}
                />

            </View>

        </>
    );
}

const styles = StyleSheet.create({
    mapContent: {
        borderColor: COLORS.white,
        shadowOffset: { width: -2, height: 4 },
        shadowColor: '#FFFF',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        margin: "2%",
        flexDirection: "row",
        width: "100%",
        borderRadius: 5,
        borderWidth: 1,
        // justifyContent:"space-between",
        padding: "10%"
    },
    categoryContainer: {
        width: "100%",
        color: COLORS.black,
        backgroundColor: COLORS.white,
        borderColor: COLORS.white,
        borderRadius: 5,
        height: "100%",
        padding: "5%"
    }
})