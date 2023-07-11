import React, { useEffect, useState } from "react";
import {
    View,
    Image,
    TouchableOpacity,
    Text,
    StyleSheet,
    Modal,
    ScrollView,
    ToastAndroid
} from "react-native";
import { FONTS, COLORS } from "../../../constants";
import { metrices } from "../../../constants/metrices";
import moment from "moment";
import Entypo from 'react-native-vector-icons/Entypo';
import { TextInput } from 'react-native-paper';
import { getForumCommentDelete, getForumComment } from "../../../services/webinars";
import InnerReplyFunction from "./innerReplyScreen";
import Triangle from "../../../components/triangle";

const FunctionToShowComments = ({
    comments,
    token,
    setLoader,
    todayDate,
    deleteInnerReply,
    setDeleteInnerReply,
    reloadForumId,
    setReloadForumId,
    setReloadMain
}) => {
    const [modalShow, setModalShow] = useState(false);
    const [modalText, setModalText] = useState({});
    const [description, setDescription] = useState("");
    const [showEdit, setShowEdit] = useState("");
    const [innerReplies, setInnerReplies] = useState();

    const handleFile = (value) => {
        // console.log("Value.................", value)
        const fileData = value;
        if (Array.isArray(fileData) && fileData.length > 0) {
            const fileInfo = fileData[0];
            if (Array.isArray(fileInfo) && fileInfo.length > 0) {
                const { fileName, objectKey, uploadedId } = fileInfo[0];
                return fileName;
            } else {
                return "One"
            }
        } else {
            return "One"
        }
    }

    const handleEditDelete = (value) => {
        if (showEdit) {
            if (showEdit == value.id) {
                setShowEdit();
            }
            else {
                setShowEdit(value.id);
            }
        }
        else {
            setShowEdit(value.id)
        }
    }

    useEffect(() => {
        if (deleteInnerReply) {
            console.log("asddddd..................", deleteInnerReply, reloadForumId);
            handleDeleteComments(deleteInnerReply)
            handleInnerReply(reloadForumId)
        }
    }, [deleteInnerReply])

    const handleDeleteComments = async (valueId, type, itemDetails) => {
        
        setLoader(true)
        if (type == "comments") {
            console.log("Type...........comments");
            console.log("Item details................", itemDetails);
            setReloadMain("One")
        }
        console.log("handle delete..................", valueId, token);
        await getForumCommentDelete(token, valueId).then(data => {
            console.log("React.................", data);
            if (data.error == false && data.errorCode == "") {
                setInnerReplies();
                setDeleteInnerReply();
                setShowEdit();
                setLoader(false)
                ToastAndroid.show(data.message, ToastAndroid.BOTTOM, ToastAndroid.LONG)
            }
            else if (data.errorCode != "") {
                setLoader(false)
                ToastAndroid.show(data.message, ToastAndroid.BOTTOM, ToastAndroid.LONG)
            }
            else {
                setLoader(false)
                ToastAndroid.show("Something went wrong, please try again later!!", ToastAndroid.BOTTOM, ToastAndroid.LONG)
            }
        }).catch((error) => {
            setLoader(false)
            ToastAndroid.show("Something went wrong, please try again later!!", ToastAndroid.BOTTOM, ToastAndroid.LONG)
            console.log("Catch error in forumScreenData.........", error)
        })
    }
    const handleViewPdf = (value) => {
        // console.log("dddddddddddddddddddddd", value)
    }

    const handleModalView = (valueFromReply, fromWhere) => {
        // console.log("ValueFromReply................", valueFromReply, fromWhere);
        if (fromWhere) {
            setDescription(valueFromReply.description)
        }
        setShowEdit()
        setModalText(valueFromReply)
        setModalShow(true)
    }

    const handleInnerReply = async (value) => {
        setLoader(true)
        console.log("handleInnerReply ...................reply", value);
        await getForumComment(token, value).then(data => {
            console.log("handleInnerReply.................data", data);
            if (data.error == false && data.errorCode == "") {
                setLoader(false)
                setInnerReplies(data.data)
                setReloadForumId()
                // console.log("Forum screen...............", data.data)
            }
            else if (data.errorCode != "") {
                setLoader(false)
                ToastAndroid.show("Something went wrong, please try again later!!", ToastAndroid.BOTTOM, ToastAndroid.LONG)
            }
            else if (data == "error") {
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
            {comments?.replies.map((item, index) => {
                return (
                    <View key={index} style={{ borderWidth: 1, padding: 8, width: "100%", marginBottom: 8, borderRadius: 8, backgroundColor: COLORS.white }}>
                        {/* {console.log("item.....................", item)} */}
                        <View style={{ flexDirection: "row", width: "100%", alignItems: "center" }}>
                            <View style={styles.coulmnImage}>
                                {(item?.profileImage) ?
                                    <Image
                                        source={{ uri: "https://cdn.edusity.com/" + item?.profileImage }}
                                        resizeMode="contain"
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 40
                                        }}
                                    /> : <Image
                                        source={{ uri: "https://cdn.edusity.com/" + "courses/2382/85883a4c-c61f-456f-953f-01b94482088d.png" }}
                                        resizeMode="contain"
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 40
                                        }}
                                    />}
                            </View>
                            <View style={{ width: "80%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <View style={{ width: "68%" }}>
                                    <Text style={[styles.textStyle, { fontSize: 12 }]}>{item?.firstName} {item?.lastName} - {item?.title}</Text>
                                </View>
                                <View style={{ width: "32%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                    <Text style={[styles.textStyle, { fontSize: 10 }]}>{moment(todayDate).format("MM/DD/YYYY")}</Text>
                                    <TouchableOpacity style={{ flexDirection: "column", width: "40%", justifyContent: "center", alignItems: "center" }}
                                        onPress={() => handleEditDelete(item)}
                                    >
                                        <Text style={{ fontSize: 4 }}>{'\u2B24'}</Text>
                                        <Text style={{ fontSize: 4 }}>{'\u2B24'}</Text>
                                        <Text style={{ fontSize: 4 }}>{'\u2B24'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        {(item.id == showEdit) ?
                            <View style={styles.editDeleteContainerStyle}>
                                <Triangle area={16} triSection={(item.replies) == 0 ? 1 : 0} />
                                {(item.replies) == 0 ?
                                    <View style={{ backgroundColor: COLORS.primary, borderRadius: 8, height: metrices(3) }}>
                                        <TouchableOpacity style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}
                                            onPress={() => handleModalView(item, "edit")}
                                        >
                                            <Text style={{ ...FONTS.robotoregular, color: COLORS.white, fontSize: 10 }}>Edit</Text>
                                        </TouchableOpacity>
                                    </View> : null
                                }
                                <View style={{ backgroundColor: "red", borderRadius: 8, height: metrices(3), marginTop: (item?.replies) == 0 ? 4 : 0 }}>
                                    <TouchableOpacity style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}
                                        onPress={() => handleDeleteComments(item.id, "comments", item)}
                                    >
                                        <Text style={{ ...FONTS.robotoregular, color: COLORS.white, fontSize: 10 }}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View> : null}
                        <View>
                            <Text style={[styles.textStyle, { fontSize: 14 }]}>{item.description}</Text>
                            {handleFile(item.files) != "One" ?
                                <TouchableOpacity onPress={() => handleViewPdf(item.files)} style={{ marginVertical: 4 }}>
                                    <Text style={[styles.textStyle, { color: COLORS.primary, textDecorationLine: "underline" }]}>{handleFile(item.files)}</Text>
                                    {/* <Image
                                        source={{ uri: "https://cdn.edusity.com/" + handleFile(item.files) }}
                                        resizeMode="contain"
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 40
                                        }}
                                    /> */}
                                </TouchableOpacity> :
                                null
                            }
                        </View>
                        <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6, marginBottom: 10 }}>
                            {(item.replies) != 0 ?
                                <TouchableOpacity style={{ marginVertical: 4 }}
                                    onPress={() => handleInnerReply(item.id)}
                                >
                                    <Text style={[styles.textStyle]}>{item?.replies} Replies</Text>
                                </TouchableOpacity> :
                                <Text></Text>
                            }
                            <View style={{ width: "28%", height: metrices(4), borderRadius: 8, backgroundColor: "#580587" }}>
                                <TouchableOpacity style={{ width: "100%", alignItems: "center", height: "100%", justifyContent: "center" }} onPress={() => handleModalView(item)}>
                                    <Text style={[styles.textStyle, { color: COLORS.white }]}>Reply</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {innerReplies && (item?.id == innerReplies?.replies[0]?.forumid) ?
                            <InnerReplyFunction
                                innerReplies={innerReplies}
                                token={token}
                                setLoader={setLoader}
                                todayDate={todayDate}
                                setDeleteInnerReply={setDeleteInnerReply}
                                setReloadForumId={setReloadForumId}
                            />
                            : null}
                    </View >
                )
            })
            }
            {
                modalShow &&
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
                                            <TouchableOpacity
                                                onPress={() => { setModalShow(false), setDescription("") }}
                                                style={styles.touchButtonStyle}
                                            >
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
    )
}

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
    },
    editDeleteContainerStyle: {
        alignSelf: "flex-end",
        borderRadius: 8,
        width: "24%",
        padding: 8,
        backgroundColor: COLORS.gray,
        position: "absolute",
        zIndex: 1,
        top: 48,
        right: 8.4
    }
})

export default FunctionToShowComments;