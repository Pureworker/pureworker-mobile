import React, {useState} from 'react';
import {View, Image, TextInput, TouchableOpacity} from 'react-native';
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

  const openLibraryfordp = () => {
    launchImageLibrary(options, async (resp: any) => {
      if (resp?.assets?.length > 0) {
        console.log('============res list========================');
        console.log(resp?.assets);
        console.log('====================================');
        const arr = resp?.assets?.map((item: any) => item?.uri);
        setPictures(arr);
        UpdateValue('images', arr);
      }
    });
  };

  const UpdateValue = (field: string | number, data: any) => {
    const oldDate = {description: shortDescription, images: [...pictures]};
    oldDate[field] = data;
    handlePortfolioItemChange(lindex, oldDate);
  };

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
          setShortDescription(text);
          UpdateValue('description', text);
        }}
      />

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
