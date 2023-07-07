import React, { useState, useEffect } from 'react';
import {
    View,
    Button,
    Text,
    Image,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ToastAndroid,
    Modal,
    ScrollView
} from 'react-native';
import { useIsFocused } from "@react-navigation/core";
import Top_Bar from '../../../components/topBar';
import { metrices } from '../../../constants/metrices';
import { COLORS, FONTS } from '../../../constants';
import { getForumData, getForumComment } from '../../../services/webinars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OverlayLoader from '../../../components/overlayLoader';
import moment from 'moment';
import { TextInput } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import FunctionToShowComments from './comments';

const ForumScreen = () => {
    const isFocused = useIsFocused();
    const [token, setToken] = useState();
    const [loader, setLoader] = useState(false);
    const [forumData, setforumData] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [modalText, setModalText] = useState({});
    const [description, setDescription] = useState("");
    const [comments, setComments] = useState();

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

    useEffect(() => {
        if (isFocused) {
            setLoader(true)
            getTokenFunction();
        }
    }, [isFocused])

    const getTokenFunction = async () => {
        await AsyncStorage.getItem("loginToken").then((value) => setToken(value));
    }

    useEffect(() => {
        if (token) {
            initialLoading();
        }
    }, [token])

    const initialLoading = async () => {
        if (token) {
            let forumScreenData = await getForumData(token).then(data => {
                if (data.error == false && data.errorCode == "") {
                    setLoader(false)
                    setforumData(data.data)
                }
                else if (data.errorCode != "") {
                    setLoader(false)
                    ToastAndroid.show("Something went wrong, please try again later!!", ToastAndroid.BOTTOM, ToastAndroid.LONG)
                }
            }).catch((error) => { console.log("Catch error in forumScreenData.........", error) })
        }
    }

    const handleModalView = (valueFromReply) => {
        // console.log("ValueFromReply................", valueFromReply);
        setModalText(valueFromReply)
        setModalShow(true)
    }

    const handleFile = (value) => {
        // console.log("Value.................", value)
        const fileData = value;
        if (Array.isArray(fileData) && fileData.length > 0) {
            const fileInfo = fileData[0];
            if (Array.isArray(fileInfo) && fileInfo.length > 0) {
                const { fileName, objectKey, uploadedId } = fileInfo[0];
                // console.log("File Name:", fileName);
                // console.log("Object Key:", objectKey);
                // console.log("Uploaded ID:", uploadedId);
                // const returnValue = { fileName, objectKey, uploadedId }
                return fileName;
            } else {
                // console.log("File information is empty");
                return "One"
            }
        } else {
            return "One"
        }
    }

    const handleViewPdf = (value) => {
        // console.log("dddddddddddddddddddddd", value)
    }

    const handleComments = async (value) => {
        setLoader(true)
        let valueId = value.id;
        let gettingComments = await getForumComment(token, valueId).then(data => {
            // console.log("React.................", data);
            if (data.error == false && data.errorCode == "") {
                setLoader(false)
                setComments(data.data)
                // console.log("Forum screen...............", data.data)
            }
            else if (data.errorCode != "") {
                setLoader(false)
                ToastAndroid.show("Something went wrong, please try again later!!", ToastAndroid.BOTTOM, ToastAndroid.LONG)
            }
        }).catch((error) => {
            setLoader(false)
            ToastAndroid.show("Something went wrong, please try again later!!", ToastAndroid.BOTTOM, ToastAndroid.LONG)
            console.log("Catch error in forumScreenData.........", error)
        })
    }

    return (
        <>
            <Top_Bar backPage={0} stylesFromPage={stylesFromPage} title={"Forum"} />
            {loader && <OverlayLoader />}
            <View style={styles.mainContainer}>
                {(forumData && forumData.length > 0) ?
                    <FlatList
                        data={forumData}
                        keyExtractor={item => item.id}
                        renderItem={({ item, index }) => (
                            <View style={{ marginBottom: 10, width: "100%", backgroundColor: COLORS.lightGray, borderRadius: 10, padding: 10 }}>
                                {/* {console.log("Item...............", item.files)} */}
                                <View style={{ flexDirection: "row", width: "100%", alignItems: "center" }}>
                                    <View style={styles.coulmnImage}>
                                        {(item?.profileImage) ?
                                            <Image
                                                source={{ uri: "https://cdn.edusity.com/" + item?.profileImage }}
                                                resizeMode="contain"
                                                style={{
                                                    width: 50,
                                                    height: 50,
                                                    borderRadius: 50
                                                }}
                                            /> : <Image
                                                source={{ uri: "https://cdn.edusity.com/" + "courses/2382/85883a4c-c61f-456f-953f-01b94482088d.png" }}
                                                resizeMode="contain"
                                                style={{
                                                    width: 50,
                                                    height: 50,
                                                    borderRadius: 50
                                                }}
                                            />}
                                    </View>
                                    <View style={{ width: "80%", flexDirection: "row", justifyContent: "space-between" }}>
                                        <View style={{ width: "68%" }}>
                                            <Text style={styles.textStyle}>Name: {item.firstName} {item.lastName}</Text>
                                            <Text style={styles.textStyle}>Title: {item.title}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.textStyle}>{moment(item.createdat).format("DD/MM/YYYY")}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 8 }}>
                                    <View style={{ width: "70%", justifyContent: "center" }}>
                                        <Text style={styles.textStyle}>Description: {item.description}</Text>
                                        {item?.replies != 0 && <TouchableOpacity onPress={() => handleComments(item)}><Text style={[styles.textStyle, { color: COLORS.primary, textDecorationLine: "underline" }]}>Comments: {item.replies}</Text></TouchableOpacity>}
                                    </View>
                                    <View style={{ width: "30%", alignItems: "center", justifyContent: "center" }}>
                                        <View style={{ width: "100%", height: metrices(4), borderRadius: 8, backgroundColor: "#580587" }}>
                                            <TouchableOpacity style={{ width: "100%", alignItems: "center", height: "100%", justifyContent: "center" }} onPress={() => handleModalView(item)}>
                                                <Text style={[styles.textStyle, { color: COLORS.white }]}>Reply</Text>
                                            </TouchableOpacity>
                                        </View>
                                        {handleFile(item.files) != "One" ?
                                            <TouchableOpacity onPress={() => handleViewPdf(item.files)} style={{ marginVertical: 4 }}>
                                                <Text style={[styles.textStyle, { color: COLORS.primary, textDecorationLine: "underline" }]}>{handleFile(item.files)}</Text>
                                            </TouchableOpacity> :
                                            null
                                        }
                                    </View>
                                </View>
                                {comments && (item.id == comments?.post[0]?.id) ? <FunctionToShowComments comments={comments} token={token} setLoader={setLoader} />/* functionToShowComments() */ : null}
                            </View>
                        )}
                    /> : null
                }
            </View>


            {modalShow &&
                <View style={styles.centeredView}>
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalShow}
                        onRequestClose={() => {
                            setModalShow(false)
                            setDescription("")
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <ScrollView>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <Text style={[styles.modalText, { fontSize: 18, ...FONTS.body2 }]}>Replying for {modalText.title}</Text>
                                        <TouchableOpacity onPress={() => setModalShow(false)}>
                                            <Entypo name="squared-cross" color="#eb2640" size={25} />
                                        </TouchableOpacity>
                                    </View>
                                    <TextInput
                                        theme={{ fonts: { regular: { fontFamily: 'Roboto-Regular' } }, colors: { primary: COLORS.primary, background: COLORS.white, text: COLORS.black, placeholder: COLORS.gray } }}
                                        mode='outlined'
                                        multiline={true}
                                        numberOfLines={5}
                                        label={"Enter your description here"}
                                        // placeholder={placeholder}
                                        style={{ width: "96%", height: metrices(12), alignSelf: "center", marginTop: 15 }}
                                        value={description}
                                        placeholderTextColor={COLORS.gray}
                                        onChangeText={e => { setDescription(e) }}
                                    />
                                    <View style={styles.uploadContainer}>
                                        <View style={{ width: "78%", borderWidth: 1, borderColor: COLORS.gray, borderRadius: 4 }}>
                                            <Text style={{ fontSize: 16, ...FONTS.robotoregular, color: COLORS.gray, paddingVertical: 8, paddingLeft: 6 }}>Enter url here...</Text>
                                        </View>
                                        <View style={[styles.buttonStyle, { width: "20%", backgroundColor: COLORS.primary, borderWidth: 0 }]}>
                                            <TouchableOpacity style={styles.touchButtonStyle}>
                                                <Text style={{ fontSize: 16, ...FONTS.robotoregular, color: COLORS.white }}>Upload</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={styles.buttonContainer}>
                                        <View style={styles.buttonStyle}>
                                            <TouchableOpacity style={styles.touchButtonStyle}>
                                                <Text style={{ fontSize: 16, ...FONTS.robotoregular, color: "red" }}>Cancel</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={[styles.buttonStyle, { backgroundColor: COLORS.lightGray }]}>
                                            <TouchableOpacity style={styles.touchButtonStyle}>
                                                <Text style={{ fontSize: 16, ...FONTS.robotoregular, color: COLORS.primary }}>Submit</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>
                </View>
            }


        </>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        width: "94%",
        alignSelf: "center",
        height: metrices(92),
        paddingTop: 10
    },
    coulmnImage: {
        width: "20%",
        alignItems: "center"
    },
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
        fontSize: 16,
        color: COLORS.black
    },
    savedNotes: {
        borderWidth: 1,
        marginVertical: metrices(1),
        padding: 8,
        borderRadius: 5,
        marginTop: metrices(4)
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    modalView: {
        width: "95%",
        // height:"80%",
        padding: 6,
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        textAlign: 'center',
        ...FONTS.robotoregular,
        fontSize: 16,
        color: COLORS.black
    },
    uploadContainer: {
        width: "96%",
        marginTop: 14,
        alignSelf: "center",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row"
    },
    buttonContainer: {
        width: "76%",
        marginVertical: 14,
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    buttonStyle: {
        width: "46%",
        borderWidth: 1,
        height: 38,
        borderRadius: 10
    },
    touchButtonStyle: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center"
    }
})

export default ForumScreen;