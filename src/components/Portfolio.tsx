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
import Portfoliocomp2 from './Portfolio2';

export default function Portfoliocomp({servicePrice}: any) {
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
            ? response?.ur?.replace('file://', '')
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
        //upload to firebase
        // const task = await storage().ref(filename).putFile(uploadUri);
        // console.log('kkkk2', task);
        // setPhotoUri(resp?.assets[0].uri);
      }
    });
  };

  const alldata = {
    service:
      services?.filter(item => item?.label === nationalityValue)?.[0]
        ?.service || null,
    description: 'I know my craft very well',
    images: [
      'https://res.cloudinary.com/dr0pef3mn/image/upload/v1693319953/pure/1693319950720-pure%20worker%20logo.png.png',
    ],
  };
  console.log('pirce-', servicePrice);

  const [all_Array, setall_Array] = useState([]);

  return (
    <View style={{marginTop: 15}}>
      <View
        style={{
          zIndex: 1,
        }}>
        <View>
          <DropDownPicker
            open={nationalityOpen}
            value={nationalityValue}
            items={services}
            setOpen={setNationalityOpen}
            setValue={setNationalityValue}
            setItems={setNationalityItems}
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
      {portfolioCount?.map((item, index) => {
        return (
          <Portfoliocomp2
            servicePrice={servicePrice}
            service={
              services?.filter(
                (item: {label: null}) => item?.label === nationalityValue,
              )?.[0]?.service
            }
            key={index}
            index={index}
            func={(item: any) => {
              const olddata = all_Array;
              const data: any = [...olddata, item];
              setall_Array(data);
            }}
          />
        );
      })}
      <Button
        onClick={() => {
          if (portfolioCount.length < 3) {
            setportfolioCount([...portfolioCount, 1]);
          } else {
            Snackbar.show({
              text: 'Max of 3 portfolios for each service',
              duration: Snackbar.LENGTH_LONG,
              textColor: '#fff',
              backgroundColor: '#88087B',
            });
            return;
          }
          //   if (!shortDescription) {
          //     Snackbar.show({
          //       text: 'Please enter potfolio description',
          //       duration: Snackbar.LENGTH_LONG,
          //       textColor: '#fff',
          //       backgroundColor: '#88087B',
          //     });
          //     return;
          //   }
          //   const data = {
          //     key: key || '',
          //     shortDescription: shortDescription,
          //     potfolioImages: potfolioImageUrl,
          //   };
          //   setKey(key + 1);
          //   if (editkey) {
          //     const objIndex = allPotfolio.findIndex(
          //       (obj: any) => obj.key == editkey,
          //     );
          //     allPotfolio[objIndex].potfolioImages = potfolioImageUrl;
          //     allPotfolio[objIndex].shortDescription = shortDescription;
          //     setAllPotfolio([...allPotfolio]);
          //   } else {
          //     setAllPotfolio([...allPotfolio, data]);
          //   }
          //   setEditKey(null);
          //   setShortDescription('');
          //   setPotfolioImageUrl([]);
          //   setPotfolioEnable(false);
        }}
        style={{
          width: 80,
          height: 40,
          marginTop: 10,
          alignSelf: 'flex-end',
          backgroundColor: colors.lightBlack,
        }}
        textStyle={{color: colors.primary}}
        text={'Add'}
      />
    </View>
  );
}
