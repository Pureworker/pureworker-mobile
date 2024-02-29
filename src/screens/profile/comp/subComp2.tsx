import React, {useState} from 'react';
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,FlatList
} from 'react-native';
import TextWrapper from '../../../components/TextWrapper';
import tw from 'twrnc';
import colors from '../../../constants/colors';
import {HEIGHT_SCREEN} from '../../../constants/generalStyles';
import {launchImageLibrary} from 'react-native-image-picker';
import CancelCircle2 from '../../../assets/svg/CancelCircle2';
import {uploadAssetsDOCorIMG} from '../../../utils/api/func';
import {ActivityIndicator} from 'react-native-paper';
export default function SubPortComp2({
  lindex,
  portfolioData,
  handlePortfolioItemChange,
  remove,
}: any) {
  const [shortDescription, setShortDescription] = useState(
    portfolioData?.description ?? '',
  );
  const [pictures, setPictures] = useState<Array<string>>(
    portfolioData?.images ?? [],
  );
  const options = {
    mediaType: 'photo',
    selectionLimit: Platform.OS === 'android' ? 2 : 3,
  };

  console.log('pd', portfolioData);

  //
  const UpdateValue = (field: string | number, data: any) => {
    const oldDate = {description: shortDescription, images: [...pictures]};
    oldDate[field] = data;
    handlePortfolioItemChange(lindex, oldDate);
  };
  const [isLoading, setisLoading] = useState(false);
  const openLibraryfordp = async () => {
    launchImageLibrary(options, async (resp: any) => {
      if (resp?.assets?.length > 0) {
        console.log('============res list========================');
        console.log(resp?.assets);
        console.log('====================================');
        // Iterate through selected images

        let img:any = []
        for (const item of resp.assets) {
          const localUri = item.uri;
          try {
            const processedLink = await uploadImgorDoc(item);
            console.log('returned:', processedLink);
            // Update the state or save the processed link instead of local URI
            setPictures(prevPictures => [...prevPictures, processedLink]);
            img.push(processedLink);
          } catch (error) {
            console.error('Error uploading image:', error);
            setisLoading(false);
            // Handle error as needed
          }
        }
        UpdateValue('images', [...img]);
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
  const removePicture = (indexToRemove: number) => {
    console.log(indexToRemove);

    const updatedPictures = pictures.filter(
      (_, index) => index !== indexToRemove,
    );
    console.log(updatedPictures);
    setPictures(updatedPictures);
    UpdateValue('images', updatedPictures);
  };

  return (
    <View
      style={[
        tw`border-2 border-[${colors.parpal}] p-1 rounded-lg py-4 px-4`,
        {marginTop: 30},
      ]}>
      <View style={tw`absolute top-[-5] ml-2 bg-[${colors.greyLight}]`}></View>
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
          const words = text.split(' ');
          const limitedWords = words.slice(0, 20);
          const limitedText = limitedWords.join(' ');
          setShortDescription(limitedText);
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
          remove();
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
