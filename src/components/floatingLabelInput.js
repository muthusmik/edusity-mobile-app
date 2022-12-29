
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Animated,
  Pressable,
} from "react-native";
import { COLORS } from "../constants";


const FormComponent = () => {
    const [value, setValue] = useState("");
    const moveText = useRef(new Animated.Value(0)).current;
    const [emailLabel,setEmailLabel]=useState("Enter your Email")
    const [passwordLabel,setPasswordLabel]=useState("Enter your Password")
    useEffect(() => {
      if (value !== "") {
          moveTextTop();
      } else if (value === "") {
          moveTextBottom();
      }
    }, [value])
  
    const onChangeText = (text) => {
      setValue(text);
    };
  
    const onFocusHandler = () => {
      if (value !== "") {
        moveTextTop();
      }
    };
  
    const onBlurHandler = () => {
      if (value === "") {
        moveTextBottom();
      }
    };
  
    const moveTextTop = () => {
      Animated.timing(moveText, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      setEmailLabel("Email")
    };
  
    const moveTextBottom = () => {
      Animated.timing(moveText, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      setEmailLabel("Enter your Email")
    };
  
    const yVal = moveText.interpolate({
      inputRange: [0, 1],
      outputRange: [15, 0],
    });
  
    const animStyle = {
      transform: [
        {
          translateY: yVal,
        },
      ],
    };
  
    return (
        <>
      <View style={styles.container}>
        <Animated.View style={[styles.animatedStyle, animStyle]}>
          <Text style={styles.label}>{emailLabel}</Text>
        </Animated.View>
        <TextInput
          autoCapitalize={"none"}
          style={styles.input}
          value={value}
          onChangeText={(text) => onChangeText(text)}
          editable={true}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          blurOnSubmit
        />

      </View>
      </>
    );
  };

  
  const styles = StyleSheet.create({
    container: {
      marginBottom: 20,
      marginTop: 20,
      backgroundColor: "#000",
      paddingTop: 5,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: "#bdbdbd",
      borderRadius: 20,
      width: "90%",
      alignSelf: "center",
    },
    input: {
      height: "70%",
      paddingLeft: 6,
      color: COLORS.white,
      backgroundColor: COLORS.black,
      width: "100%",
      borderWidth: 2, borderRadius: 20
    },
    label: {
      color: "white",
      fontSize: 15,
      
    },
    animatedStyle: {
      top: 5,
      left: 15,
      position: 'absolute',
      borderRadius: 90,
      zIndex: 10000,
    },
  });
  export default FormComponent;