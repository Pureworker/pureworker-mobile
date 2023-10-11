import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import TextWrapper from './TextWrapper';
import colors from '../constants/colors';
import images from '../constants/images';
import {launchImageLibrary} from 'react-native-image-picker';
import {generalStyles} from '../constants/generalStyles';
import Snackbar from 'react-native-snackbar';
import storage from '@react-native-firebase/storage';
import Button from './Button';
import commonStyle from '../constants/commonStyle';
import DropDownPicker from 'react-native-dropdown-picker';
import {addportfolio} from '../store/reducer/mainSlice';
import {useDispatch, useSelector} from 'react-redux';

export default function Portfoliocomp2({servicePrice, index, service}: any) {
  console.log('portfolio--heree', index);
  const compIndex = index;

  const [services, setservices]: any[] = useState([]);
  const [portfolioCount, setportfolioCount] = useState([0]);
  useEffect(() => {
    const ramp = () => {
      let array: any[] = [];
      servicePrice?.map((item, index) => {
        let obj = {
          ...item,
          label: item?.serviceName,
          value: item?.serviceName,
        };
        array.push(obj);
      });
      setservices(array);
    };
    ramp();
  }, []);

  // console.log(service, );

  const [potfolioImageUrl, setPotfolioImageUrl] = useState([]);
  const [potfolioImageLoading, setPotfolioImageLoading] = useState(false);
  const [shortDescription, setShortDescription] = useState('');
  const [key, setKey] = useState<any>(1);
  const [nationalityOpen, setNationalityOpen] = useState(false);
  const [nationalityValue, setNationalityValue] = useState(null);
  const [nationalityItems, setNationalityItems] = useState<any>([]);

  const [portfolioImagesData, setportfolioImagesData] = useState([]);
  const pickPicture2 = async () => {
    try {
      const response: any = await launchImageLibrary();
      setPotfolioImageLoading(true);
      console.log('kkkk', response);
      if (response) {
        const filename = response?.uri.substring(
          response?.uri.lastIndexOf('/') + 1,
        );
        console.log('kkkk', response);
        const uploadUri =
          Platform.OS === 'ios'
            ? response?.uri.replace('file://', '')
            : response.uri;
        const task = await storage().ref(filename).putFile(uploadUri);
        console.log('kkkk2', task);
        if (task.metadata) {
          potfolioPicture.current = task.metadata.fullPath;
        }
        let url;
        if (potfolioPicture.current) {
          url = await storage().ref(potfolioPicture.current).getDownloadURL();
        }

        setPotfolioImageUrl([...potfolioImageUrl, url]);

        console.log('kkkk3', potfolioImageUrl);

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
  };

  const options = {mediaType: 'photo', selectionLimit: 1};
  const pickPicture = () => {
    console.log('called logo');
    launchImageLibrary(options, async (resp: unknown) => {
      if (resp?.assets?.length > 0) {
        // console.log('resp', resp?.assets);
        const filename = resp?.assets[0]?.fileName;
        console.log('resp', resp?.assets[0]);
        setportfolioImagesData([...portfolioImagesData, resp?.assets[0]]);

        const temp_data = {
          service: service,
          description: shortDescription,
          images:
            portfolioImagesData?.map(item => {
              return item?.uri;
            }) || [],
        };
        // updatePortfolioItem(service, index, temp_data);
        //upload to firebase
        // const task = await storage().ref(filename).putFile(uploadUri);
        // console.log('kkkk2', task);
        // setPhotoUri(resp?.assets[0].uri);
      }
    });
  };

  useEffect(() => {
    const img: [] = portfolioImagesData?.map(item => {
      return item?.uri;
    });
    setimaageURIs(img);
  }, [portfolioImagesData]);

  const [imaageURIs, setimaageURIs] = useState([]);
  console.log('iiiiimmm', imaageURIs);
  // const _data = {
  //   service: '64eb9594d0ea85df8ffa4e97',
  //   description: shortDescription,
  //   images: img,
  // };

  const _data = {
    service: service,
    description: shortDescription,
    images: imaageURIs,
  };
  const portfolio = useSelector((state: any) => state.user.portfolio3);
  console.log(portfolio);

  const dispatch = useDispatch();
  const [Alldata, setAlldata] = useState({});
  const [Alldata2, setAlldata2] = useState({});
  const [Alldata3, setAlldata3] = useState({});

  function updateData(serviceId: string | number, index: number, newData: any) {
    // Check if the serviceId exists in the data
    const data: any = {...Alldata};
    console.log('start', index, data);
    if (data.hasOwnProperty(index)) {
      // Check if the array at the index already exists
      if (Array.isArray(data[`${index}`])) {
        console.log('here1');
        // Check if the index is within the bounds of the array
        if (index >= 0 && index < data[`${index}`].length) {
          console.log('here2');
          // Update the existing data at the specified index
          data[`${index}`][compIndex] = newData;
        } else {
          // Index is out of bounds, so push the newData to the array
          data[`${index}`].push(newData);
        }
      } else {
        // If the serviceId exists but is not an array, create a new array with newData
        data[`${index}`] = [newData];
      }
    } else {
      // If the serviceId doesn't exist, create a new entry with newData as the first element in an array
      data[`${index}`] = [newData];
    }
    console.log('finish', data);
    console.log('all', Alldata);
    setAlldata(data);
  }

  // const updatePortfolioItem = (
  //   serviceId: any,
  //   itemIndex: any,
  //   newData: {description: any; images: any; service: any},
  // ) => {
  //   const itemToUpdateIndex = itemIndex;
  //   // Get the current state from Redux

  //   // Find the index of the service matching the given serviceId
  //   // const serviceIndex = portfolio.findIndex(
  //   //   item => item.service === serviceId,
  //   // );

  //   // If the service doesn't exist, create it with the new data
  //   // if (serviceIndex === -1) {
  //   //   const newService = {
  //   //     service: serviceId,
  //   //     description: newData.description,
  //   //     images: [newData.images],
  //   //   };
  //   //   const servicesWithSameId = portfolio.filter(
  //   //     (item: {service: any}) => item.service === serviceId,
  //   //   );
  //   //   // portfolio.push(newService);
  //   //   if (servicesWithSameId.length >= 3) {
  //   //     // Replace the first object with the new data
  //   //     // const indexToReplace = portfolio.findIndex((item) => item.service === serviceId);
  //   //     portfolio[itemToUpdateIndex] = newService;
  //   //   } else {
  //   //     // Add the new service to the portfolio
  //   //     portfolio.push(newService);
  //   //   }
  //   // } else {
  //   //   // Check if there are already three objects with the same "service" value

  //   //   // If the service exists, find the specific item to update
  //   //   const itemToUpdate = portfolio[serviceIndex];
  //   //   // .find(
  //   //   //   (        item: { service: any; }) => item.service === newData.service,
  //   //   // );

  //   //   if (itemToUpdate) {
  //   //     // Update the specific item with the new data
  //   //     itemToUpdate.description = newData.description;
  //   //     itemToUpdate.images = newData.images;
  //   //   }
  //   //   portfolio[serviceIndex] = itemToUpdate;

  //   //   console.log('itemtoupdat _', portfolio);
  //   //   // else {
  //   //   //   // If the specific item doesn't exist, add it
  //   //   //   portfolio[serviceIndex].images.push(newData);
  //   //   // }
  //   // }

  //   // if (portfolio.hasOwnProperty(serviceId)) {
  //   //   const serviceData = portfolio[serviceId];
  //   //   if (serviceData.length < 3) {
  //   //     // Add the new data to the existing serviceId
  //   //     serviceData.push(newData);
  //   //   } else {
  //   //     // Handle the case where the serviceId already has 3 objects
  //   //     console.error(`Service with ID ${serviceId} already has 3 objects.`);
  //   //   }
  //   // } else {
  //   //   portfolio[serviceId] = [newData];
  //   //   console.log('kkk', portfolio, portfolio.hasOwnProperty(serviceId));
  //   // }

  //   if (!portfolio[serviceId]) {
  //     console.log(serviceId);

  //     const d = {...portfolio, `${serviceId}`:}

  //     // Service not found, create a new service object
  //     portfolio[serviceId]?.unshift(newData);
  //     // portfolio['64eb9584d0ea85df8ffa4e49'] = [];
  //   } else {
  //     console.log(false);

  //     if (itemIndex < portfolio[serviceId].length) {
  //       // Update the specified item with the new data
  //       portfolio[serviceId][itemIndex] = newData;
  //     } else {
  //       // Item index is out of range for the service
  //       console.error(
  //         `Item index ${itemIndex} is out of range for service ${serviceId}`,
  //       );
  //       return;
  //     }
  //   }
  //   console.log('kkk', portfolio);

  //   // Dispatch the action to update the Redux state
  //   dispatch(addportfolio(portfolio));
  // };

  // const updatePortfolioItem = (
  //   serviceId: any,
  //   itemIndex: any,
  //   newData: {service: any; description: string; images: never[] | any[]},
  // ) => {
  //   console.log(itemIndex);

  //   // Get the current state from Redux

  //   // Find the index of the service matching the given serviceId
  //   const serviceIndex = portfolio.findIndex(
  //     item => item.service === serviceId,
  //   );

  //   // Make a copy of the portfolio array to avoid mutating the state
  //   const updatedPortfolio = [...portfolio];

  // if (serviceIndex === -1) {
  //   // Service not found, create a new service object and add it to the portfolio
  //   const newService = {
  //     service: serviceId,
  //     description: '', // Set your default description
  //     images: [], // Set an empty array or provide any other defaults
  //   };
  //   updatedPortfolio.unshift(newService);
  // }
  //   // Find the index of the item to be updated in the service
  //   const itemToUpdateIndex = itemIndex;
  //   console.log(
  //     'hmm',
  //     serviceIndex,
  //     updatedPortfolio[serviceIndex],
  //     updatedPortfolio[serviceIndex].images.length,
  //   );

  //   // if (
  //   //   updatedPortfolio[serviceIndex] &&
  //   //   itemToUpdateIndex >= updatedPortfolio[serviceIndex].images.length
  //   // ) {
  //   //   // Invalid item index or undefined service, handle the error as needed
  //   //   console.error(
  //   //     `Item index ${itemIndex} is out of range for service ${serviceId}`,
  //   //   );
  //   //   return;
  //   // }
  //   // Update the specified item with the new data
  //   if (updatedPortfolio[serviceIndex]) {
  //     updatedPortfolio[serviceIndex] =
  //       // .images[itemToUpdateIndex]
  //       newData;
  //   }
  //   // Dispatch the action to update the Redux state
  //   dispatch(addportfolio(updatedPortfolio));
  // };

  // const updatePortfolioItem = (
  //   serviceId: any,
  //   itemIndex: any,
  //   newData: any,
  // ) => {
  //   // Get the current state from Redux
  //   // const {portfolio} = getState();

  //   // Find the index of the service matching the given serviceId
  //   const serviceIndex = portfolio?.findIndex(
  //     (item: {service: any}) => item?.service === serviceId,
  //   );

  //   // if (serviceIndex === -1) {
  //   //   // Service not found, handle the error as needed
  //   //   console.error(`Service with ID ${serviceId} not found.`);
  //   //   return;
  //   // }

  //   // Make a copy of the portfolio array to avoid mutating the state
  //   const updatedPortfolio = [...portfolio];
  //   if (serviceIndex === -1) {
  //     // Service not found, add a new object with the given serviceId
  //     updatedPortfolio.unshift({
  //       service: serviceId,
  //       description: '', // Set your default description
  //       images: [], // Set an empty array or provide any other defaults
  //     });
  //   }

  //   // Find the index of the item to be updated in the service
  //   const itemToUpdateIndex = itemIndex;

  //   if (itemToUpdateIndex >= updatedPortfolio[serviceIndex].length) {
  //     // Invalid item index, handle the error as needed
  //     console.error(
  //       `Item index ${itemIndex} is out of range for service ${serviceId}`,
  //     );
  //     return;
  //   }

  //   // Update the specified item with the new data
  //   updatedPortfolio[serviceIndex][itemToUpdateIndex] = newData;

  //   // Dispatch the action to update the Redux state
  //   dispatch(addportfolio(updatedPortfolio));
  //   console.log(portfolio);

  // };

  return (
    <View style={{marginTop: index === 0 ? 0 : 20}}>
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
        placeholder={`Briefly talk about the portfolio ${
          index + 1
        }.....Max: 20 words`}
        value={shortDescription}
        onChangeText={text => {
          setShortDescription(text);
          const temp_data = {
            service: service,
            description: text || shortDescription,
            images: imaageURIs,
          };
          // updatePortfolioItem(service, index, temp_data);
          updateData(service, compIndex, temp_data);
        }}
      />

      {!potfolioImageLoading ? (
        <View>
          {potfolioImageUrl.length < 3 && (
            <>
              <TouchableOpacity
                onPress={async () => {
                  pickPicture();
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
            {portfolioImagesData?.map((item: any, index: number) => {
              return (
                <View
                  key={index}
                  style={[
                    [generalStyles.rowCenter, {marginRight: 20}],
                    {marginTop: 10},
                  ]}>
                  <TextWrapper
                    // children={item?.slice(-8)}
                    children={item?.fileName.slice(-8)}
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
                      setportfolioImagesData(
                        portfolioImagesData.filter(
                          (text: any) => text.fileName !== item?.fileName,
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
        </View>
      ) : (
        <ActivityIndicator
          style={{marginTop: 50}}
          size={'large'}
          color={colors.parpal}
        />
      )}
    </View>
  );
}
