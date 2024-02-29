import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,FlatList
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '../../../constants/navigation';
import TextWrapper from '../../../components/TextWrapper';
import commonStyle from '../../../constants/commonStyle';
import tw from 'twrnc';
import colors from '../../../constants/colors';
import {useDispatch, useSelector} from 'react-redux';
import {HEIGHT_SCREEN, WIDTH_WINDOW} from '../../../constants/generalStyles';
import DropDownPicker from 'react-native-dropdown-picker';
import Snackbar from 'react-native-snackbar';
import {launchImageLibrary} from 'react-native-image-picker';
import {addcompleteProfile} from '../../../store/reducer/mainSlice';
import {ToastShort} from '../../../utils/utils';
export default function PortComp({
  dlist,
  lindex,
  portfolioData,
  handlePortfolioItemChange,
}: any) {
  //   console.log('passed Data', dlist, 'psss2', lindex);
  const [service_, setservice_] = useState(null);
  const [dropdownOpen, setdropdownOpen] = useState(false);
  const navigation = useNavigation<StackNavigation>();
  const [idNumber, setIdNumber] = useState('');
  const category = useSelector((state: any) => state.user.pickedServices);
  const [selectedVerification, setSelectedVerification] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const dispatch = useDispatch();
  const handleProfileSetup = () => {
    if (idNumber && selectedVerification) {
      const profileData = {
        serviceId: route?.params?.serviceId,
        idNumber: idNumber,
        potfolios: [],
        scheduleDate: null,
        appointmentTime: null,
      };

      if (getUser?.user?.accountType?.toUpperCase() === 'FREELANCER') {
        dispatch(
          addcompleteProfile({
            identity: {
              means: selectedVerification,
              number: idNumber,
            },
          }),
        );
      }
      if (getUser?.user?.accountType?.toUpperCase() === 'BUSINESS') {
        dispatch(
          addcompleteProfile({
            identity: {
              businessName: selectedVerification,
              cac: idNumber,
            },
          }),
        );
      }
      navigation.navigate('ProfileStep5', {
        serviceId: route?.params?.serviceId,
      });
      // createService(profileData)
      //   .unwrap()
      //   .then((data: any) => {
      //     if (data) {
      //       navigation.navigate('ProfileStep5', {
      //         serviceId: route?.params?.serviceId,
      //       });
      //     }
      //   })
      //   .catch((error: any) => {
      //     console.log('err', error);
      //     Snackbar.show({
      //       text: error.data.message,
      //       duration: Snackbar.LENGTH_LONG,
      //       textColor: '#fff',
      //       backgroundColor: '#88087B',
      //     });
      //   });
    } else {
      Snackbar.show({
        text: 'Please fill all fields',
        duration: Snackbar.LENGTH_LONG,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
    }
  };
  const completeProfileData = useSelector(
    (state: any) => state.user.completeProfileData,
  );
  const [serviceList, setserviceList] = useState(dlist);

  useEffect(() => {
    setserviceList(dlist);
  }, [dlist]);

  const [pictures, setpictures] = useState([]);
  const options = {mediaType: 'photo', selectionLimit: 3};
  const openLibraryfordp = () => {
    launchImageLibrary(options, async (resp: unknown) => {
      if (resp?.assets?.length > 0) {
        console.log('resp', resp?.assets);
        let arr: any = [];
        resp?.assets?.map(item => {
          arr.push(item?.uri);
        });

        setpictures(arr);
        UpdateValue('images', arr);
        // setPhotoUri(resp?.assets[0].uri);
        // setImageUrl(resp?.assets[0].uri);
        // const data = await uploadImgorDoc(resp?.assets[0]);
        // console.warn('processed pic', data);
        // dispatch(addcompleteProfile({profilePic: data}));
        // const res: any = await completeProfile({profilePic: data});
      }
    });
    // launchCamera
  };

  //   console.log(portfolioData?.[lindex]);
  const UpdateValue = (field: string | number, data: any) => {
    const olddate = portfolioData?.[lindex];
    if (olddate.service === '' || olddate.service?.length < 1) {
      if (service_ !== null && service_ !== '') {
        olddate.service = service_;
      } else {
        ToastShort('Please pick service');
        return;
      }
    }
    olddate[field] = data;
    handlePortfolioItemChange(lindex, olddate);
    console.log('olddate-now', olddate);
  };
  const tempdata = [
    {
      __v: 0,
      _id: '64eb95cdd0ea85df8ffa4fac',
      label: 'Office furniture assembly',
      name: 'Office furniture assembly',
      value: 'Office furniture assembly',
    },
    {
      __v: 0,
      _id: '64eb95e7d0ea85df8ffa5024',
      label: 'Pet sitting and dog walking',
      name: 'Pet sitting and dog walking',
      value: 'Pet sitting and dog walking',
    },
  ];

  const handleServiceChange = (item: any) => {
    // Update the selected service state
    // setSelectedService(item.value);
    console.log('settttt', item);
    // Update the other state with the same value
    // setOtherState(item.value);
  };

  const handleRemovePortfolio = () => {
    // Remove the selected portfolio item from the state
    const updatedPortfolioData = [...portfolioData];
    updatedPortfolioData.splice(lindex, 1);
    handlePortfolioItemChange(lindex, updatedPortfolioData[lindex]);
  };

  return (
    <View
      style={[
        tw`border-2 border-[${colors.parpal}] p-1 rounded-lg py-4`,
        {marginTop: 30},
      ]}>
      <View style={tw`absolute top-[-5] ml-2 bg-[${colors.greyLight}]`}>
        <TextWrapper
          children={`Portfolio ${lindex}`}
          isRequired={false}
          fontType={'semiBold'}
          style={[
            tw`px-2 `,
            {fontSize: 16, marginTop: 0, color: colors.black, padding: 3},
          ]}
        />
      </View>
      <ScrollView horizontal style={{width: '100%'}}>
        <>
          <View
            style={{
              zIndex: 1,
              height: dropdownOpen ? 250 : 60,
            }}>
            <View>
              <DropDownPicker
                open={dropdownOpen}
                value={service_}
                items={serviceList}
                // items={tempdata}
                setOpen={setdropdownOpen}
                // setValue={item => {
                //   console.log('set-here', item);
                //   // setservice_(value);
                // }}
                setValue={setservice_}
                setItems={setserviceList}
                showArrowIcon={false}
                zIndex={10}
                maxHeight={200}
                dropDownContainerStyle={{
                  borderWidth: 0,
                }}
                labelStyle={{
                  fontFamily: commonStyle.fontFamily.regular,
                  fontSize: 14,
                  color: colors.white,
                }}
                arrowIconStyle={
                  {
                    // backgroundColor: 'red'
                  }
                }
                placeholder="Select the service the portfolio is for?"
                placeholderStyle={{
                  fontFamily: commonStyle.fontFamily.regular,
                  fontSize: 14,
                  color: '#9E9E9E',
                }}
                style={{
                  backgroundColor: colors.lightBlack,
                  borderColor: colors.primary,
                  borderWidth: 2,
                  width: WIDTH_WINDOW * 0.85,
                }}
                listMode="FLATLIST"
                showTickIcon={false}
                textStyle={{
                  color: colors.white,
                }}
                listParentLabelStyle={{
                  color: '#000',
                  fontSize: 16,
                  fontFamily: commonStyle.fontFamily.regular,
                }}
                listItemContainerStyle={{
                  backgroundColor: '#F1F1F1',
                  borderColor: 'red',
                  opacity: 1,
                  borderWidth: 0,
                }}
              />
            </View>
          </View>
        </>
      </ScrollView>
      {pictures?.length < 1 ? (
        <View style={tw`flex flex-row`}>
          <TouchableOpacity
            onPress={() => {
              openLibraryfordp();
            }}
            style={[
              tw`border rounded-lg w-full mt-6 items-center justify-center mx-auto `,
              {height: HEIGHT_SCREEN * 0.2},
            ]}>
            <TextWrapper
              children="Add work Pictures"
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
        <View style={tw``}>
          <FlatList
            style={{flex: 1}}
            data={pictures}
            scrollEnabled={false}
            horizontal={true}
            renderItem={(item: any, index: any) => {
              console.log(item);
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
      <TextWrapper
        children="Short Description"
        isRequired={false}
        fontType={'semiBold'}
        style={{fontSize: 16, marginTop: 15, color: colors.black}}
      />
      <TextInput
        style={{
          paddingHorizontal: 10,
          marginTop: 10,
          height: 70,
          backgroundColor: colors.greyLight1,
          borderRadius: 5,
          color: '#000',
        }}
        placeholderTextColor={colors.grey}
        placeholder={'Briefly talk about the portfolio .....Max: 20 words'}
        value={shortDescription}
        onChangeText={text => {
          setShortDescription(text);
          UpdateValue('description', text);
          // const temp_data = {
          //   service: service,
          //   description: text || shortDescription,
          //   images: imaageURIs,
          // };
          // updatePortfolioItem(service, index, temp_data);
          // updateData(service, compIndex, temp_data);
        }}
      />
    </View>
  );
}
