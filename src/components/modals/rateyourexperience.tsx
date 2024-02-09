// import {View, TouchableOpacity, TextInput} from 'react-native';
// import React, {useState} from 'react';
// import tw from 'twrnc';
// import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
// import Textcomp from '../Textcomp';
// import colors from '../../constants/colors';
// import {WIDTH_WINDOW} from '../../constants/generalStyles';
// import Modal from 'react-native-modal/dist/modal';
// import Review2 from '../Review2';
// import {sendRatings} from '../../utils/api/func';
// import Snackbar from 'react-native-snackbar';

// export default function RateyourExperience({
//   navigation,
//   visible,
//   func,
//   item,
//   OnFinish,
// }: any) {
//   const [InfoModal, setInfoModal] = useState(visible);
//   //
//   const [isLoading, setisLoading] = useState(false);
//   const [comment, setcomment] = useState('');

//   const [rateExperience, setrateExperience] = useState(0);
//   const [recommend, setrecommend] = useState(0);
//   const [rateService, setrateService] = useState(0);

//   console.log(item?._id);
//   const id = item?._id;

//   return (
//     <Modal
//       isVisible={visible}
//       onModalHide={() => {
//         func(false);
//       }}
//       style={{width: SIZES.width, marginHorizontal: 0}}
//       deviceWidth={SIZES.width}
//       onBackdropPress={() => func(false)}
//       swipeThreshold={200}
//       swipeDirection={['down']}
//       onSwipeComplete={() => func(false)}
//       onBackButtonPress={() => func(false)}>
//       <View style={tw` h-full w-full bg-black bg-opacity-5`}>
//         <TouchableOpacity onPress={() => func(false)} style={tw`flex-1`} />
//         <View style={tw`h-[70%] mt-auto bg-[#D9D9D9]`}>
//           <TouchableOpacity
//             onPress={() => {
//               func(false);
//             }}
//             style={tw`w-15 h-1 mx-auto rounded-full  bg-[${colors.darkPurple}]`}
//           />
//           <View>
//             <View style={[tw` py-4`, {marginLeft: perWidth(30)}]}>
//               <Textcomp
//                 text={'Rate your Experience'}
//                 size={17}
//                 lineHeight={17}
//                 color={'#000000'}
//                 fontFamily={'Inter-Bold'}
//               />
//             </View>
//             <View style={[tw`px-[7.5%] mt-1`, {}]}>
//               <Textcomp
//                 text={
//                   'Please rate your and describe your experience. Your answer will help other buyers to communicate with the service provider.  '
//                 }
//                 size={14}
//                 lineHeight={17}
//                 color={'#000000'}
//                 fontFamily={'Inter-Regular'}
//               />
//             </View>
// <View
//   style={[tw`px-[7.5%] mt-4 flex flex-col justify-between `, {}]}>
//   <View style={tw`mb-2`}>
//     <Textcomp
//       text={'Rate your Experience'}
//       size={12}
//       lineHeight={14}
//       color={'#000000'}
//       fontFamily={'Inter-Regular'}
//     />
//   </View>
//   <Review2
//     value={rateExperience}
//     func={text => setrateExperience(text)}
//   />
// </View>
// <View
//   style={[tw`px-[7.5%] mt-4 flex flex-col justify-between `, {}]}>
//   <View style={tw`mb-2`}>
//     <Textcomp
//       text={'Recommend to a Friend'}
//       size={12}
//       lineHeight={14}
//       color={'#000000'}
//       fontFamily={'Inter-Regular'}
//     />
//   </View>
//   <Review2 value={recommend} func={text => setrecommend(text)} />
// </View>
// <View
//   style={[tw`px-[7.5%] mt-4 flex flex-col justify-between `, {}]}>
//   <View style={tw`mb-2`}>
//     <Textcomp
//       text={'Service as Described'}
//       size={12}
//       lineHeight={14}
//       color={'#000000'}
//       fontFamily={'Inter-Regular'}
//     />
//   </View>
//   <Review2
//     value={rateService}
//     func={text => setrateService(text)}
//   />
// </View>
//             <View style={[tw`px-[7.5%] mt-4`, {}]}>
//               <TextInput
//                 multiline
//                 style={[
//                   tw`bg-[#EBEBEB] px-4 rounded-lg`,
//                   {height: perHeight(60)},
//                 ]}
//                 onChangeText={text => {
//                   setcomment(text);
//                 }}
//               />
//             </View>
//             <TouchableOpacity
//               onPress={() => {
//                 // initRating();
//                 OnFinish({
//                   communication: rateExperience,
//                   recommend: recommend,
//                   serviceAsDescribed: rateService,
//                   comment: comment,
//                 });
//               }}
//               style={[
//                 {
//                   width: perWidth(316),
//                   height: perHeight(40),
//                   borderRadius: 13,
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   backgroundColor: colors.darkPurple,
//                   marginTop: 20,
//                 },
//                 tw`mx-auto`,
//               ]}>
//               <Textcomp
//                 text={'Done'}
//                 size={14}
//                 lineHeight={17}
//                 color={'#FFC727'}
//                 fontFamily={'Inter-SemiBold'}
//               />
//             </TouchableOpacity>
//           </View>
//           <View
//             style={[
//               tw`bg-black mt-auto mb-4`,
//               {height: 2, width: WIDTH_WINDOW * 0.95},
//             ]}
//           />
//         </View>
//       </View>
//     </Modal>
//   );
// }

import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, TextInput, Keyboard} from 'react-native';
import tw from 'twrnc';
import {SIZES, perHeight, perWidth} from '../../utils/position/sizes';
import Textcomp from '../Textcomp';
import colors from '../../constants/colors';
import {WIDTH_WINDOW} from '../../constants/generalStyles';
import Modal from 'react-native-modal/dist/modal';
import Review2 from '../Review2';
// import {sendRatings} from '../../utils/api/func';
import Snackbar from 'react-native-snackbar';

export default function RateyourExperience({
  navigation,
  visible,
  func,
  item,
  OnFinish,
}: any) {
  const [InfoModal, setInfoModal] = useState(visible);

  const [isLoading, setisLoading] = useState(false);
  const [comment, setcomment] = useState('');

  const [rateExperience, setrateExperience] = useState(0);
  const [recommend, setrecommend] = useState(0);
  const [rateService, setrateService] = useState(0);

  const id = item?._id;
  // Validation function to check if the comment is provided
  const isValid = () => {
    return comment.trim().length > 0;
  };
  const handleFinish = () => {
    // Validate if the comment is provided
    // if (!isValid()) {
    //   Snackbar.show({
    //     text: 'Please provide a comment.',
    //     duration: Snackbar.LENGTH_SHORT,
    //     backgroundColor: 'red',
    //   });
    //   return;
    // }
    if (rateExperience === 0 || recommend === 0 || rateService === 0) {
      Snackbar.show({
        text: 'Please provide ratings for all categories.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
      });
      return;
    }
    // Call the onFinish function if all validations pass
    OnFinish({
      communication: rateExperience,
      recommend: recommend,
      serviceAsDescribed: rateService,
      comment: comment,
    });
  };

  const [modalHeight, setModalHeight] = useState('70%'); // Initial modal height

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setModalHeight('90%'); // Update modal height when keyboard is shown
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setModalHeight('70%'); // Reset modal height when keyboard is hidden
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <Modal
      isVisible={visible}
      onModalHide={() => {
        func(false);
      }}
      style={{width: SIZES.width, marginHorizontal: 0}}
      deviceWidth={SIZES.width}
      onBackdropPress={() => func(false)}
      swipeThreshold={200}
      swipeDirection={['down']}
      onSwipeComplete={() => func(false)}
      onBackButtonPress={() => func(false)}>
      <View style={tw` h-full w-full bg-black bg-opacity-5`}>
        <TouchableOpacity onPress={() => func(false)} style={tw`flex-1`} />
        <View style={[tw` mt-auto bg-[#D9D9D9]`, {height: modalHeight}]}>
          <TouchableOpacity
            onPress={() => {
              func(false);
            }}
            style={tw`w-15 h-1 mx-auto rounded-full  bg-[${colors.darkPurple}]`}
          />
          <View>
            <View style={[tw` py-4`, {marginLeft: perWidth(30)}]}>
              <Textcomp
                text={'Complete Order: Rate your Experience'}
                size={17}
                lineHeight={17}
                color={'#000000'}
                fontFamily={'Inter-Bold'}
              />
            </View>
            <View style={[tw`px-[7.5%] mt-1`, {}]}>
              <Textcomp
                text={
                  'Please rate your service provider and describe your experience. This is Important for the service provider to get paid.'
                }
                size={14}
                lineHeight={17}
                color={'#000000'}
                fontFamily={'Inter-Regular'}
              />
            </View>
            <View
              style={[tw`px-[7.5%] mt-4 flex flex-col justify-between `, {}]}>
              <View style={tw`mb-2`}>
                <Textcomp
                  text={'Communication Level'}
                  size={12}
                  lineHeight={14}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                />
              </View>
              <Review2
                value={rateExperience}
                func={text => setrateExperience(text)}
              />
            </View>
            <View
              style={[tw`px-[7.5%] mt-4 flex flex-col justify-between `, {}]}>
              <View style={tw`mb-2`}>
                <Textcomp
                  text={'Recommend to a Friend'}
                  size={12}
                  lineHeight={14}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                />
              </View>
              <Review2 value={recommend} func={text => setrecommend(text)} />
            </View>
            <View
              style={[tw`px-[7.5%] mt-4 flex flex-col justify-between `, {}]}>
              <View style={tw`mb-2`}>
                <Textcomp
                  text={'Service as Described'}
                  size={12}
                  lineHeight={14}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                />
              </View>
              <Review2
                value={rateService}
                func={text => setrateService(text)}
              />
            </View>
            <View
              style={[tw`px-[7.5%] mt-4 flex flex-col justify-between `, {}]}>
              <TextInput
                multiline
                style={[
                  tw`bg-[#EBEBEB] px-4 rounded-lg`,
                  {height: perHeight(60)},
                ]}
                onChangeText={text => {
                  setcomment(text);
                }}
                placeholder="Satisfied with the job? Share your review"
              />
            </View>
            <TouchableOpacity
              onPress={handleFinish} // Use the handleFinish function for the "Done" button
              style={[
                {
                  width: perWidth(316),
                  height: perHeight(40),
                  borderRadius: 13,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.darkPurple,
                  marginTop: 20,
                },
                tw`mx-auto`,
              ]}>
              <Textcomp
                text={'Done'}
                size={14}
                lineHeight={17}
                color={'#FFC727'}
                fontFamily={'Inter-SemiBold'}
              />
            </TouchableOpacity>
          </View>
          <View
            style={[
              tw`bg-black mt-auto mb-4`,
              {height: 2, width: WIDTH_WINDOW * 0.95},
            ]}
          />
        </View>
      </View>
    </Modal>
  );
}
