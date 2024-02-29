// import React, { useState } from 'react';
// import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

// import { useNavigation } from '@react-navigation/native';
// import { useDispatch } from 'react-redux';

// import MyStatusBar from '../components/MyStatusBar';
// import commonStyle from '../constants/commonStyle';
// import { customer, vender, } from '../constants/userType';

// import { loggedIn, logout } from '../store/reducer/mainSlice';
// import { useChangeStatusMutation, useGetUserQuery } from '../store/slice/api';
// import Snackbar from 'react-native-snackbar';
// import { emptySplitApi } from '../store/slice/emptySplitApi';

// const SideMenu = () => {
//   const navigation = useNavigation()
//   const dispatch = useDispatch()
//   const [isActive, setIsActive] = useState(false);
//   const { data: userData, isLoading: isUserLoading, isError, isFetching } = useGetUserQuery()
//   const user = userData ?? {}
//   const [changeStatus, { isLoading }] = useChangeStatusMutation();
//   const handleEditProfile = async () => {

//     const editUserData = {
//       type: user?.userType === vender ? customer : user?.userType === customer ? vender : '',
//     }

//     changeStatus(editUserData).unwrap()
//       .then((data) => {
//         if (data) {
//           Snackbar.show({
//             text: `User account has been switched`, duration: Snackbar.LENGTH_LONG, textColor: '#fff', backgroundColor: '#88087B',
//           });
//           dispatch(loggedIn({
//             token: data.token,
//             type: data.type
//           }))
//           navigation.navigate("Home")
//         }
//       })
//       .catch((error) => {
//         console.log('err', error);
//         Snackbar.show({
//           text: error.data.message, duration: Snackbar.LENGTH_LONG, textColor: '#fff', backgroundColor: '#88087B',
//         });
//         console.log(error, 'error');
//       });

//   }

//   return (
//     <View style={{ flex: 1, backgroundColor: '#fff', }}>
//       <MyStatusBar
//         translucent
//         barStyle="light-content"
//         backgroundColor="#000"
//       />
//       <ScrollView style={{}}>
//         <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={{ marginLeft: 15, marginTop: 20 }}>
//           <Text style={{ fontSize: 16, color: '#000', fontFamily: commonStyle.fontFamily.medium, }}>Edit Profile</Text>
//         </TouchableOpacity>
//         <View style={{ borderColor: '#2D2D2D', opacity: 0.2, borderWidth: .5, marginTop: 20, }} />
//         <TouchableOpacity onPress={() => {

//         }} style={{ marginLeft: 15, marginTop: 20 }}>
//           <Text style={{ fontSize: 16, color: '#000', fontFamily: commonStyle.fontFamily.medium, }}>Settings</Text>
//         </TouchableOpacity>
//         <View style={{ borderColor: '#2D2D2D', opacity: 0.2, borderWidth: .5, marginTop: 20, }} />
//         {isLoading ?
//           <ActivityIndicator style={{ marginTop: 20 }} size={'large'} color={'green'} />
//           :
//           <TouchableOpacity
//             onPress={() => {
//               setIsActive(!isActive)
//               handleEditProfile()
//             }}
//             style={{ marginLeft: 15, marginTop: 20 }}>
//             <Text style={{ fontSize: 16, color: '#000', fontFamily: commonStyle.fontFamily.medium, }}>{user?.userType == 'VENDER' ? 'Switch to Customer' : 'Switch to Vendor'}</Text>
//           </TouchableOpacity>}
//         <View style={{ borderColor: '#2D2D2D', opacity: 0.2, borderWidth: .5, marginTop: 20, }} />
//         <TouchableOpacity onPress={() => { navigation.navigate('PastOrders') }} style={{ marginLeft: 15, marginTop: 20 }}>
//           <Text style={{ fontSize: 16, color: '#000', fontFamily: commonStyle.fontFamily.medium, }}>Orders</Text>
//         </TouchableOpacity>
//         <View style={{ borderColor: '#2D2D2D', opacity: 0.2, borderWidth: .5, marginTop: 20, }} />
//         <TouchableOpacity
//           onPress={() => {
//             dispatch(emptySplitApi.util.resetApiState())
//             dispatch(logout(null))
//           }}
//           style={{ marginLeft: 15, marginTop: 20 }}>
//           <Text style={{ fontSize: 16, color: '#000', fontFamily: commonStyle.fontFamily.medium, }}>Log Out</Text>
//         </TouchableOpacity>
//         <View style={{ borderColor: '#2D2D2D', opacity: 0.2, borderWidth: .5, marginTop: 20, }} />

//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   bottomDrawerSection: {
//     marginBottom: 15,
//     borderTopColor: '#f4f4f4',
//     borderTopWidth: 1
//   },
//   colortext: {
//     color: 'white'
//   },

// });

// export default SideMenu
