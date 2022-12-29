// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   Text,
//   StyleSheet,
//   Alert,
//   View,
//   Pressable,
// } from 'react-native';

// import { useDispatch, useSelector } from 'react-redux';
// import RazorpayCheckout from 'react-native-razorpay';

// //import { withRouter } from "react-router";

// const RazorpayOverlay = ({ history, onClose, data, pricing }) => {
//   console.log("Im inisde the razorPay ...page", data, ".....................", pricing)
//   const LoginData = useSelector(state => state.userLoginHandle.data)
//   console.log("logindata", LoginData.data)

//   const paymentHandler = async () => {
//     history.push("/cart");
//     onClose((state) => !state);
//   };
//   return (
//     <SafeAreaView >
//       {console.log("Im the model rendering page")}
//       <View
//         style={{ width: 130 }}>
//         <Pressable
//           onPress={() => {
//             var options = {
//               name: "Edusity",
//               amount: pricing,
//               description: "Test Transaction",
//               image: 'https://i.imgur.com/3g7nmJC.png',
//               currency: 'INR',
//               key: "rzp_test_0YBgt6YFSNUirq", // Your api key
//               order_id: data,
              
//               handler: paymentHandler,
//               modal: {
//                 ondismiss: () => {
//                   onClose((state) => !state);
//                 },
//               },
//               prefill: {
//                 name: LoginData.data.userName,
//                 email: LoginData.data.email,
//                 contact: 8220349860,
//               },
//             };
//             RazorpayCheckout.open(options)
//               .then(data => {
//                 // handle success
//                 Alert(`Success: ${data.razorpay_payment_id}`);
//               })
//               .catch(error => {
//                 // handle failure
//                 Alert(`Error: ${error.code} | ${error.description}`);
//               });
//           }}
//         >
//           <Text style={{ backgroundColor: "black", color: "#fff", color: "white", fontWeight: "bold", textAlign: "center", padding: 10, borderRadius: 8 }}>
//             Pay with Razorpay
//           </Text>
//         </Pressable>
//       </View>
//     </SafeAreaView>
//   );

// };

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

// export default RazorpayOverlay;
