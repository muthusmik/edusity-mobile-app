import React, { useState } from 'react';
import {
    View,
    TextInput,
    Button,
    Text,
    StyleSheet
} from 'react-native';
import Top_Bar from '../../../components/topBar';
import { metrices } from '../../../constants/metrices';
import { COLORS, FONTS } from '../../../constants';

const TakeNotesScreen = () => {

    const [noteText, setNoteText] = useState("");
    const [savedNotes, setSavedNotes] = useState(false);
    const [toShow, setToShow] = useState("");

    const stylesFromPage = {
        height: metrices(8),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: COLORS.primary,
        borderBottomStartRadius: 30,
        borderBottomEndRadius: 30,
        paddingRight: 26,
        paddingLeft: 18
    }
    const handleSave = () => {
        setSavedNotes(true)
        setToShow(noteText)
        setNoteText("")
    }

    return (
        <>
            <Top_Bar backPage={0} stylesFromPage={stylesFromPage} title={"Notes"} />
            <View style={{ width: "86%", alignSelf: "center" }}>
                <TextInput
                    placeholder="Enter your notes"
                    value={noteText}
                    onChangeText={(e) => setNoteText(e)}
                    style={styles.textInput}
                />
                <View style={styles.button}>
                    <Button title="Save Note" color={COLORS.edusity} onPress={handleSave} />
                </View>
                {savedNotes &&
                    <View style={styles.savedNotes}>
                        <Text style={styles.textStyle}>{toShow}</Text>
                    </View>
                }
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    textInput: {
        width: "100%",
        ...FONTS.robotoregular,
        fontSize: 18,
        color: COLORS.black,
        marginVertical: metrices(1),
        borderBottomWidth: 2
    },
    button: {
        width: 200,
        alignSelf: "center",
        marginTop: metrices(3)
    },
    textStyle: {
        ...FONTS.robotoregular,
        fontSize: 18,

    },
    savedNotes: {
        borderWidth: 1,
        marginVertical: metrices(1),
        padding: 8,
        borderRadius: 5,
        marginTop: metrices(4)
    }
})

export default TakeNotesScreen;