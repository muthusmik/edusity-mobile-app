import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList
} from 'react-native';
import Top_Bar from '../../../components/topBar';
import { metrices } from '../../../constants/metrices';
import { COLORS, FONTS } from '../../../constants';

const TestResult = () => {

    const stylesFromPage = {
        height: metrices(8),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: COLORS.primary,
        // borderBottomStartRadius: 30,
        // borderBottomEndRadius: 30,
        paddingRight: 26,
        paddingLeft: 18
    }
    const headingStyle = {
        ...styles.cell,
        ...FONTS.robotoregular,
        backgroundColor: COLORS.edusity,
        color: COLORS.white,
        fontSize: 14,
    };
    const detailsStyle = {
        ...styles.cell,
        ...FONTS.robotoregular,
        color: COLORS.black,
        fontSize: 14,
    }
    const data = [
        { courseName: 'John Doe', quizName: 25, type: 'New York', result: 'Passfefefefefefefe', attempts: 'fwfffrf', questionList: 'fefefefefefe' },
        { courseName: 'Jane Smith', quizName: 30, type: 'London', result: 'Passefefefefefefefefefefefefefefefe eeie eeofef e feofe f efoef e feofe feofe fefef eofe fefeofe fef', attempts: 'fwfffrf', questionList: 'fefefefefefe' },
        { courseName: 'Jane Smith', quizName: 30, type: 'London', result: 'Passefefefefefefefefefefefefefefefe', attempts: 'fwfffrf', questionList: 'fefefefefefe' },
        { courseName: 'Jane Smith', quizName: 30, type: 'London', result: 'Passefefefefefefefefefefefefefefefe', attempts: 'fwfffrf', questionList: 'fefefefefefe' },
        { courseName: 'Jane Smith', quizName: 30, type: 'London', result: 'Passefefefefefefefefefefefefefefefe', attempts: 'fwfffrf', questionList: 'fefefefefefe' },
        { courseName: 'Jane Smith', quizName: 30, type: 'London', result: 'Passefefefefefefefefefefefefefefefe', attempts: 'fwfffrf', questionList: 'fefefefefefe' },
        { courseName: 'Jane Smith', quizName: 30, type: 'London', result: 'Passefefefefefefefefefefefefefefefe', attempts: 'fwfffrf', questionList: 'fefefefefefe' },
        { courseName: 'Jane Smith', quizName: 30, type: 'London', result: 'Passefefefefefefefefefefefefefefefe', attempts: 'fwfffrf', questionList: 'fefefefefefe' },
        { courseName: 'Jane Smith', quizName: 30, type: 'London', result: 'Passefefefefefefefefefefefefefefefe', attempts: 'fwfffrf', questionList: 'fefefefefefe' },
        { courseName: 'Jane Smith', quizName: 30, type: 'London', result: 'Passefefefefefefefefefefefefefefefe', attempts: 'fwfffrf', questionList: 'fefefefefefe' },
        { courseName: 'Jane Smith', quizName: 30, type: 'London', result: 'Passefefefefefefefefefefefefefefefe', attempts: 'fwfffrf', questionList: 'fefefefefefe' },
        { courseName: 'Jane Smith', quizName: 30, type: 'London', result: 'Passefefefefefefefefefefefefefefefe', attempts: 'fwfffrf', questionList: 'fefefefefefe' },
        { courseName: 'Jane Smith', quizName: 30, type: 'London', result: 'Passefefefefefefefefefefefefefefefe', attempts: 'fwfffrf', questionList: 'fefefefefefe' },
        { courseName: 'Jane Smith', quizName: 30, type: 'London', result: 'Passefefefefefefefefefefefefefefefe', attempts: 'fwfffrf', questionList: 'fefefefefefe' },
        { courseName: 'Jane Smith', quizName: 30, type: 'London', result: 'Passefefefefefefefefefefefefefefefe', attempts: 'fwfffrf', questionList: 'fefefefefefe' },
        { courseName: 'Jane Smith', quizName: 30, type: 'London', result: 'Passefefefefefefefefefefefefefefefe', attempts: 'fwfffrf', questionList: 'fefefefefefe' },
        { courseName: 'Jane Smith', quizName: 30, type: 'rio', result: 'Passefefefefefefefefefefefefefefefe', attempts: 'fwfffrf', questionList: 'fefefefefefe' },
    ];

    return (
        <>
            <Top_Bar backPage={0} stylesFromPage={stylesFromPage} title={"Test Result"} />
            <View style={{ flex: 1 }}>
                <ScrollView horizontal={true} nestedScrollEnabled={false}>
                    <View style={{ width: "100%", alignSelf: "center" }}>
                        <ScrollView nestedScrollEnabled={false}>
                            <View style={styles.row}>
                                <Text style={headingStyle}>Course Name</Text>
                                <Text style={headingStyle}>Quiz Name</Text>
                                <Text style={headingStyle}>Type</Text>
                                <Text style={headingStyle}>Attempts</Text>
                                <Text style={headingStyle}>Result</Text>
                                <Text style={headingStyle}>Question List</Text>
                                <Text style={{ paddingLeft: 0.5 }}></Text>
                            </View>
                            <View>
                                <FlatList
                                    data={data}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <View style={styles.row}>
                                            <Text
                                                style={[
                                                    styles.cell,
                                                    {
                                                        ...FONTS.robotoregular,
                                                        backgroundColor: COLORS.blue,
                                                        color: COLORS.white,
                                                        fontSize: 14,
                                                    },
                                                ]}
                                            >
                                                {item.courseName}
                                            </Text>
                                            <Text style={detailsStyle}>{item.quizName}</Text>
                                            <Text style={detailsStyle}>{item.type}</Text>
                                            <Text style={detailsStyle}>{item.result}</Text>
                                            <Text style={detailsStyle}>{item.attempts}</Text>
                                            <Text style={detailsStyle}>{item.questionList}</Text>
                                        </View>
                                    )}
                                    contentContainerStyle={styles.table}
                                />
                            </View>
                        </ScrollView>
                    </View>
                </ScrollView>
            </View>

            {/* <View style={{ width: "100%", alignSelf: "center" }}>
                <ScrollView horizontal={true}>
                    <View style={styles.row}>
                        <Text style={headingStyle}>Course Name</Text>
                        <Text style={headingStyle}>Quiz Name</Text>
                        <Text style={headingStyle}>Type</Text>
                        <Text style={headingStyle}>Attempts</Text>
                        <Text style={headingStyle}>Result</Text>
                        <Text style={headingStyle}>Question List</Text>
                    </View>
                    <View>
                        <FlatList
                            data={data}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.row}>
                                    <Text style={[styles.cell, { ...FONTS.robotoregular, backgroundColor: COLORS.blue, color: COLORS.white, fontSize: 14 }]}>{item.courseName}</Text>
                                    <Text style={styles.cell}>{item.quizName}</Text>
                                    <Text style={styles.cell}>{item.type}</Text>
                                    <Text style={styles.cell}>{item.result}</Text>
                                    <Text style={styles.cell}>{item.attempts}</Text>
                                    <Text style={styles.cell}>{item.questionList}</Text>
                                </View>
                            )}
                            contentContainerStyle={styles.table}
                        />
                    </View>
                </ScrollView>
            </View> */}
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
    row: {
        flexDirection: 'row'
    },
    table: {
        flexGrow: 1
    },
    cell: {
        width: 120,
        padding: 8,
        borderLeftWidth: 1,
        borderRightWidth: 0.5,
        borderBottomWidth: 1,
        borderColor: COLORS.black
    },
    HeadStyle: {
        height: 50,
        alignContent: "center",
        backgroundColor: '#ffe0f0'
    },
    TableText: {
        margin: 10
    }
})

export default TestResult;