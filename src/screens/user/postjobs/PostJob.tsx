/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RNPickerSelect from 'react-native-picker-select';
import commonStyle from '../../../constants/commonStyle';
import colors from '../../../constants/colors';
import CustomButton from '../../../components/Button';
import {Dropdown} from 'react-native-element-dropdown';
import {perHeight, perWidth, SIZES} from '../../../utils/position/sizes';
import tw from 'twrnc';
import {getAllServices, uploadAssetsDOCorIMG} from '../../../utils/api/func';
import {useDispatch, useSelector} from 'react-redux';
import {setallJobPosts, setallServices} from '../../../store/reducer/mainSlice';
import {launchImageLibrary} from 'react-native-image-picker';
import {formatToCustomString, ToastShort} from '../../../utils/utils';
import Snackbar from 'react-native-snackbar';
import FastImage from 'react-native-fast-image';
import DropDownPicker from 'react-native-dropdown-picker';
import images from '../../../constants/images';
import Textcomp from '../../../components/Textcomp';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {DateTime} from 'luxon';
import {createJobs} from '../../../utils/api/jobs';
import CheckBox from 'react-native-check-box';
import Modal from 'react-native-modal';

const PostJob = ({submitJobDetails}: any) => {
  const navigation = useNavigation();
  const [schdeuleIsoDate, setschdeuleIsoDate] = useState('');
  const [ready, setready] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [jobDetails, setJobDetails] = useState({
    jobDescription: '',
    service: '',
    expectedDeliveryDate: '',
    address: '',
    priceRange: {min: '', max: ''},
    image: null,
  });

  const handleInputChange = (field: string, value: string) => {
    setJobDetails({...jobDetails, [field]: value});
  };

  const handlePriceChange = (type: string, value: string) => {
    setJobDetails({
      ...jobDetails,
      priceRange: {...jobDetails.priceRange, [type]: value},
    });
  };

  const handleImageUpload_ = (image: any) => {
    setJobDetails({...jobDetails, image});
  };

  const uploadImgorDoc = async (param: {
    uri: string;
    name: string | null;
    copyError: string | undefined;
    fileCopyUri: string | null;
    type: string | null;
    size: number | null;
  }) => {
    setphotoLoading(true);

    const res: any = await uploadAssetsDOCorIMG(param);

    setphotoLoading(false);

    if (res?.status === 201 || res?.status === 200) {
      console.log('image:', res);
      // await initUpdate({profilePic: res?.data.url});
      setJobDetails({...jobDetails, image: res?.data.url});
      return res?.data.url;
    } else {
      Snackbar.show({
        text:
          res?.error?.message ??
          res?.error?.data?.message ??
          'Oops!, an error occurred',
        duration: Snackbar.LENGTH_LONG,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
    }
  };

  const [PhotoUri, setPhotoUri] = useState(null);
  const [photoLoading, setphotoLoading] = useState(false);

  const handleImageUpload = () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 1,
    };
    try {
      launchImageLibrary(options, async (resp: unknown) => {
        if (resp?.assets?.length > 0) {
          const fileSize = resp.assets[0].fileSize; // File size in bytes
          const fileSizeInMB = fileSize / (1024 * 1024); // Convert to megabytes
          if (fileSizeInMB > 5) {
            ToastShort(
              'Image size exceeds 5MB. Please choose a smaller image.',
            );
            return;
          }
          console.log('resp', resp?.assets[0]);
          setPhotoUri(resp?.assets[0].uri);
          const data = await uploadImgorDoc(resp?.assets[0]);
          console.warn('processed pic', data);
          setJobDetails({...jobDetails, image: data});
        }
        setphotoLoading(false);
      });
    } catch (error) {
    } finally {
    }
  };

  const HandleCreate = async () => {
    const _d: any = {
      address: jobDetails.address,
      description: jobDetails.jobDescription,
      service: jobDetails.service,
      deliveryDate: schdeuleIsoDate,
      minPrice: jobDetails.priceRange.max,
      maxPrice: jobDetails.priceRange.min,
    };

    if (jobDetails.image) {
      _d.imageURL = jobDetails.image;
    }

    try {
      const res = await createJobs(_d);
      console.log('createJobs:', res?.data);
      if ([200, 201].includes(res?.status)) {
        ToastShort('Job Post Created successfully 🚀.');
        navigation.navigate('MyJobs');
      } else {
        ToastShort(
          res?.error?.message
            ? res?.error?.message
            : 'Oops! An error occurred! 🚀.',
        );
      }
    } catch (error) {
      console.error('Error with Create Jobs:', error);
      ToastShort('An unexpected error occurred!.');
    } finally {
      setisLoading(false);
      setready(false);
    }
  };

  const handleSubmit = () => {
    // submitJobDetails(jobDetails);
    // navigation.navigate('MyJobs');
    setready(true);

    // console.log(jobDetails);
  };

  const [locationItems, setLocationItems] = useState([
    {label: 'Online (your business renders services online)', value: 'Online'},
    {
      label:
        'Offline (your business renders services at the customer’s location)',
      value: 'Offline',
    },
    {label: 'Hybrid', value: 'Hybrid'},
  ]);

  const dispatch = useDispatch();
  const [isLoading, setisLoading] = useState(false);
  const allservices = useSelector((state: any) => state.user.allservices);
  const [_service, set_service] = useState([]);

  useEffect(() => {
    const initGetOrders = async () => {
      setisLoading(true);
      let d: any = [];
      const res: any = await getAllServices('');
      if (res?.status === 201 || res?.status === 200) {
        dispatch(setallServices(res?.data?.data));

        res?.data?.data?.map((item: any) => {
          d.push({label: item?.name, value: item._id ?? item.id});
        });
      }

      set_service(d);
      setisLoading(false);
    };
    initGetOrders();
  }, []);

  const [locationOpen, setLocationOpen] = useState(false);
  const [locationValue, setLocationValue] = useState(null);
  const [displayDate, setdisplayDate] = useState('');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (date: any) => {
    const f = `${date}`;
    const jsDate = new Date(f);
    const luxonDateTime = DateTime.fromJSDate(jsDate);
    const isoString = luxonDateTime.toISO();
    console.log(isoString);
    setschdeuleIsoDate(isoString);
    setdisplayDate(f);
    hideDatePicker();
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={30}
            color={colors.black}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.titleTwo}>Post a Job</Text>
        </View>

        <View style={styles.formItem}>
          <Text style={styles.formTitle}>Job Description</Text>
          {/* <TextInput
            style={[
              styles.formTextInput,
              styles.textArea,
              {paddingVertical: 20},
            ]}
            numberOfLines={5}
            multiline
            value={jobDetails.jobDescription}
            onChangeText={value => handleInputChange('jobDescription', value)}
            placeholder="Enter brief description about the service to be rendered"
            textAlignVertical="top"
          /> */}

          <TextInput
            multiline
            placeholder="Enter brief description about the service to be rendered"
            style={[
              tw` px-4 py-4 rounded-lg text-black`,
              {
                height: perHeight(100),
                backgroundColor: colors.greyLight1,
                color: 'black',
              },
            ]}
            onChangeText={text => {
              handleInputChange('jobDescription', text);
            }}
            placeholderTextColor={'black'}
          />
        </View>

        <View style={styles.formItem}>
          <Text style={styles.formTitle}>Service</Text>

          <Dropdown
            style={[
              tw`text-black`,
              {
                zIndex: 10,
                width: SIZES.width * 0.875,
                backgroundColor: '#F7F5F5',
                borderColor: 'black',
                borderWidth: 1,
                height: 50,
                borderRadius: 10,
                paddingHorizontal: 10,
                marginTop: 15,
                color: '#000000',
              },
            ]}
            placeholderStyle={{
              color: '#757575',
              fontWeight: '300',
            }}
            inputSearchStyle={{
              color: '#757575',
            }}
            selectedTextStyle={{
              color: '#000',
            }}
            data={_service}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={'Select Service'}
            searchPlaceholder="Search..."
            itemTextStyle={{
              color: 'black',
            }}
            value={jobDetails.service}
            onChange={item => {
              // const d = `${item.value}`;
              handleInputChange('service', item.value);
            }}
          />
          {/* <RNPickerSelect
            onValueChange={value => handleInputChange('service', value)}
            items={[
              {label: 'Plumbing', value: 'Plumbing'},
              {
                label: 'Tile Installation and Repair',
                value: 'Tile Installation and Repair',
              },
              {label: 'Furniture', value: 'Furniture'},
              {label: 'Painting', value: 'Painting'},
              {label: 'Baking', value: 'Baking'},
              {label: 'Home Tutoring', value: 'Home Tutoring'},
              {label: 'Maintenance service', value: 'Maintenance service'},
            ]}
            style={{
              inputAndroid: {
                color: colors.darkGrey,
                backgroundColor: colors.greyBG,
                padding: 10,
                borderRadius: 5,
                fontSize: 16,
                fontFamily: commonStyle.fontFamily.regular,
              },
              inputIOS: {
                color: colors.darkGrey,
                backgroundColor: colors.greyBG,
                padding: 10,
                borderRadius: 5,
                fontSize: 16,
                fontFamily: commonStyle.fontFamily.regular,
              },
              placeholder: {
                color: colors.grey,
              },
            }}
            placeholder={{
              label: 'Select service',
              value: null,
              color: colors.greyLight,
            }}
            search
          /> */}
        </View>

        {/* <View style={styles.formItem}>
   
          <TextInput
            style={styles.formTextInput}
            value={jobDetails.expectedDeliveryDate}
            onChangeText={value =>
              handleInputChange('expectedDeliveryDate', value)
            }
            placeholder="Enter your expected date"
          />
        </View> */}

        <View
          style={[tw` border-[#00000033] pb-4 `, {marginTop: perHeight(5)}]}>
          <Text style={styles.formTitle}>Expected Delivery Date</Text>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            minimumDate={new Date()}
          />

          <TouchableOpacity
            onPress={() => {
              setDatePickerVisibility(!isDatePickerVisible);
            }}
            style={[
              tw`w-full px-4 justify-center rounded-lg mt-3`,
              {
                height: perHeight(40),
                borderRadius: 5,
                padding: 10,
                fontSize: 16,
                fontFamily: commonStyle.fontFamily.regular,
                backgroundColor: colors.greyBG,
                color: colors.darkGrey,
              },
            ]}>
            <Textcomp
              text={`${
                displayDate ? formatToCustomString(displayDate) : 'Pick date'
              }`}
              size={17}
              lineHeight={17}
              color={'#000413'}
              fontFamily={'Inter-Regular'}
            />
          </TouchableOpacity>
        </View>

        <View
          style={[styles.formItem, {marginBottom: locationOpen ? 200 : 30}]}>
          <Text style={styles.formTitle}>Address</Text>
          <DropDownPicker
            open={locationOpen}
            value={locationValue}
            items={locationItems}
            setOpen={setLocationOpen}
            setValue={setLocationValue}
            setItems={setLocationItems}
            showArrowIcon={true}
            ArrowDownIconComponent={({style}) => (
              <Image
                resizeMode="contain"
                style={{width: 15, height: 15, tintColor: '#010B2D'}}
                source={!locationOpen && images.polygonForward}
              />
            )}
            ArrowUpIconComponent={({style}) => (
              <Image
                resizeMode="contain"
                style={{width: 15, height: 15, tintColor: '#010B2D'}}
                source={locationOpen && images.polygonDown}
              />
            )}
            zIndex={10}
            dropDownContainerStyle={{
              borderWidth: 0,
            }}
            labelStyle={{
              fontFamily: commonStyle.fontFamily.regular,
              fontSize: 14,
              color: '#000',
            }}
            placeholderStyle={{
              fontFamily: commonStyle.fontFamily.regular,
              fontSize: 14,
              color: '#9E9E9E',
            }}
            style={{
              backgroundColor: '#D9D9D9',
              borderColor: '#9E9E9E14',
            }}
            listMode="FLATLIST"
            showTickIcon={false}
            textStyle={{
              color: '#9E9E9E',
            }}
            listParentLabelStyle={{
              color: '#000',
              fontSize: 16,
              fontFamily: commonStyle.fontFamily.regular,
            }}
            listItemContainerStyle={{
              backgroundColor: 'D9D9D9',
              borderColor: 'red',
              opacity: 1,
              marginTop: 5,
              borderWidth: 0,
            }}
          />

          {locationValue && locationValue !== 'Online' && (
            <View style={tw`mt-4`}>
              <TextInput
                style={styles.formTextInput}
                value={jobDetails.address}
                onChangeText={value => handleInputChange('address', value)}
                placeholder="Specify your delivery address"
              />
            </View>
          )}
        </View>

        <View style={styles.formItem}>
          <Text style={[styles.formTitle, {marginBottom: 15}]}>
            Price Range{' '}
            <Text style={{fontWeight: '400', fontSize: 13}}>
              {' '}
              (What is your budget for the job? )
            </Text>
          </Text>
          <View style={styles.priceRangeContainer}>
            <TextInput
              style={[styles.formTextInput, styles.priceInput]}
              value={jobDetails.priceRange.min}
              onChangeText={value => handlePriceChange('min', value)}
              placeholder="₦"
              keyboardType="numeric"
            />
            <Text style={styles.toText}>to</Text>
            <TextInput
              style={[styles.formTextInput, styles.priceInput]}
              value={jobDetails.priceRange.max}
              onChangeText={value => handlePriceChange('max', value)}
              placeholder="₦"
              keyboardType="numeric"
            />
          </View>

          {Number(jobDetails.priceRange.min) > Number(jobDetails.priceRange.max) && (
            <Text style={tw`mt-4 text-[#FF0000]`}>
              * Max price must be more than min Price.
            </Text>
          )}
        </View>

        <View style={styles.formItem}>
          <Text style={styles.formTitle}>Upload an Image (Optional)</Text>
          {jobDetails?.image ? (
            <TouchableOpacity
              onPress={() => {
                handleImageUpload(null);
              }}
              style={tw`mx-auto mb-10 mt-4`}>
              <FastImage
                style={[
                  tw``,
                  {
                    width: perWidth(330),
                    height: perWidth(200),
                    borderRadius: perWidth(20) / 2,
                  },
                ]}
                source={{
                  uri: jobDetails.image,
                  headers: {Authorization: 'someAuthToken'},
                  priority: FastImage.priority.high,
                  // cache: FastImage.cacheControl.cacheOnly
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleImageUpload(null)}>
              <AntDesign name="upload" size={30} color={colors.grey} />
              <Text style={styles.uploadText}>Upload or drop</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            text={'Cancel'}
            onClick={handleSubmit}
            borderColor={colors.primary}
            textStyle={{
              color: colors.primary,
              fontSize: 18,
              fontFamily: commonStyle.fontFamily.semibold,
            }}
            style={styles.cancelButton}
          />

          <CustomButton
            text={'Submit'}
            onClick={handleSubmit}
            borderColor={colors.darkParpal}
            textStyle={{
              color: colors.darkParpal,
              fontSize: 18,
              fontFamily: commonStyle.fontFamily.semibold,
            }}
            style={styles.submitButton}
          />
        </View>
        <View style={{height: 200}} />
      </ScrollView>

      <Modal
        isVisible={ready}
        onModalHide={() => {
          setready(false);
        }}
        style={{width: SIZES.width, marginHorizontal: 0}}
        deviceWidth={SIZES.width}
        onBackdropPress={() => setready(false)}
        swipeThreshold={200}
        swipeDirection={['down']}
        onSwipeComplete={() => setready(false)}
        onBackButtonPress={() => setready(false)}>
        <View style={tw` h-full w-full bg-black bg-opacity-5`}>
          <TouchableOpacity
            onPress={() => setready(false)}
            style={tw`flex-1`}
          />
          <View
            style={[
              tw`p-4 mt-auto bg-[#D9D9D9] `,
              {minHeight: '65.5%', marginBottom: -20},
            ]}>
            <TouchableOpacity
              onPress={() => {
                setready(false);
              }}
              style={tw`w-15 h-1 mx-auto rounded-full  bg-[${colors.darkPurple}]`}
            />
            <View style={tw`flex-1`}>
              <View style={tw`pt-3`}>
                <Textcomp
                  text={'!!! NEXT STEPS !!!'}
                  size={16}
                  lineHeight={18.5}
                  color={'black'}
                  fontFamily={'Inter-Bold'}
                />
              </View>

              <View style={tw`mt-4`} />
              <View style={tw`flex flex-row items-start mt-2`}>
                <View style={tw`w-1.5 h-1.5 mt-1 rounded-full mr-2 bg-black`} />
                <Textcomp
                  text={
                    'Multiple Service Providers will message you soon. Carefully check their profiles and reviews to make an informed decision.'
                  }
                  size={13}
                  lineHeight={18}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                  style={{width: '90%'}}
                />
              </View>
              <View style={tw`flex flex-row items-start mt-2`}>
                <View style={tw`w-1.5 h-1.5 mt-1 rounded-full mr-2 bg-black`} />
                <Textcomp
                  text={
                    "Always pay through the platform. We've implemented strong security measures to protect your transactions."
                  }
                  size={13}
                  lineHeight={18}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                  style={{width: '90%'}}
                />
              </View>
              <View style={tw`flex flex-row items-start mt-2`}>
                <View
                  style={tw`w-1.5 h-1.5  mt-1 rounded-full mr-2 bg-black`}
                />
                <Textcomp
                  text={
                    '⁠Service Providers are only paid after you confirm that the job is done to your satisfaction.'
                  }
                  size={13}
                  lineHeight={18}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                  style={{width: '90%'}}
                />
              </View>
              <View style={tw`flex flex-row items-start mt-2 `}>
                <View style={tw`w-1.5 h-1.5 mt-1 rounded-full mr-2 bg-black`} />
                <Textcomp
                  text={
                    "Once you've chosen your preferred Service Provider, click the 'Tap to Hire' button to proceed."
                  }
                  size={13}
                  lineHeight={18}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                  style={{width: '90%'}}
                />
              </View>
              <View style={tw`flex flex-row items-start mt-2 mb-4`}>
                <View style={tw`w-1.5 h-1.5 mt-1 rounded-full mr-2 bg-black`} />
                <Textcomp
                  text={
                    "Don't forget to delete the job posting from the Orders page to avoid further responses."
                  }
                  size={13}
                  lineHeight={18}
                  color={'#000000'}
                  fontFamily={'Inter-Regular'}
                  style={{width: '90%'}}
                />
              </View>

              <View style={tw`mt-auto`}>
                <View style={tw`flex flex-row items-center mb-4 ml-4`}>
                  <CheckBox
                    style={{width: 30, padding: 10}}
                    onClick={() => {
                      setToggleCheckBox(!toggleCheckBox);
                    }}
                    isChecked={toggleCheckBox}
                    // leftText={'CheckBox'}
                  />
                  <View style={tw`ml-4`}>
                    <Textcomp
                      text={'I agree to the above terms.'}
                      size={13}
                      lineHeight={18}
                      color={'#000000'}
                      fontFamily={'Inter-Regular'}
                    />
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={tw`bg-[${colors.darkPurple}] border-[${colors.primary}] border w-[85%] py-4 mb-4 items-center  mx-auto rounded-lg`}
                onPress={() => {
                  if (toggleCheckBox) {
                    HandleCreate();
                  } else {
                    ToastShort('Click the radio button to proceed');
                  }
                }}>
                <Textcomp
                  text={'Continue'}
                  size={14}
                  lineHeight={18}
                  color={'white'}
                  fontFamily={'Inter-SemiBold'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EBEBEB',
    padding: 20,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  titleTwo: {
    fontSize: 20,
    fontFamily: commonStyle.fontFamily.bold,
    color: '#000',
    width: '95%',
    textAlign: 'center',
  },
  formItem: {
    marginBottom: 15,
  },
  formTitle: {
    fontSize: 16,
    fontFamily: commonStyle.fontFamily.semibold,
    marginBottom: 5,
    color: '#333',
  },
  formTextInput: {
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    fontFamily: commonStyle.fontFamily.regular,
    backgroundColor: colors.greyBG,
    color: colors.darkGrey,
  },
  textArea: {
    height: 120,
  },
  priceRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    fontFamily: commonStyle.fontFamily.semibold,
  },
  toText: {
    marginHorizontal: 5,
    fontSize: 16,
    color: '#000',
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: '#8D8D8D',
    borderRadius: 5,
    padding: 20,
    marginVertical: 40,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
  },
  uploadText: {
    fontSize: 16,
    color: '#999999',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cancelButton: {
    width: '48%',
    backgroundColor: colors.darkParpal,
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
  },

  submitButton: {
    width: '48%',
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
  },
});

export default PostJob;
