import React, { useState } from 'react';
import {
    View,
    Text, Image,
    TouchableOpacity,
    StatusBar, ScrollView, FlatList, StyleSheet, Pressable,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import { images, icons, COLORS, FONTS, SIZES } from '../../../constants';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { useNavigation } from '@react-navigation/native';
const SearchBar = () => {
    // console.log("iam inside SearchBar");
    const [selectedItem, setSelectedItem] = useState(null);
    const navigation = useNavigation();
    return (
        <View style={styles.mainContainer}>
            <View style={{ height: "100%", alignItems: "center", justifyContent: "center", width: "90%" }}>
                <Pressable onPress={() => navigation.navigate("SearchScreen")} style={styles.searchContainer}>
                    <MCIcon name="layers-search" size={30} color={COLORS.black} style={{ flexDirection: "column", width: "12%" }} />
                    {/* 
                    <AutocompleteDropdown
                        clearOnFocus={false}
                        closeOnBlur={true}
                        closeOnSubmit={false}
                        initialValue={{ id: '2' }} // or just '2'
                        onSelectItem={setSelectedItem}
                        dataSet={[
                            { id: '1', title: 'Alpha' },
                            { id: '2', title: 'Beta' },
                            { id: '3', title: 'Gamma' },
                        ]}
                    /> */}
                    <TextInput
                        style={{ color: COLORS.black, }}
                        placeholder="Search what you want to learn today"
                        placeholderTextColor={COLORS.gray}
                        underlineColor="transparent">
                    </TextInput>
                </Pressable>
            </View>
        </View>

    );
}
const styles = StyleSheet.create({

    mainContainer: {
        backgroundColor: COLORS.primary,
        height: "100%",
        width: "100%",
        borderBottomStartRadius: 5,
        borderBottomEndRadius: 5,
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 2.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    searchContainer: {

        backgroundColor: COLORS.white,
        height: "60%",
        borderRadius: 25,
        width: "90%",
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#FFFF",
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
export default SearchBar;