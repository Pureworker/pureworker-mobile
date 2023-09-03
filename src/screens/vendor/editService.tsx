import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  TextInput,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '../../constants/navigation';
import Header from '../../components/Header';
import images from '../../constants/images';
import Button from '../../components/Button';
import TextWrapper from '../../components/TextWrapper';
import commonStyle from '../../constants/commonStyle';
import tw from 'twrnc';
import {
  useCreateServiceMutation,
  useGetCategoryQuery,
} from '../../store/slice/api';
import colors from '../../constants/colors';
import {useSelector} from 'react-redux';
import {WIDTH_WINDOW, generalStyles} from '../../constants/generalStyles';
import ProfileStepWrapper from '../../components/ProfileStepWrapper';
import TextInputs from '../../components/TextInputs';
import DropDownPicker from 'react-native-dropdown-picker';
import PotfolioWrapper from '../../components/PotfolioWrapper';
import {allCountry, launchImageLibrary} from '../../constants/utils';
import Snackbar from 'react-native-snackbar';
import storage from '@react-native-firebase/storage';
import Portfoliocomp from '../../components/Portfolio';
import {SIZES, perWidth} from '../../utils/position/sizes';

const EditServices = ({route}:any) => {
  const navigation = useNavigation<StackNavigation>();
  //
  const passed_index = route.params?.index;
  const name = route.params?.name;
  console.log(passed_index, name);
  const profileData = useSelector((state: any) => state.user.profileData);
  console.log(profileData?.serviceIntro?.[passed_index], profileData?.priceRange?.[passed_index]);
  //
  const [description, setDescription] = useState(profileData?.serviceIntro?.[passed_index]?.description ||  '');
  const [shortDescription, setShortDescription] = useState('');
  const [imageObject, setImageObject] = useState({});
  const [imageUrl, setImageUrl] = useState('');
  const [potfolioImageUrl, setPotfolioImageUrl] = useState<any>([]);
  const [potfolioEnable, setPotfolioEnable] = useState(false);
  const [allPotfolio, setAllPotfolio] = useState<any>([]);
  const [key, setKey] = useState<any>(1);
  const [editkey, setEditKey] = useState<any>(null);

  const category = useSelector((state: any) => state.user.pickedServices);
  const [servicesDescription, setServicesDescription] = useState<any>([]); // State to store input values
  const [servicePrice, setServicePrice] = useState<any>([]); // State to store input values
  const [createService, {isLoading}] = useCreateServiceMutation();
  const [potfolioImageLoading, setPotfolioImageLoading] = useState(false);
  const [profileImageLoading, setProfileImageLoading] = useState(false);

  const [nationalityOpen, setNationalityOpen] = useState(false);
  const [nationalityValue, setNationalityValue] = useState(null);
  const [nationalityItems, setNationalityItems] = useState<any>([]);
  let potfolioPicture = useRef('');
  let profilePicture = useRef('');
  // console.log('nationalityItems', nationalityItems);

  const [portfolioToServiceCount, setportfolioToServiceCount] = useState([]);

  useEffect(() => {
    setNationalityItems([...allCountry]);
  }, []);

  useEffect(() => {
    if (category?.length) {
      const updatedInputValues = category.map((service: string) => ({
        serviceName: service,
        value: '',
      }));
      setServicesDescription([...updatedInputValues]);
    }
  }, [category]);

  useEffect(() => {
    if (category?.length) {
      const updatedInputValues = category.map((service: string) => ({
        serviceName: service,
        priceMin: '',
        priceMax: '',
      }));
      setServicePrice([...updatedInputValues]);
    }
  }, [category]);

  const handleInputChange = (index: number, value: string) => {
    const updatedInputValues: any = [...servicesDescription];
    updatedInputValues[index] = {...updatedInputValues[index], value};
    setServicesDescription(updatedInputValues);
  };
  const handleServicePriceMinChange = (index: number, priceMin: string) => {
    const updatedInputValues: any = [...servicePrice];
    updatedInputValues[index] = {...updatedInputValues[index], priceMin};
    setServicePrice(updatedInputValues);
  };
  const handleServicePriceMaxChange = (index: number, priceMax: string) => {
    const updatedInputValues: any = [...servicePrice];
    updatedInputValues[index] = {...updatedInputValues[index], priceMax};
    setServicePrice(updatedInputValues);
  };
  const {data: getCategoryData, isError} = useGetCategoryQuery();
  const getCategory = getCategoryData ?? [];

  const handleProfileSetup = () => {
    if (
      imageUrl &&
      description &&
      servicesDescription &&
      servicePrice &&
      nationalityValue
    ) {
      const profileData = {
        profilePicture: imageUrl,
        description: description,
        servicesDescription: JSON.stringify(servicesDescription),
        servicePrice: JSON.stringify(servicePrice),
        city: nationalityValue,
        potfolios: allPotfolio,
        serviceId: '',
      };
      createService(profileData)
        .unwrap()
        .then((data: any) => {
          if (data) {
            navigation.navigate('ProfileStep3', {serviceId: data.serviceId});
          }
        })
        .catch((error: any) => {
          console.log('err', error);
          Snackbar.show({
            text: JSON.stringify(error),
            duration: Snackbar.LENGTH_SHORT,
            textColor: '#fff',
            backgroundColor: '#88087B',
          });
        });
    } else {
      Snackbar.show({
        text: 'Please fill all fields',
        duration: Snackbar.LENGTH_SHORT,
        textColor: '#fff',
        backgroundColor: '#88087B',
      });
    }
  };

  return (
    <View style={[{flex: 1, backgroundColor: colors.greyLight}]}>
      <ScrollView>
        <Header
          style={{backgroundColor: colors.greyLight}}
          imageStyle={{tintColor: colors.black}}
          textStyle={{
            color: colors.black,
            fontFamily: commonStyle.fontFamily.semibold,
          }}
          title={'Edit Services'}
          image={images.back}
        />
        <View style={{marginHorizontal: 20}}>
          <TextWrapper
            children="Profile"
            fontType={'semiBold'}
            style={{fontSize: 20, marginTop: 30, color: colors.black}}
          />
          <TextWrapper
            children="Service Intro"
            isRequired={true}
            fontType={'semiBold'}
            style={{
              fontSize: 16,
              marginTop: 20,
              marginBottom: 13,
              color: colors.black,
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: WIDTH_WINDOW - 40,
              justifyContent: 'space-between',
              marginBottom: 13,
            }}>
            <View
              style={{
                paddingHorizontal: 10,
                justifyContent: 'center',
                backgroundColor: colors.lightBlack,
                height: 50,
                width: 120,
                borderRadius: 5,
              }}>
              <TextWrapper
                numberOfLines={1}
                fontType={'semiBold'}
                style={{
                  fontSize: 12,
                  color: '#fff',
                }}>
                {/* {item?.serviceName} */}
              {name}
              </TextWrapper>
            </View>
            <TextInput
              style={{
                width: '60%',
                paddingHorizontal: 10,
                backgroundColor: colors.lightBlack,
                borderRadius: 5,
                color: '#fff',
                height: Platform.OS === 'ios' ? 50 : 50,
              }}
              placeholderTextColor={colors.grey}
              placeholder="Enter service description"
              // key={index}
              // value={item.value} // Assign value from state
              value={description}
              onChangeText={value => handleInputChange(index, value)}
            />
          </View>

          <TextWrapper
            children="Price Range"
            isRequired={true}
            fontType={'semiBold'}
            style={{
              fontSize: 16,
              marginTop: 20,
              marginBottom: 13,
              color: colors.black,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: WIDTH_WINDOW - 40,
              justifyContent: 'space-between',
              marginBottom: 13,
            }}>
            <View
              style={{
                paddingHorizontal: 10,
                justifyContent: 'center',
                backgroundColor: colors.lightBlack,
                height: 50,
                width: 120,
                borderRadius: 5,
              }}>
              <TextWrapper
                numberOfLines={1}
                fontType={'semiBold'}
                style={{
                  fontSize: 12,
                  color: '#fff',
                }}>
                {/* {item?.serviceName} */}
                {name}
              </TextWrapper>
            </View>

            <View style={[generalStyles.rowCenter]}>
              <TextInput
                style={{
                  width: 80,
                  paddingHorizontal: 10,
                  backgroundColor: colors.lightBlack,
                  borderRadius: 5,
                  color: '#fff',
                  height: Platform.OS === 'ios' ? 50 : 50,
                }}
                placeholderTextColor={colors.grey}
                placeholder="N"
                keyboardType="number-pad"
                value=""
                // key={index}
                // value={item.value} // Assign value from state
                onChangeText={value =>
                  handleServicePriceMinChange(index, value)
                }
              />
              <TextWrapper
                fontType={'semiBold'}
                style={{
                  fontSize: 12,
                  color: colors.black,
                  marginHorizontal: 10,
                }}>
                to
              </TextWrapper>
              <TextInput
                style={{
                  width: 80,
                  paddingHorizontal: 10,
                  backgroundColor: colors.lightBlack,
                  borderRadius: 5,
                  color: '#fff',
                  height: Platform.OS === 'ios' ? 50 : 50,
                }}
                placeholderTextColor={colors.grey}
                placeholder="N"
                keyboardType="number-pad"
                value=""
                // key={index}
                // value={item.value} // Assign value from state
                onChangeText={value =>
                  handleServicePriceMaxChange(index, value)
                }
              />
            </View>
          </View>
          <View
            style={{
              minHeight: 500,
              marginBottom: -400,
              zIndex: 1,
            }}>
            <TextWrapper
              children="What City do you offer your Services?"
              isRequired={true}
              fontType={'semiBold'}
              style={{
                fontSize: 16,
                marginTop: 20,
                marginBottom: 13,
                color: colors.black,
              }}
            />
            <ScrollView horizontal>
              <DropDownPicker
                open={nationalityOpen}
                value={nationalityValue}
                items={nationalityItems}
                setOpen={setNationalityOpen}
                setValue={setNationalityValue}
                setItems={setNationalityItems}
                showArrowIcon={false}
                zIndex={10}
                placeholder="City"
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
                placeholderStyle={{
                  fontFamily: commonStyle.fontFamily.regular,
                  fontSize: 14,
                  color: '#9E9E9E',
                }}
                style={{
                  backgroundColor: colors.lightBlack,
                  borderColor: colors.primary,
                  borderWidth: 2,
                  width: SIZES.width * 0.875,
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
            </ScrollView>
          </View>
          <View style={{zIndex: nationalityOpen ? 0 : 2}}>
            <TextWrapper
              children="Portfolio  (You can add a maximum of 3 per service)"
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
            <TouchableOpacity
              style={[
                tw`bg-[${colors.darkPurple}] py-3 rounded-lg ml-auto items-center justify-center`,
                {width: perWidth(175)},
              ]}
              onPress={() => {
                // if (allPotfolio.length < 3) {
                //   setPotfolioEnable(true);
                // }
                setportfolioToServiceCount([...portfolioToServiceCount, 1]);
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

            <View>
              {portfolioToServiceCount?.map((item, index) => {
                return <Portfoliocomp servicePrice={servicePrice} />;
              })}
            </View>

            {allPotfolio.length == 3 && (
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

            {/* {potfolioEnable || shortDescription || potfolioImageUrl.length ? (
              <View>
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
                    height: 70,
                    backgroundColor: colors.greyLight1,
                    borderRadius: 5,
                    color: '#000',
                  }}
                  placeholderTextColor={colors.grey}
                  placeholder="Breiefly talk about the portfolio.....Max: 20 words"
                  value={shortDescription}
                  onChangeText={setShortDescription}
                />

                {!potfolioImageLoading ? (
                  <View>
                    {potfolioImageUrl.length < 3 && (
                      <>
                        <TouchableOpacity
                          onPress={async () => {
                            try {
                              const response: any = await launchImageLibrary();
                              setPotfolioImageLoading(true);
                              if (response) {
                                const filename = response?.uri.substring(
                                  response?.uri.lastIndexOf('/') + 1,
                                );
                                const uploadUri =
                                  Platform.OS === 'ios'
                                    ? response?.uri.replace('file://', '')
                                    : response.uri;
                                const task = await storage()
                                  .ref(filename)
                                  .putFile(uploadUri);
                                if (task.metadata) {
                                  potfolioPicture.current =
                                    task.metadata.fullPath;
                                }
                                let url;
                                if (potfolioPicture.current) {
                                  url = await storage()
                                    .ref(potfolioPicture.current)
                                    .getDownloadURL();
                                }
                                setPotfolioImageUrl([...potfolioImageUrl, url]);
                                potfolioPicture.current = '';
                                setPotfolioImageLoading(false);
                              } else {
                                setPotfolioImageLoading(false);
                              }
                              setPotfolioImageUrl([...potfolioImageUrl, url]);
                              potfolioPicture.current = '';
                              setPotfolioImageLoading(false);
                            } catch {
                              setPotfolioImageLoading(false);
                            }
                          }}
                          style={[
                            generalStyles.contentCenter,
                            {
                              height: 25,
                              width: 120,
                              borderRadius: 5,
                              marginTop: 13,
                              backgroundColor: colors.lightBlack,
                            },
                          ]}>
                          <TextWrapper
                            children="Upload Images"
                            isRequired={false}
                            fontType={'semiBold'}
                            style={{
                              textAlign: 'center',
                              fontSize: 12,
                              color: colors.white,
                            }}
                          />
                        </TouchableOpacity>
                      </>
                    )}

                    <View style={[generalStyles.rowCenter, {marginRight: 20}]}>
                      {potfolioImageUrl.map((item: any, index: number) => {
                        return (
                          <View
                            key={index}
                            style={[
                              [generalStyles.rowCenter, {marginRight: 20}],
                              {marginTop: 10},
                            ]}>
                            <TextWrapper
                              children={item?.slice(-8)}
                              isRequired={false}
                              fontType={'semiBold'}
                              style={{
                                textAlign: 'center',
                                fontSize: 12,
                                color: colors.black,
                              }}
                            />
                            <TouchableOpacity
                              onPress={() => {
                                setPotfolioImageUrl(
                                  potfolioImageUrl.filter(
                                    (text: any) => text !== item,
                                  ),
                                );
                              }}>
                              <Image
                                source={images.cross}
                                resizeMode="contain"
                                style={{
                                  width: 10,
                                  height: 10,
                                  marginLeft: 20,
                                  tintColor: '#000',
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                    </View>
                    <Button
                      onClick={() => {
                        if (!shortDescription) {
                          Snackbar.show({
                            text: 'Please enter potfolio description',
                            duration: Snackbar.LENGTH_SHORT,
                            textColor: '#fff',
                            backgroundColor: '#88087B',
                          });
                          return;
                        }
                        const data = {
                          key: key,
                          shortDescription: shortDescription,
                          potfolioImages: potfolioImageUrl,
                        };
                        setKey(key + 1);
                        if (editkey) {
                          const objIndex = allPotfolio.findIndex(
                            (obj: any) => obj.key == editkey,
                          );
                          allPotfolio[objIndex].potfolioImages =
                            potfolioImageUrl;
                          allPotfolio[objIndex].shortDescription =
                            shortDescription;
                          setAllPotfolio([...allPotfolio]);
                        } else {
                          setAllPotfolio([...allPotfolio, data]);
                        }
                        setEditKey(null);
                        setShortDescription('');
                        setPotfolioImageUrl([]);
                        setPotfolioEnable(false);
                      }}
                      style={{
                        width: 80,
                        marginTop: 10,
                        alignSelf: 'flex-end',
                        backgroundColor: colors.lightBlack,
                      }}
                      textStyle={{color: colors.primary}}
                      text={'Done'}
                    />
                  </View>
                ) : (
                  <ActivityIndicator
                    style={{marginTop: 50}}
                    size={'large'}
                    color={colors.parpal}
                  />
                )}
              </View>
            ) : null} */}

            {!isLoading ? (
              <View style={{marginHorizontal: 25, marginTop: 75}}>
                <Button
                  onClick={() => {
                    // handleProfileSetup();
                    // navigation.navigate('ProfileStep3', {serviceId: data?.serviceId});
                    navigation.navigate('ProfileStep3', {serviceId: 'id_here'});
                  }}
                  style={{
                    marginBottom: 20,
                    marginTop: 20,
                    marginHorizontal: 40,
                    backgroundColor: colors.lightBlack,
                  }}
                  textStyle={{color: colors.primary}}
                  text={'Save'}
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
        <View style={tw`h-30`} />
      </ScrollView>
    </View>
  );
};

export default EditServices;
