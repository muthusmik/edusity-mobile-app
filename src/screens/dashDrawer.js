import React from 'react';
import {
  Dimensions
} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Dashboard from './sections/dashboard/dashboard';
import Sidebar from './sections/dashboard/Sidebar';

const DrawerScreen = () => {
  const Drawer = createDrawerNavigator();
  const { width } = Dimensions.get('window');
  const WIDTH_DRAWER = width / 2;
  const drawerStyle = {
    width: 100,
  };

  return (
    <Drawer.Navigator
      drawerContent={props => <Sidebar {...props} />}
      initialRouteName="Dashboard"
      screenOptions={{ headerShown: false }}
      drawerStyle={{ width: 240 }}
    >
      <Drawer.Screen name="Dashboard" component={Dashboard} />
    </Drawer.Navigator>
  );
}

export default DrawerScreen;