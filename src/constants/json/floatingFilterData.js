import React from "react";
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'

export const Action= [[
    {
      text: "Price Low-High",
      textBackground:"#000",
      textColor: "#fff",
      icon: <MCIcon name="sort-descending" size={RFValue(13)}  color={"red"} /> ,
      name: "Sort-Low-High",
      position: 2
    },
    {
      text: "Price High-Low",
      icon: <MCIcon name="sort-ascending" size={RFValue(13)}  color={"red"} /> ,
      name: "Sort-High-Low",
      position: 1,
      textBackground:"#000",
      textColor: "#fff",
    },
    {
        text: "Advanced Filter",
        icon: <MCIcon name="image-filter-vintage" size={RFValue(13)}  color={"red"} /> ,
        name: "Advanced-Filter",
        position: 3,
        textBackground:"#000",
      textColor: "#fff",
      },
]];