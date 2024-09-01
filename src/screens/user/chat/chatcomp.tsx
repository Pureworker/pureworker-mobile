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

import {Image, Linking, Platform, Pressable, View} from 'react-native';
import React, {useEffect} from 'react';
import tw from 'twrnc';
import Textcomp from '../../../components/Textcomp';
import {perHeight, perWidth} from '../../../utils/position/sizes';
import colors from '../../../constants/colors';
import {messageTimeStamp, ToastShort} from '../../../utils/utils';
import {urlValidator} from '../../../utils/chat';
import {markAsRead} from '../../../utils/api/chat';
import FastImage from 'react-native-fast-image';
import RNFS from 'react-native-fs';
import {toastAlertSuccess} from '../../../utils/alert';
import images from '../../../constants/images';
import RNFetchBlob from 'rn-fetch-blob';

interface params {
  text: string;
  type: string;
  time: any;
  isRead: boolean;
  id: string;
  toggleImageModal: (link?: string) => void;
  msgType: string;
}

export default function Index({
  type,
  text,
  time,
  isRead,
  id,
  toggleImageModal,
  msgType,
}: params) {
  const isUrl = urlValidator(text);

  console.log(isUrl, time);

  console.log('chatty--', text, isRead, id);

  useEffect(() => {
    if (!isRead) {
      markAsRead(id);
    }
  }, []);

  const renderTextWithLinks = text => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlPattern);

    return parts.map((part, index) => {
      if (urlPattern.test(part)) {
        return (
          <Pressable
            key={index}
            onPress={() => Linking.openURL(part)}
            style={{paddingHorizontal: 2}}>
            <Textcomp
              size={14}
              lineHeight={21}
              text={part}
              color={'#1E90FF'}
              style={{fontWeight: '500'}}
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
            style={{fontWeight: '500'}}
            fontFamily={'Inter'}
          />
        );
      }
    });
  };

  // const _handleFileDownload = async () => {
  //   try {
  //     const downloadDest = `${RNFS.DocumentDirectoryPath}/${text
  //       .split('/')
  //       .pop()}`;
  //     const result = await RNFS.downloadFile({
  //       fromUrl: text,
  //       toFile: downloadDest,
  //     }).promise;

  //     if (result.statusCode === 200) {
  //       console.log('File Downloaded Successfully:', downloadDest);
  //       ToastShort('File Downloaded Successfully.');
  //       // Optionally, you can open the file or give feedback to the user
  //     } else {
  //       console.log('File Download Failed');
  //       ToastShort('File Download Failed');
  //     }
  //   } catch (error) {
  //     console.error('Error downloading file:', error);
  //     ToastShort(`Error downloading file ${error}`);
  //   }
  // };

  // const __handleFileDownload = async () => {
  //   try {
  //     // Get the file name from the URL
  //     const fileName = text.split('/').pop();

  //     // Use the appropriate path for Android and iOS
  //     const downloadDest =
  //       Platform.OS === 'android'
  //         ? `${RNFS.DownloadDirectoryPath}/${fileName}`
  //         : `${RNFS.DocumentDirectoryPath}/${fileName}`;

  //     const result = await RNFS.downloadFile({
  //       fromUrl: text,
  //       toFile: downloadDest,
  //     }).promise;

  //     if (result.statusCode === 200) {
  //       console.log('File Downloaded Successfully:', downloadDest);
  //       ToastShort('File Downloaded Successfully.');

  //       // On Android, open the file in a file viewer
  //       if (Platform.OS === 'android') {
  //         RNFS.scanFile({path: downloadDest}).then(() => {
  //           console.log('Scanned file successfully:', downloadDest);
  //         });
  //       }
  //     } else {
  //       console.log('File Download Failed');
  //       ToastShort('File Download Failed');
  //     }
  //   } catch (error) {
  //     console.error('Error downloading file:', error);
  //     ToastShort(`Error downloading file ${error}`);
  //   }
  // };

  // const ___handleFileDownload = async () => {
  //   try {
  //     const {config, fs} = RNFetchBlob;
  //     let downloadDest = '';

  //     // Set the download destination based on platform
  //     if (Platform.OS === 'android') {
  //       downloadDest = `${fs?.dirs?.DownloadDir}/${text.split('/').pop()}`;
  //     } else {
  //       downloadDest = `${fs?.dirs?.DocumentDir}/${text.split('/').pop()}`;
  //     }

  //     const res = await config({
  //       fileCache: true,
  //       addAndroidDownloads: {
  //         useDownloadManager: true,
  //         notification: true,
  //         path: downloadDest,
  //         description: 'Downloading file...',
  //       },
  //     }).fetch('GET', text);

  //     if (res.info().status === 200) {
  //       console.log('File Downloaded Successfully:', downloadDest);
  //       ToastShort('File Downloaded Successfully.');

  //       if (Platform.OS === 'ios') {
  //         RNFetchBlob.ios.previewDocument(downloadDest); // Preview file on iOS
  //       } else {
  //         ToastShort(`File saved to: ${downloadDest}`); // Notify Android users of the file path
  //       }
  //     } else {
  //       console.log('File Download Failed');
  //       ToastShort('File Download Failed');
  //     }
  //   } catch (error) {
  //     console.error('Error downloading file:', error);
  //     ToastShort(`Error downloading file: ${error}`);
  //   }
  // };

  const handleFileDownload = async () => {
    try {
      const {config, fs} = RNFetchBlob;
      const fileName = text.split('/').pop();
      const downloadDest =
        Platform.OS === 'android'
          ? `${fs.dirs.DownloadDir}/${fileName}`
          : `${fs.dirs.DocumentDir}/${fileName}`;

      const res = await config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: downloadDest,
          description: 'Downloading file...',
        },
      }).fetch('GET', text);

      if (res.info().status === 200) {
        console.log('File Downloaded Successfully:', downloadDest);
        ToastShort('File Downloaded Successfully.');

        if (Platform.OS === 'ios') {
          RNFetchBlob.ios.previewDocument(downloadDest);
        } else {
          ToastShort(`File saved to: ${downloadDest}`);
        }
      } else {
        console.log('File Download Failed');
        ToastShort('File Download Failed');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      ToastShort(`Error downloading file: ${error}`);
    }
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
              paddingVertical: perHeight(5),
              minHeight: perHeight(36),
              marginTop: perHeight(12),
            },
          ]}>
          <FastImage
            style={{width: 100, height: 100}}
            source={{
              uri: text,
              headers: {Authorization: 'someAuthToken'},
              priority: FastImage.priority.high,
              // cache: FastImage.cacheControl.cacheOnly
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </Pressable>
      ) : msgType === 'file' ? (
        <>
          <Pressable
            onPress={handleFileDownload}
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
                flexDirection: 'row',
                alignItems: 'center',
              },
            ]}>
            <Image
              resizeMode="contain"
              source={images.attachment}
              style={[
                tw`w-full my-auto mr-3`,
                {
                  height: 17.5,
                  width: 17.5,
                  tintColor: 'white',
                },
              ]}
            />
            <Textcomp
              size={14}
              lineHeight={21}
              text={'File Attachment'}
              color={'#1E90FF'}
              style={{fontWeight: '500'}}
              fontFamily={'Inter'}
            />
          </Pressable>
        </>
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
          ]}>
          {renderTextWithLinks(text)}
        </View>
      )}
      <View style={tw`${type === 'me' ? 'mr-auto' : 'ml-auto'}`}>
        <Textcomp
          size={8}
          lineHeight={21}
          text={`${messageTimeStamp(time)}`}
          color={'#000000'}
          style={{fontWeight: '500'}}
          fontFamily={'Inter'}
        />
      </View>
    </>
  );
}
