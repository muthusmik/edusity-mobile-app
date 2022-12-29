import React, {useState} from 'react';

import {Text, View, TouchableOpacity} from 'react-native';

const threeSwitch = ({

  selectionMode,
  roundCorner,
  option1,
  option2,
  option3,
  onSelectSwitch,
  selectionColor
}) => {
  const [getSelectionMode, setSelectionMode] = useState(selectionMode);
  const [getRoundCorner, setRoundCorner] = useState(roundCorner);
 console.log(getSelectionMode,"looking");
  const updatedSwitchData = val => {
    setSelectionMode(val);
    onSelectSwitch(val);
    console.log("updated");
  };

  return (
    <View>
      <View
        style={{
          height: 34,
          width: "90%",
          backgroundColor: '#d1cdcd',
          borderRadius: getRoundCorner ? 25 : 0,
           //borderWidth: 1,
           //borderColor: selectionColor,
           flexDirection: 'row',
          justifyContent: 'center',
          padding: 2,
          marginEnd:"5%",
          marginStart:"5%",
          marginTop:"2%",
        
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => updatedSwitchData(1)}
          style={{
            flex: 1,

            backgroundColor: getSelectionMode == 1 ? selectionColor : '#d1cdcd',
            borderRadius: getRoundCorner ? 25 : 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: getSelectionMode == 1 ? 'white' : selectionColor,
            }}>
            {option1}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          TouchableOpacity
          activeOpacity={1}
          onPress={() => updatedSwitchData(2)}
          style={{
            flex: 1,

            backgroundColor: getSelectionMode == 2 ? selectionColor : '#d1cdcd',
            borderRadius: getRoundCorner ? 25 : 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: getSelectionMode == 2 ? 'white' : selectionColor,
            }}>
            {option2}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          TouchableOpacity
          activeOpacity={1}
          onPress={() => updatedSwitchData(3)}
          style={{
            flex: 1,

            backgroundColor: getSelectionMode == 3 ? selectionColor : '#d1cdcd',
            borderRadius: getRoundCorner ? 25 : 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: getSelectionMode == 3 ? 'white' : selectionColor,
            }}>
            {option3}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default threeSwitch;