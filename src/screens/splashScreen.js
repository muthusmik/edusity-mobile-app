import React, {useState} from 'react';
import {View, StyleSheet,Text,Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {useEffect} from 'react';
import { COLORS, FONTS, icons, images } from '../constants';
import { RFValue } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage'

const SplashScreen = props => {
  const [authLoaded, setAuthLoaded] = useState(false);
  const [animationLoaded, setAnimationLoaded] = useState(false);
  const navigation=useNavigation();


  useEffect(() => {
    setTimeout(() => {
      setAuthLoaded(true);
      setAnimationLoaded(true);
    }, 4000);
  }, []);

  const onAnimationFinish = () => {
    setAnimationLoaded(true);
  };

  useEffect(() => {
    const navigateHandler=async()=>{
    if (authLoaded && animationLoaded) {
      let Token=await  AsyncStorage.getItem("loginToken");
      if(Token){
        console.log("data iruku",Token);
        props.navigation.replace('Home',{screen:'DashBoard'});
      }else{
        console.log("illa data illa set aggamateenguthu da payale");
        props.navigation.replace('Home',{screen:'Search'});
      }

    }
  }
  navigateHandler();
  }, [authLoaded, animationLoaded, props.navigation]);

  return (
    <View style={styles.root}>

      <Image
        source={icons.Edusitylogo}
        resizeMode="contain"
        style={{
          width: '50%',
          height: '10%',
        }}
      />
        <Text style={{color:COLORS.black,fontSize:RFValue(15),fontFamily:"Roboto-Black"}}>Edusity for Greater Learning...</Text>

    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:COLORS.white
  },
});

export default SplashScreen;