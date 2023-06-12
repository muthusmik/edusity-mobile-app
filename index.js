
import { AppRegistry } from 'react-native';
import App from './src/App';
import React from 'react';
import 'react-native-gesture-handler'
import { Provider } from 'react-redux';
import Store from "./src/store/store";
import { name as appName } from './app.json';

const Root = () => (

  <Provider store={Store}>
    <App />
  </Provider>

)

AppRegistry.registerComponent(appName, () => Root);   