import React, {useState} from 'react';
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '../../../constants/navigation';
import TextWrapper from '../../../components/TextWrapper';
import tw from 'twrnc';
import colors from '../../../constants/colors';
import {HEIGHT_SCREEN} from '../../../constants/generalStyles';
import {launchImageLibrary} from 'react-native-image-picker';
import {FlatList} from 'react-native-gesture-handler';
import {ToastShort} from '../../../utils/utils';
import images from '../../../constants/images';
import CancelCircle2 from '../../../assets/svg/CancelCircle2';
import {uploadAssetsDOCorIMG} from '../../../utils/api/func';
import {ActivityIndicator} from 'react-native-paper';
import Textarea from 'react-native-textarea';
export default function SubPortComp({
  lindex,
  portfolioData,
  handlePortfolioItemChange,
  remove,
}: any) {
  //   const [service_, setservice_] = useState(null);
  //   const [dropdownOpen, setdropdownOpen] = useState(false);
  //   const navigation = useNavigation<StackNavigation>();
  //   const [shortDescription, setShortDescription] = useState('');
  //   const [pictures, setpictures] = useState([]);
  //   const options = {mediaType: 'photo', selectionLimit: 3};
  //   const openLibraryfordp = () => {
  //     launchImageLibrary(options, async (resp: unknown) => {
  //       if (resp?.assets?.length > 0) {
  //         console.log('resp', resp?.assets);
  //         let arr: any = [];
  //         resp?.assets?.map(item => {
  //           arr.push(item?.uri);
  //         });

  //         setpictures(arr);
  //         UpdateValue('images', arr);
  //       }
  //     });
  //   };
  //   //   console.log(portfolioData?.[lindex]);
  //   const UpdateValue = (field: string | number, data: any) => {
  //     const olddate = portfolioData?.[lindex];
  //     if (olddate.service === '' || olddate.service?.length < 1) {
  //       if (service_ !== null && service_ !== '') {
  //         olddate.service = service_;
  //       } else {
  //         ToastShort('Please pick service');
  //         return;
  //       }
  //     }
  //     olddate[field] = data;
  //     handlePortfolioItemChange(lindex, olddate);
  //     console.log('olddate-now', olddate);
  //   };

  const [shortDescription, setShortDescription] = useState('');
  const [pictures, setPictures] = useState<Array<string>>([]);
  const options = {mediaType: 'photo', selectionLimit: 3};

  //
  const UpdateValue = (field: string | number, data: any) => {
    const oldDate = {description: shortDescription, images: [...pictures]};
    oldDate[field] = data;
    handlePortfolioItemChange(lindex, oldDate);
  };

  // const openLibraryfordp = () => {
  //   launchImageLibrary(options, async (resp: any) => {
  //     if (resp?.assets?.length > 0) {
  //       console.log('============res list========================');
  //       console.log(resp?.assets);
  //       console.log('====================================');
  //       const arr = resp?.assets?.map((item: any) => item?.uri);
  //       setPictures(arr);
  //       UpdateValue('images', arr);
  //     }
  //   });
  // };
  const [isLoading, setisLoading] = useState(false);
  const openLibraryfordp = async () => {
    launchImageLibrary(options, async (resp: any) => {
      if (resp?.assets?.length > 0) {
        console.log('============res list========================');
        console.log(resp?.assets);
        console.log('====================================');
        // Iterate through selected images
        for (const item of resp.assets) {
          const localUri = item.uri;
          // Make post-call to upload image
          try {
            // const processedLink = await uploadImage(localUri);
            const processedLink = await uploadImgorDoc(item);
            console.log('returned:', processedLink);

            // Update the state or save the processed link instead of local URI
            setPictures(prevPictures => [...prevPictures, processedLink]);
            UpdateValue('images', [...pictures, processedLink]);
          } catch (error) {
            console.error('Error uploading image:', error);
            setisLoading(false);
            // Handle error as needed
          }
        }
      }
    });
  };
  const uploadImgorDoc = async (param: {
    uri: string;
    name: string | null;
    copyError: string | undefined;
    fileCopyUri: string | null;
    type: string | null;
    size: number | null;
  }) => {
    setisLoading(true);
    const res: any = await uploadAssetsDOCorIMG(param);
    if (res?.status === 201 || res?.status === 200) {
      console.log('ApartmentType', res?.data);
      setisLoading(false);
      return res?.data?.url;
    }
    setisLoading(false);
  };

  // Assuming you have an uploadImage function that makes a post-call
  // const uploadImage = async (localUri: string) => {
  //   // Logic for making post-call and getting processed link
  //   // Replace this with your actual implementation
  //   // For example, using fetch or axios to upload the image
  //   const response = await fetch('your_upload_endpoint', {
  //     method: 'POST',
  //     body: // Create a FormData with the image file
  //     // Handle headers and other necessary configurations
  //   });

  //   if (!response.ok) {
  //     throw new Error('Error uploading image');
  //   }

  //   const responseData = await response.json();
  //   return responseData.processedLink; // Replace with the actual property in your response
  // };

  return (
    <View
      style={[
        tw`border-2 border-[${colors.parpal}] p-1 rounded-lg py-4 px-4`,
        {marginTop: 30},
      ]}>
      <View style={tw`absolute top-[-5] ml-2 bg-[${colors.greyLight}]`}>
        {/* <TextWrapper
          children={`Portfolio ${lindex}`}
          isRequired={false}
          fontType={'semiBold'}
          style={[
            tw`px-2 `,
            {fontSize: 16, marginTop: 0, color: colors.black, padding: 3},
          ]}
        /> */}
      </View>
      <TextWrapper
        children="Short Description"
        isRequired={false}
        fontType={'semiBold'}
        style={{fontSize: 16, marginTop: 0, color: colors.black}}
      />
      <TextInput
        style={{
          paddingHorizontal: 10,
          marginTop: 10,
          height: 60,
          backgroundColor: colors.greyLight1,
          borderRadius: 5,
          color: '#000',
        }}
        placeholderTextColor={colors.grey}
        multiline
        placeholder={'Briefly talk about the portfolio .....Max: 20 words'}
        value={shortDescription}
        onChangeText={text => {
          // setShortDescription(text);
          // UpdateValue('description', text);
          // Split the text into words
          const words = text.split(' ');
          // Limit the words to 20
          const limitedWords = words.slice(0, 20);
          // Join the limited words back into a string
          const limitedText = limitedWords.join(' ');
          // Set the state with the limited text
          setShortDescription(limitedText);
          // Update the value (if needed)
          UpdateValue('description', limitedText);
        }}
      />

      {isLoading && (
        <ActivityIndicator size={'small'} color={colors.darkPurple} />
      )}
      {pictures?.length < 1 ? (
        <View style={tw`flex flex-row`}>
          <TouchableOpacity
            onPress={() => {
              openLibraryfordp();
            }}
            style={[
              tw`border rounded-lg w-full mt-4 items-center justify-center mx-auto `,
              {
                height: HEIGHT_SCREEN * 0.1,
                borderStyle: 'dotted',
                borderColor: colors.parpal,
              },
            ]}>
            <TextWrapper
              children="Add work pictures"
              isRequired={false}
              fontType={'semiBold'}
              style={{
                fontSize: 16,
                color: colors.black,
              }}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={tw`mt-6`}>
          <FlatList
            style={{flex: 0}}
            data={pictures}
            scrollEnabled={false}
            horizontal={true}
            renderItem={(item: any, index: any) => {
              // console.log(item);
              return (
                <View key={index} style={tw`ml-4 `}>
                  <Image
                    source={{uri: item.item}}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 5,
                    }}
                  />
                  <TouchableOpacity
                    style={tw` w-1/4 items-center mt-1 bg-red-800 rounded-full `}
                    onPress={() => {
                    }}>
                    <Text style={[tw`text-white bold`, {fontWeight: '700', fontSize: 14, lineHeight: 14}]}>X</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
            keyExtractor={item => item?.id}
            ListFooterComponent={() => <View style={tw`h-20`} />}
            contentContainerStyle={{paddingBottom: 20}}
          />
        </View>
      )}

      <TouchableOpacity
        style={tw`absolute right-[-2] top-[-4]`}
        onPress={() => {
          // remove();
        }}>
        <CancelCircle2 />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container2: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textareaContainer: {
    height: 80,
    padding: 10,
    backgroundColor: colors.greyLight1,
    borderRadius: 5,
    marginTop: 10,
  },
  textarea: {
    textAlignVertical: 'top', // hack android
    height: 170,
    fontSize: 14,
    color: 'black',
  },
});
