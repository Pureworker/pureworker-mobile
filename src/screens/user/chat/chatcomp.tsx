// import {Image, Linking, Pressable, View} from 'react-native';
// import React, {useEffect} from 'react';
// import tw from 'twrnc';

// import Textcomp from '../../../components/Textcomp';
// import {perHeight, perWidth} from '../../../utils/position/sizes';
// import colors from '../../../constants/colors';
// import {messageTimeStamp} from '../../../utils/utils';
// import {urlValidator} from '../../../utils/chat';
// import {markAsRead} from '../../../utils/api/chat';
// import FastImage from 'react-native-fast-image';

// interface params {
//   text: string;
//   type: string;
//   time: any;
//   isRead: boolean;
//   id: string;
//   toggleImageModal: (link?: string) => void;
// }

// export default function Index({
//   type,
//   text,
//   time,
//   isRead,
//   id,
//   toggleImageModal,
// }: params) {
//   const isUrl = urlValidator(text);

//   console.log(isUrl, time);

//   console.log('chatty--',text, isRead, id);


//   useEffect(() => {

//     if (!isRead) {
//       markAsRead(id);
//     }
//   }, []);

//   return (
//     <>
//       {isUrl ? (
//         <Pressable
//           onPress={() => toggleImageModal(text)}
//           style={[
//             tw`bg-[${type === 'me' ? colors.parpal : '#011B33'}] ${
//               type === 'me' ? 'mr-auto' : 'ml-auto'
//             }`,
//             {
//               borderRadius: 6,
//               minWidth: perWidth(60),
//               maxWidth: perWidth(270),
//               paddingVertical: perHeight(10),
//               paddingHorizontal: perWidth(10),
//               minHeight: perHeight(36),
//               marginTop: perHeight(12),
//             },
//           ]}>
//           <FastImage
//             style={{width: 100, height: 100}}
//             source={{
//               uri: text,
//               headers: {Authorization: 'someAuthToken'},
//               priority: FastImage.priority.high,
//             }}
//             resizeMode={FastImage.resizeMode.contain}
//           />
//           {/* <Image
//             source={{uri: text}}
//             style={{width: 100, height: 100}}
//             resizeMode="contain"
//           /> */}
//         </Pressable>
//       ) : (
//         <View
//           style={[
//             tw`bg-[${type === 'me' ? colors.parpal : '#011B33'}] ${
//               type === 'me' ? 'mr-auto' : 'ml-auto'
//             }`,
//             {
//               borderRadius: 6,
//               minWidth: perWidth(60),
//               maxWidth: perWidth(270),
//               paddingVertical: perHeight(10),
//               paddingHorizontal: perWidth(10),
//               minHeight: perHeight(36),
//               marginTop: perHeight(12),
//             },
//           ]}>
//           <Textcomp
//             size={14}
//             lineHeight={21}
//             text={text}
//             color={'#FFFFFF'}
//             style={{fontWeight: '500'}}
//             fontFamily={'Inter'}
//           />
//         </View>
//       )}
//       <View style={tw`${type === 'me' ? 'mr-auto' : 'ml-auto'}`}>
//         <Textcomp
//           size={8}
//           lineHeight={21}
//           text={`${messageTimeStamp(time)}`}
//           color={'#000000'}
//           style={{fontWeight: '500'}}
//           fontFamily={'Inter'}
//         />
//       </View>
//     </>
//   );
// }


import { Image, Linking, Pressable, View } from 'react-native';
import React, { useEffect } from 'react';
import tw from 'twrnc';
import Textcomp from '../../../components/Textcomp';
import { perHeight, perWidth } from '../../../utils/position/sizes';
import colors from '../../../constants/colors';
import { messageTimeStamp } from '../../../utils/utils';
import { urlValidator } from '../../../utils/chat';
import { markAsRead } from '../../../utils/api/chat';
import FastImage from 'react-native-fast-image';

interface params {
  text: string;
  type: string;
  time: any;
  isRead: boolean;
  id: string;
  toggleImageModal: (link?: string) => void;
}

export default function Index({
  type,
  text,
  time,
  isRead,
  id,
  toggleImageModal,
}: params) {
  const isUrl = urlValidator(text);

  console.log(isUrl, time);

  console.log('chatty--', text, isRead, id);

  useEffect(() => {
    if (!isRead) {
      markAsRead(id);
    }
  }, []);

  const renderTextWithLinks = (text) => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlPattern);

    return parts.map((part, index) => {
      if (urlPattern.test(part)) {
        return (
          <Pressable
            key={index}
            onPress={() => Linking.openURL(part)}
            style={{ paddingHorizontal: 2 }}
          >
            <Textcomp
              size={14}
              lineHeight={21}
              text={part}
              color={'#1E90FF'}
              style={{ fontWeight: '500' }}
              fontFamily={'Inter'}
            />
          </Pressable>
        );
      } else {
        return (
          <Textcomp
            key={index}
            size={14}
            lineHeight={21}
            text={part}
            color={'#FFFFFF'}
            style={{ fontWeight: '500' }}
            fontFamily={'Inter'}
          />
        );
      }
    });
  };

  return (
    <>
      {isUrl ? (
        <Pressable
          onPress={() => toggleImageModal(text)}
          style={[
            tw`bg-[${type === 'me' ? colors.parpal : '#011B33'}] ${
              type === 'me' ? 'mr-auto' : 'ml-auto'
            }`,
            {
              borderRadius: 6,
              minWidth: perWidth(60),
              maxWidth: perWidth(270),
              paddingVertical: perHeight(10),
              paddingHorizontal: perWidth(10),
              minHeight: perHeight(36),
              marginTop: perHeight(12),
            },
          ]}
        >
          <FastImage
            style={{ width: 100, height: 100 }}
            source={{
              uri: text,
              headers: { Authorization: 'someAuthToken' },
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </Pressable>
      ) : (
        <View
          style={[
            tw`bg-[${type === 'me' ? colors.parpal : '#011B33'}] ${
              type === 'me' ? 'mr-auto' : 'ml-auto'
            }`,
            {
              borderRadius: 6,
              minWidth: perWidth(60),
              maxWidth: perWidth(270),
              paddingVertical: perHeight(10),
              paddingHorizontal: perWidth(10),
              minHeight: perHeight(36),
              marginTop: perHeight(12),
            },
          ]}
        >
          {renderTextWithLinks(text)}
        </View>
      )}
      <View style={tw`${type === 'me' ? 'mr-auto' : 'ml-auto'}`}>
        <Textcomp
          size={8}
          lineHeight={21}
          text={`${messageTimeStamp(time)}`}
          color={'#000000'}
          style={{ fontWeight: '500' }}
          fontFamily={'Inter'}
        />
      </View>
    </>
  );
}
