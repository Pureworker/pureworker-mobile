import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Modal as RNMOdal,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../../constants/colors';
import commonStyle from '../../../constants/commonStyle';
import CustomButton from '../../../components/Button';
import {useRoute} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import images from '../../../constants/images';
import {useDispatch, useSelector} from 'react-redux';
import {deleteJob, getSingleJob} from '../../../utils/api/jobs';
import {setallJobPosts, setviewJobPost} from '../../../store/reducer/mainSlice';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomLoading from '../../../components/customLoading';
import {formatDate3, ToastLong, ToastShort} from '../../../utils/utils';
import FastImage from 'react-native-fast-image';
import {perWidth, SIZES} from '../../../utils/position/sizes';
import tw from 'twrnc';
import Snackbar from 'react-native-snackbar';
import socket from '../../../utils/socket';
import Textcomp from '../../../components/Textcomp';
import CheckBox from 'react-native-check-box';
import Modal from 'react-native-modal';

const ProductDisplay = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {job}: any = route.params;

  // console.log(job);

  const dispatch = useDispatch();

  const [isLoading, setisLoading] = useState(false);
  const viewJobPost = useSelector((state: any) => state.user.viewJobPost);
  const initGetJoobs = async () => {
    setisLoading(true);
    const res: any = await getSingleJob(job?._id);
    console.log('product', res?.data);
    if (res?.status === 201 || res?.status === 200) {
      dispatch(setviewJobPost(res?.data?.data));
    }
    setisLoading(false);
  };
  useEffect(() => {
    initGetJoobs();
  }, []);

  console.log(viewJobPost);

  const [isModalVisible, setModalVisible] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const _deleteJobs = async (param: any) => {
    console.log(param);
    try {
      const res: any = await deleteJob(param);
      console.log('delete result:', res?.data);
      if (res?.status === 200 || res?.status === 201 || res?.status === 204) {
        ToastLong('Job deleted successfully');
      } else {
        Snackbar.show({
          text: res?.error?.message
            ? res?.error?.message
            : res?.error?.data?.message
            ? res?.error?.data?.message
            : 'Oops!, an error occured',
          duration: Snackbar.LENGTH_LONG,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
      }
    } catch (error) {
      Snackbar.show({
        text: res?.error?.message
          ? res?.error?.message
          : res?.error?.data?.message
          ? res?.error?.data?.message
          : 'Oops!, an error occured',
        duration: Snackbar.LENGTH_LONG,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
    } finally {
      initGetJoobs();
      setModalVisible(false); // Hide the modal
      setJobToDelete(null); // Reset the job to delete
      setisLoading(false);
    }
  };

  const handleDeleteJob = jobId => {
    setJobToDelete(jobId); // Set the job to be deleted
    setModalVisible(true); // Show the modal
  };

  const confirmDeleteJob = () => {
    // setJobs(jobs.filter(job => job.id !== jobToDelete));
    _deleteJobs(jobToDelete);
  };

  const userType = useSelector((state: any) => state.user.isLoggedIn);
  const [ready, setready] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={30}
            color={colors.black}
            onPress={() => {
              dispatch(setviewJobPost(null));
              navigation.goBack();
            }}
          />
          <Text style={styles.titleTwo}>Jobs Posted</Text>
          <Text style={styles.titleThree}>
            Delete the job post once you hire a service provider
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="arrow-left"
          size={30}
          color={colors.black}
          onPress={() => {
            dispatch(setviewJobPost(null));
            navigation.goBack();
          }}
        />
        <Text style={styles.titleTwo}>Jobs Posted</Text>
        <Text style={styles.titleThree}>
          Delete the job post once you hire a service provider
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {viewJobPost?.imageURL && (
          <View style={styles.imageContainer}>
            {/* <Image source={images.product} style={styles.image} /> */}

            <FastImage
              style={[
                tw``,
                {
                  width: SIZES.width,
                  height: perWidth(300),
                },
              ]}
              source={{
                uri:
                  viewJobPost?.imageURL ||
                  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
                headers: {Authorization: 'someAuthToken'},
                priority: FastImage.priority.high,
                // cache: FastImage.cacheControl.cacheOnly,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
        )}
        <View style={styles.contentContainer}>
          <Text style={styles.productDescription}>
            {viewJobPost?.description}
          </Text>
          <View style={styles.row}>
            <Text style={styles.storeAddress}>Address</Text>
            <Text style={styles.text}>{viewJobPost.address}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.storeAddress}>Service</Text>
            <Text style={styles.text}>{viewJobPost?.service?.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.storeAddress}>Delivery Date</Text>
            <Text style={styles.text}>
              {formatDate3(viewJobPost?.deliveryDate)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.storeAddress}>Price</Text>
            <Text style={styles.text}>
              ₦{viewJobPost?.minPrice}-{viewJobPost?.maxPrice}
            </Text>
          </View>
        </View>

        {userType.userType === 'CUSTOMER' ? (
          <View style={styles.buttonContainer}>
            <CustomButton
              text={'Edit'}
              onClick={() => {}}
              borderColor={colors.black}
              textStyle={{
                color: colors.primary,
                fontSize: 17,
                fontFamily: commonStyle.fontFamily.semibold,
              }}
              style={styles.buttonOne}
            />

            <CustomButton
              text={'Delete'}
              onClick={() => {
                handleDeleteJob(viewJobPost._id ?? viewJobPost?.id);
              }}
              borderColor={colors.primary}
              textStyle={{
                color: colors.black,
                fontSize: 17,
                fontFamily: commonStyle.fontFamily.semibold,
              }}
              style={styles.button}
            />
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <CustomButton
              text={'Cancel'}
              onClick={() => {
                navigation.goBack();
              }}
              borderColor={colors.black}
              textStyle={{
                color: colors.primary,
                fontSize: 17,
                fontFamily: commonStyle.fontFamily.semibold,
              }}
              style={styles.buttonOne}
            />

            <CustomButton
              text={'Negotiate'}
              onClick={() => {
                setready(true);
              }}
              borderColor={colors.primary}
              textStyle={{
                color: colors.black,
                fontSize: 17,
                fontFamily: commonStyle.fontFamily.semibold,
              }}
              style={styles.button}
            />
          </View>
        )}
      </ScrollView>

      {/* Confirmation Modal */}
      <RNMOdal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this job?
            </Text>
            <View style={styles.modalButtons}>
              <CustomButton
                text="Yes"
                onClick={confirmDeleteJob}
                textStyle={{
                  color: colors.primary,
                  fontSize: 18,
                  fontFamily: commonStyle.fontFamily.semibold,
                }}
                style={[styles.modalButton, styles.cancelButton]}
              />
              <CustomButton
                text="No"
                onClick={() => setModalVisible(false)}
                textStyle={{
                  color: colors.darkParpal,
                  fontSize: 18,
                  fontFamily: commonStyle.fontFamily.semibold,
                }}
                style={[styles.modalButton, styles.deleteButton]}
              />
            </View>
          </View>
        </View>
      </RNMOdal>

      {ready && (
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
                tw`p-4 mt-auto bg-[#D9D9D9]`,
                {minHeight: '62.5%', marginBottom: -20},
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
                    text={'IMPORTANT'}
                    size={16}
                    lineHeight={18.5}
                    color={'black'}
                    fontFamily={'Inter-Bold'}
                  />
                </View>
                <View style={tw`mt-8`}>
                  <Textcomp
                    text={'Take note of the following:'}
                    size={14}
                    lineHeight={14.5}
                    color={'black'}
                    fontFamily={'Inter-SemiBold'}
                  />
                </View>
                <View style={tw`mt-4`} />

                <View style={tw`flex flex-row items-start mt-2`}>
                  <View style={tw`w-2 h-2 mt-1 rounded-full mr-2 bg-black`} />
                  <Textcomp
                    text={
                      'Make sure you are available on the date the customer requires.'
                    }
                    size={12}
                    lineHeight={14.5}
                    color={'#000000'}
                    fontFamily={'Inter-Regular'}
                  />
                </View>
                <View style={tw`flex flex-row items-start mt-2`}>
                  <View style={tw`w-2 h-2 mt-1 rounded-full mr-2 bg-black`} />
                  <Textcomp
                    text={
                      'Ensure you have the necessary skills and equipment to complete the job effectively.'
                    }
                    size={12}
                    lineHeight={14.5}
                    color={'#000000'}
                    fontFamily={'Inter-Regular'}
                  />
                </View>
                <View style={tw`flex flex-row items-start mt-2`}>
                  <View style={tw`w-2 h-2  mt-1 rounded-full mr-2 bg-black`} />
                  <Textcomp
                    text={
                      'Check if the proposed budget aligns with your rates and expectations.'
                    }
                    size={12}
                    lineHeight={14.5}
                    color={'#000000'}
                    fontFamily={'Inter-Regular'}
                  />
                </View>
                <View style={tw`flex flex-row items-start mt-2 mb-4`}>
                  <View style={tw`w-2 h-2 mt-1 rounded-full mr-2 bg-black`} />
                  <Textcomp
                    text={
                      'Reach out to the customer if you have any questions or need more details before accepting the job.'
                    }
                    size={12}
                    lineHeight={14.5}
                    color={'#000000'}
                    fontFamily={'Inter-Regular'}
                  />
                </View>
                <View style={tw`flex flex-row items-start mt-2 mb-4`}>
                  <View style={tw`w-2 h-2 mt-1 rounded-full mr-2 bg-black`} />
                  <Textcomp
                    text={
                      'Be aware of any potential extra costs that could arise and make sure they are discussed with the customer.'
                    }
                    size={12}
                    lineHeight={14.5}
                    color={'#000000'}
                    fontFamily={'Inter-Regular'}
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
                        size={12}
                        lineHeight={14.5}
                        color={'#000000'}
                        fontFamily={'Inter-Regular'}
                      />
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  // disabled={!toggleCheckBox}
                  style={tw`bg-[${colors.parpal}] w-[85%] py-4  items-center  mx-auto rounded`}
                  onPress={() => {
                    if (toggleCheckBox) {
                      socket.connect();
                      navigation.navigate('Inbox', {
                        id: viewJobPost?.user?._id || viewJobPost?.user?.id,
                        name: viewJobPost?.user?.fullName
                          ? viewJobPost?.user?.fullName
                          : `${viewJobPost?.user?.firstName} ${viewJobPost?.user?.lastName}`,
                      });
                      setready(false);
                    } else {
                      ToastShort('Click the radio button to proceed');
                    }
                  }}>
                  <Textcomp
                    text={'Continue'}
                    size={14}
                    lineHeight={14.5}
                    color={'white'}
                    fontFamily={'Inter-SemiBold'}
                  />
                </TouchableOpacity>
                <View style={tw`h-12`} />
              </View>
            </View>
          </View>
        </Modal>
      )}

      <Spinner visible={isLoading} customIndicator={<CustomLoading />} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEBEB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  titleTwo: {
    fontSize: 17.5,
    lineHeight: 22,
    fontFamily: commonStyle.fontFamily.bold,
    color: colors.black,
    width: '95%',
    textAlign: 'center',
  },
  titleThree: {
    fontSize: 16,
    fontFamily: commonStyle.fontFamily.regular,
    color: colors.black,
    width: '95%',
    textAlign: 'center',
  },
  imageContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 20,
    // flexGrow: 1,
  },
  productDescription: {
    fontSize: 16,
    fontFamily: commonStyle.fontFamily.regular,
    color: colors.black,
    marginBottom: 20,
    textAlign: 'justify',
  },
  row: {
    marginTop: 12,
    flexDirection: 'row',
    marginBottom: 10,
  },
  storeAddress: {
    fontFamily: commonStyle.fontFamily.semibold,
    color: colors.black,
    fontSize: 14,
    marginRight: 20,
  },
  text: {
    fontFamily: commonStyle.fontFamily.medium,
    color: colors.black,
    fontSize: 14,
    width: '70%',
  },
  buttonContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    // position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  button: {
    width: '45%',
    height: 45,
    backgroundColor: colors.primary,
  },
  buttonOne: {
    width: '45%',
    height: 45,
    backgroundColor: colors.darkPurple,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '80%',
    height: 'auto',
    padding: 30,
  },
  modalText: {
    fontSize: 18,
    fontFamily: commonStyle.fontFamily.semibold,
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    width: '40%',
    height: 40,
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: colors.darkPurple,
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: colors.darkParpal,
    backgroundColor: colors.white,
  },
});

export default ProductDisplay;
