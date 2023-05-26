import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Pressable
} from 'react-native';
import { images, icons, COLORS, FONTS, SIZES } from '../constants';
import moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';
import { metrices } from '../constants/metrices';
import Entypo from 'react-native-vector-icons/Entypo';

const NotificationScreen = ({ isVisible, onClose, announcement }) => {
    const [innerModalShow, setInnerModalShow] = useState(false);
    const [modalValue, setModalValue] = useState({})
    const handleAnnouncement = (item) => {
        setModalValue(item)
        setInnerModalShow(true)
    }
    if (!isVisible) {
        return null;
    }

    return (
        <>
            <View style={styles.container}>
                <View style={styles.announcementStyle}>
                    <View style={styles.header}>
                        <Text style={styles.titleStyle}>Course Announcements ({announcement?.length})</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Entypo name="squared-cross" color="#eb2640" size={25} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        {announcement?.map((item, index) => (
                            <TouchableOpacity key={item.id} style={styles.touchableStyle} onPress={() => { handleAnnouncement(item) }}>
                                <Text style={{ color: COLORS.primary, ...FONTS.robotoregular, fontSize: 18 }}>{item.name}</Text>
                                <Text style={{ color: COLORS.black, ...FONTS.robotoregular }}>{moment(item.activationDate).format("DD/MM/YYYY hh:mm A")}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                {innerModalShow &&
                    <View style={styles.centeredView}>
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={innerModalShow}
                            onRequestClose={() => {
                                setInnerModalShow(false)
                            }}
                        >
                            <View style={styles.centeredView}>
                                <TouchableOpacity onPress={() => setInnerModalShow(false)} style={{ marginLeft: metrices(40) }}>
                                    <Entypo name="squared-cross" color="#eb2640" size={25} />
                                </TouchableOpacity>
                                <View style={styles.modalView}>
                                    <Text style={[styles.modalText, { fontSize: 18, ...FONTS.h2 }]}>{modalValue?.name}</Text>
                                    <Text style={styles.modalText}>{modalValue.description}</Text>
                                </View>

                            </View>
                        </Modal>
                    </View>
                }
            </View>

        </>
    );
};

const styles = StyleSheet.create({
    container: {
        alignSelf: "flex-end",
        height: metrices(90),
        width: SIZES.width,
        position: 'absolute',
        zIndex: 1,
        marginTop: metrices(8)
    },
    announcementStyle: {
        height: "96%",
        width: "100%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: COLORS.white,
        padding: 10,
    },
    touchableStyle: {
        borderWidth: 0.5,
        borderColor: COLORS.primary,
        backgroundColor: COLORS.lightGray,
        marginBottom: 10,
        borderRadius: 6,
        padding: 8
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
        paddingHorizontal: 10
    },
    titleStyle: {
        ...FONTS.robotoregular,
        color: COLORS.primary,
        fontSize: 20,
        textAlign: "center",
        marginBottom: 12
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        ...FONTS.robotoregular,
        fontSize: 16,
        color: COLORS.black
    }
})

export default NotificationScreen;
