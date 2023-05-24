import { Dimensions } from "react-native";

const getHeight = Dimensions.get('window').height;

const metrices = (value) => (getHeight * value) / 100;

export { metrices };