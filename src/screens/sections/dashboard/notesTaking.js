import React, { useState } from 'react';
import {
    View,
    TextInput,
    Button,
    Text,
    KeyboardAvoidingView,
    StyleSheet,
    ScrollView,
    Platform
} from 'react-native';
import Top_Bar from '../../../components/topBar';
import { metrices } from '../../../constants/metrices';
import { COLORS, FONTS } from '../../../constants';
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";

const TakeNotesScreen = () => {

    const richText = React.useRef();

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
            <View style={{ width: "90%", alignSelf: "center", height: "90%" }}>
                <View style={{ marginTop: 10, height: "40%" }}>
                    <View>
                        <RichToolbar
                            editor={richText}
                            actions={[
                                actions.undo,
                                actions.redo,
                                actions.setBold,
                                actions.setItalic,
                                actions.setUnderline,
                                actions.alignCenter,
                                actions.alignFull,
                                actions.alignLeft,
                                actions.alignRight,
                                actions.heading1,
                                actions.heading2,
                                actions.heading3,
                                actions.heading4,
                                actions.heading5,
                                actions.heading6,
                                actions.removeFormat,
                            ]}
                            iconMap={{
                                [actions.heading1]: () => <Text style={{ fontWeight: 'bold' }}>H1</Text>,
                                [actions.heading2]: () => <Text style={{ fontWeight: 'bold' }}>H2</Text>,
                                [actions.heading3]: () => <Text style={{ fontWeight: 'bold' }}>H3</Text>,
                                [actions.heading4]: () => <Text style={{ fontWeight: 'bold' }}>H4</Text>,
                                [actions.heading5]: () => <Text style={{ fontWeight: 'bold' }}>H5</Text>,
                                [actions.heading6]: () => <Text style={{ fontWeight: 'bold' }}>H6</Text>,
                            }}
                        />
                    </View>

                    <View style={styles.editorContainer}>
                        <ScrollView>
                            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                                <RichEditor
                                    ref={richText}
                                    placeholder='Enter your notes'
                                    onChange={descriptionText => {
                                        setNoteText(descriptionText);
                                        console.log("descriptionText:", descriptionText);
                                    }}
                                />
                            </KeyboardAvoidingView>
                        </ScrollView>
                    </View>
                </View>
                {/* <TextInput
                    placeholder="Enter your notes"
                    value={noteText}
                    onChangeText={(e) => setNoteText(e)}
                    style={styles.textInput}
                />*/}
                <View style={styles.buttonContainer}>
                    <Button title="Save Note" disabled={true} color={COLORS.edusity} onPress={handleSave} />
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
    buttonContainer: {
        width: 200,
        alignSelf: "center",
        borderRadius: 18,
        overflow: 'hidden',
        // marginVertical: 10,
    },
    textStyle: {
        ...FONTS.robotoregular,
        fontSize: 18
    },
    editorContainer: {
        height: "60%",
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 8,
        borderWidth: 1,
        marginTop: 10,
        borderColor: COLORS.primary
    },
    savedNotes: {
        borderWidth: 1,
        marginVertical: metrices(1),
        padding: 8,
        borderRadius: 5,
        marginTop: metrices(1)
    }
})

export default TakeNotesScreen;