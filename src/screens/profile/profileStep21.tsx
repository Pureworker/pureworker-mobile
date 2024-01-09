import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigation} from '../../constants/navigation';
import Header from '../../components/Header';
import images from '../../constants/images';
import Button from '../../components/Button';
import TextWrapper from '../../components/TextWrapper';
import commonStyle from '../../constants/commonStyle';
import tw from 'twrnc';
import {
  useCreateServiceMutation,
  useGetUserDetailQuery,
} from '../../store/slice/api';
import colors from '../../constants/colors';
import {useDispatch, useSelector} from 'react-redux';
import ProfileStepWrapper from '../../components/ProfileStepWrapper';
import PotfolioWrapper from '../../components/PotfolioWrapper';
import Snackbar from 'react-native-snackbar';
import {perWidth} from '../../utils/position/sizes';
import {completeProfile, getProfile} from '../../utils/api/func';
import {launchImageLibrary} from 'react-native-image-picker';
import {addProfileData, addformStage} from '../../store/reducer/mainSlice';
import PortComp from './comp/portComp';
import {ToastShort} from '../../utils/utils';
type Route = {
  key: string;
  name: string;
  params: {
    serviceId: string;
  };
};

const ProfileStep21 = () => {
  const navigation = useNavigation<StackNavigation>();
  const [idNumber, setIdNumber] = useState('');
  const [idName, setidName] = useState('');
  const route: Route = useRoute();

  const category = useSelector((state: any) => state.user.pickedServices);
  const [collapseState, setCollapseState] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState('');
  const [nationalityItems, setNationalityItems] = useState([
    'Int. Passport',
    'Drivers License',
    'vNIN',
    'Voters Card',
    'Bank Verification Number',
    'Others',
  ]);
  const [allPotfolio, setAllPotfolio] = useState<any>([]);
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [imageObject, setImageObject] = useState({});
  const [potfolioImageUrl, setPotfolioImageUrl] = useState<any>([]);
  const [isLoading, setisLoading] = useState(false);
  const [createService] = useCreateServiceMutation();
  const dispatch = useDispatch();
  const handleProfileSetup = async () => {
    if (portfolioToServiceCount?.length > 0) {
      const payload_data = portfolioToServiceCount;
      const payload_data2 = payload_data;
      const payload_data1 = payload_data;

      if (serviceList?.length < 1 || !serviceList) {
        ToastShort('ServiceList is null');
        console.log('====================================');
        console.log(categoryId);
        console.log('====================================');
        return;
      }
      payload_data1?.map((item, index) => {
        const name = item.service;
        // const filteredObject = serviceList?.filter(
        //   (obj: any) => obj?.label === name,
        // );
        const filteredObject = serviceList.find(
          (obj: any) => obj.name === item.service,
        );
        console.log('here', filteredObject, serviceList);
        if (filteredObject?._id) {
          payload_data2[index].service = filteredObject?._id;
        } else {
          console.error('error on modification', filteredObject);
        }
      });
      console.log(payload_data2);
      //
      setisLoading(true);
      const res: any = await completeProfile({portfolio: payload_data2});
      console.log('result', res?.data);
      if (res?.status === 200 || res?.status === 201) {
        navigation.navigate('ProfileStep3');
        dispatch(addformStage(3));
      } else {
        Snackbar.show({
          text: res?.error?.message
            ? res?.error?.message
            : res?.error?.data?.message
            ? res?.error?.data?.message
            : 'Oops!, an error occured',
          duration: Snackbar.LENGTH_SHORT,
          textColor: '#fff',
          backgroundColor: '#88087B',
        });
      }
      setisLoading(false);

      //
    } else {
      Snackbar.show({
        text: 'Please fill add atleast 1 portfolio',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
    }
  };
  const {data: getUserData, isLoading: isLoadingUser} = useGetUserDetailQuery();
  const getUser = getUserData ?? [];
  const [nationalityOpen, setNationalityOpen] = useState(false);
  const [portfolioToServiceCount, setportfolioToServiceCount] = useState([
    {
      service: '',
      description: '',
      images: [],
    },
  ]);
  const completeProfileData = useSelector(
    (state: any) => state.user.completeProfileData,
  );
  const [serviceList, setserviceList] = useState([]);
  const [pictures, setpictures] = useState([]);
  const [desp1, setdesp1] = useState('');
  const options = {mediaType: 'photo', selectionLimit: 3};
  const openLibraryfordp = () => {
    launchImageLibrary(options, async (resp: unknown) => {
      if (resp?.assets?.length > 0) {
        console.log('resp', resp?.assets);
        let arr = [];
        resp?.assets?.map(item => {
          arr.push(item?.uri);
        });

        setpictures(arr);
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
  const [genderItems, setGenderItems] = useState([
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
    {label: 'Choose not to answer', value: 'Choose not to answer'},
  ]);
  const userData = useSelector((state: any) => state.user.userData);
  const categoryId = useSelector((state: any) => state.user.pickedServicesId);
  useEffect(() => {
    const initGetProfile = async () => {
      const res: any = await getProfile(userData?._id);
      console.log(
        'mmmmmmmmmmm',
        res?.data,
        'services:',
        res?.data?.profile?.services,
      );
      if (res?.status === 201 || res?.status === 200) {
        dispatch(addProfileData(res?.data?.profile));
        let arr = [];
        res?.data?.profile?.services?.map(item => {
          arr.push({...item, label: item?.name});
        });
        setserviceList(arr);
      }
    };
    initGetProfile();
  }, []);
  // Function to handle changes in a portfolio item
  const handlePortfolioItemChange = (index: any, updatedData: any) => {
    // Create a copy of the current portfolio data
    const updatedPortfolioData = [...portfolioToServiceCount];
    updatedPortfolioData[index] = updatedData; // Update the data at the specified index
    setportfolioToServiceCount(updatedPortfolioData); // Update the state with the new data
    console.log('All Data here', updatedPortfolioData);
  };
  return (
    <View style={[{flex: 1, backgroundColor: colors.greyLight}]}>
      <Header
        style={{backgroundColor: colors.greyLight}}
        imageStyle={{tintColor: colors.black}}
        textStyle={{
          color: colors.black,
          fontFamily: commonStyle.fontFamily.semibold,
        }}
        title={'Complete your Registration'}
        image={images.back}
      />
      <ProfileStepWrapper active={'four'} />
      <ScrollView>
        <View style={{marginHorizontal: 20}}>
          <TextWrapper
            children="Portfolio Upload"
            fontType={'semiBold'}
            style={{fontSize: 20, marginTop: 30, color: colors.black}}
          />
          <View style={{zIndex: nationalityOpen ? 0 : 2}}>
            <TextWrapper
              children="Portfolio (You can add a maximum of 3 per service)"
              isRequired={false}
              fontType={'semiBold'}
              style={{
                fontSize: 16,
                marginTop: 20,
                marginBottom: 3,
                color: colors.black,
              }}
            />
            <TextWrapper
              children="Click “Add a Portfolio” to showcase projects you’ve worked on"
              isRequired={false}
              fontType={'Regular'}
              style={{
                fontSize: 14,
                marginTop: 0,
                marginBottom: 13,
                color: colors.black,
              }}
            />
            {allPotfolio.map((item: any, index: number) => {
              return (
                <PotfolioWrapper
                  key={index}
                  index={index}
                  item={item}
                  allPotfolio={allPotfolio}
                  setAllPotfolio={setAllPotfolio}
                  setShortDescription={setShortDescription}
                  setPotfolioImageUrl={setPotfolioImageUrl}
                  setEditKey={setEditKey}
                />
              );
            })}

            <View>
              {portfolioToServiceCount?.map((item, index) => {
                return (
                  <PortComp
                    key={index}
                    lindex={index}
                    dlist={serviceList}
                    portfolioData={portfolioToServiceCount}
                    handlePortfolioItemChange={(i: any, data: any) =>
                      handlePortfolioItemChange(index, data)
                    }
                  />
                );
              })}
            </View>

            <TouchableOpacity
              style={[
                tw`bg-[${colors.darkPurple}] py-3 mt-4 rounded-lg ml-auto items-center justify-center`,
                {width: perWidth(175)},
              ]}
              onPress={() => {
                const newPortfolioItem = {
                  service: '',
                  description: '',
                  images: [],
                };
                // setportfolioToServiceCount([
                //   ...portfolioToServiceCount,
                //   newPortfolioItem,
                // ]);
                if (portfolioToServiceCount.length < category.length * 3) {
                  setportfolioToServiceCount([
                    ...portfolioToServiceCount,
                    newPortfolioItem,
                  ]);
                } else {
                  // Handle the case when the maximum number of portfolios is reached
                  Alert.alert('Maximum portfolios reached for all services.');
                }
              }}>
              <TextWrapper
                children={`Add ${
                  portfolioToServiceCount.length === 0 ? 'a' : 'another'
                } Portfolio`}
                isRequired={false}
                fontType={'semiBold'}
                style={{fontSize: 16, color: colors.white}}
              />
            </TouchableOpacity>

            {allPotfolio.length === 3 && (
              <View
                style={{
                  backgroundColor: colors.greyLight1,
                  height: 80,
                  borderRadius: 5,
                }}>
                <Image
                  source={images.cross}
                  resizeMode="contain"
                  style={{
                    width: 10,
                    height: 10,
                    marginLeft: 20,
                    marginTop: 10,
                    tintColor: '#000',
                  }}
                />
                <TextWrapper
                  children="Maximum number of portfolios added."
                  isRequired={false}
                  fontType={'normal'}
                  style={{
                    textAlign: 'center',
                    fontSize: 12,
                    marginTop: 13,
                    color: colors.black,
                  }}
                />
              </View>
            )}

            {!isLoading ? (
              <View style={{marginHorizontal: 25, marginTop: 75}}>
                <Button
                  onClick={() => {
                    // handleProfileSetup();
                    // navigation.navigate('ProfileStep3', {serviceId: data?.serviceId});
                    // navigation.navigate('ProfileStep3', {serviceId: 'id_here'});
                    // dispatch(addcompleteProfile({city: nationalityValue}));
                    //   console.log(completeProfileData, 'here', allPotfolio);
                    //   _handleFuncUpload();
                    handleProfileSetup();
                    // console.log('chech-here', portfolioToServiceCount);
                    console.log('modified data2', portfolioToServiceCount);
                  }}
                  style={{
                    marginBottom: 20,
                    marginTop: 20,
                    marginHorizontal: 40,
                    backgroundColor: colors.lightBlack,
                  }}
                  textStyle={{color: colors.primary}}
                  text={'Next'}
                />
              </View>
            ) : (
              <ActivityIndicator
                style={{marginTop: 95, marginBottom: 40}}
                size={'large'}
                color={colors.parpal}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileStep21;
