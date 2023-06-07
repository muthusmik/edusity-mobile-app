import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import { RFValue } from "react-native-responsive-fontsize";

export const COLORS = {
    // base colors
    primary: "#8830c4", // purple
    secondary: "#cacfd9",   // Gray
    buttonOne: "#AF2DF8",
    edusity: "#AF2DF8",
    black: "#1E1F20",
    white: "#FFFFFF",
    lightGray: "#eff2f5",
    gray: "#8b9097",
    back: "#f0e1e1",
    blue: "#5884ff"
};
export const SIZES = {
    // global sizes
    base: 8,
    font: 14,
    radius: 12,
    padding: 24,

    // font sizes
    largeTitle: 50,
    h1: RFValue(26),
    h2: RFValue(20),
    h3: RFValue(14),
    h4: RFValue(12),
    body1: RFValue(26),
    body2: RFValue(20),
    body3: RFValue(16),
    body4: RFValue(12),
    body5: RFValue(10),

    // app dimensions
    width,
    height
};
export const FONTS = {
    largeTitle: { fontFamily: "Roboto-Black", fontSize: SIZES.largeTitle, lineHeight: 55 },
    h1: { fontFamily: "Roboto-Black", fontSize: SIZES.h1, lineHeight: 36 },
    h2: { fontFamily: "Roboto-Bold", fontSize: SIZES.h1, lineHeight: 36, color: COLORS.black, fontWeight: "700" },
    h3: { fontFamily: "Roboto-Bold", fontSize: SIZES.h3, lineHeight: 22 },
    h4: { fontFamily: "Roboto-Bold", fontSize: SIZES.h4, lineHeight: 22 },
    body1: { fontFamily: "Roboto-Regular", fontSize: SIZES.body1, lineHeight: 36 },
    body2: { fontFamily: "Roboto-Regular", fontSize: SIZES.body2, lineHeight: 30 },
    body3: { fontFamily: "Roboto-Regular", fontSize: SIZES.body3, lineHeight: 22 },
    body4: { fontFamily: "Roboto-Regular", fontSize: SIZES.body4, lineHeight: 22 },
    robotoregular: { fontFamily: "Roboto-Regular" },
    robotomedium: { fontFamily: "Roboto-Medium" }
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
