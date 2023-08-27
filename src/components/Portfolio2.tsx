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

export default function Portfoliocomp2({servicePrice, index}: any) {
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
        //upload to firebase
        // const task = await storage().ref(filename).putFile(uploadUri);
        // console.log('kkkk2', task);
        // setPhotoUri(resp?.assets[0].uri);
      }
    });
  };
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
        placeholder={`Briefly talk about the portfolio ${index + 1}.....Max: 20 words`}
        value={shortDescription}
        onChangeText={setShortDescription}
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
