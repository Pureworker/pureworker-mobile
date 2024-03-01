import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {StackNavigation} from '../../constants/navigation';
import images from '../../constants/images';
import tw from 'twrnc';
import Textcomp from '../../components/Textcomp';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import MapView, {Marker} from 'react-native-maps';
import {SIZES, perWidth} from '../../utils/position/sizes';
import {getProviderLocation} from '../../utils/api/func';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomLoading from '../../components/customLoading';
import {setProviderLocation} from '../../store/reducer/mainSlice';
import FastImage from 'react-native-fast-image';
import ProviderIcon from '../../assets/svg/provider';

const ViewLocation = ({route}: any) => {
  const navigation = useNavigation<StackNavigation>();
  const providerLocation = useSelector(
    (state: any) => state.user.providerLocation,
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const {id, item} = route.params;

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // const res: any = await getProviderLocation('65cb95af993d69fb83faf837');
        const res: any = await getProviderLocation(id);
        console.log('location.........', res?.data);
        if (res?.status === 201 || res?.status === 200) {
          if (res?.data?.data !== null) {
            dispatch(setProviderLocation(res?.data?.data));
          }
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };
    // Fetch location initially
    fetchLocation();
    // Fetch location every 30 seconds
    const intervalId = setInterval(fetchLocation, 30000);

    // Cleanup function to clear the interval
    return () => clearInterval(intervalId);
  }, []);

  const latitude = 6.5244;
  const longitude = 3.3792;
  const mapRef = useRef<MapView>(null);
  const [region, setregion] = useState({
    latitude: providerLocation.lat,
    longitude: providerLocation.long,
    latitudeDelta: 0.26,
    longitudeDelta: 0.26,
  });

  // useEffect(() => {
  //   if (mapRef.current && providerLocation.lat && providerLocation.long) {
  //     const markers = [
  //       {latitude: latitude, longitude: longitude},
  //       {latitude: providerLocation.lat, longitude: providerLocation.long},
  //     ];
  //     const region = calculateRegion(markers);
  //     mapRef.current.animateToRegion(region, 1000);
  //   }
  // }, [providerLocation.lat, providerLocation.long]);

  // useEffect(() => {
  //   if (mapRef.current && providerLocation.lat && providerLocation.long) {
  //     const markers = [
  //       {latitude: latitude, longitude: longitude},
  //       {latitude: providerLocation.lat, longitude: providerLocation.long},
  //     ];
  //     const region = calculateRegion(markers);
  //     mapRef.current.animateToRegion(region, 1000);
  //   }
  // }, [providerLocation.lat, providerLocation.long]);

  useEffect(() => {
    if (mapRef.current && providerLocation.lat && providerLocation.long) {
      const region = {
        latitude: providerLocation.lat,
        longitude: providerLocation.long,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
      mapRef.current.animateToRegion(region, 1000);
    }
  }, [providerLocation.lat, providerLocation.long]);

  const calculateRegion = (
    markers: {latitude: number; longitude: number}[],
  ) => {
    const minLat = Math.min(...markers.map(marker => marker.latitude));
    const maxLat = Math.max(...markers.map(marker => marker.latitude));
    const minLng = Math.min(...markers.map(marker => marker.longitude));
    const maxLng = Math.max(...markers.map(marker => marker.longitude));

    const latitude = (minLat + maxLat) / 2;
    const longitude = (minLng + maxLng) / 2;
    const latitudeDelta = Math.abs(maxLat - minLat) * 1.5;
    const longitudeDelta = Math.abs(maxLng - minLng) * 1.5;

    return {
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta,
    };
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#EBEBEB'}}>
      <ScrollView>
        <View
          style={{
            marginTop:
              Platform.OS === 'ios'
                ? 5
                : StatusBar.currentHeight &&
                  StatusBar.currentHeight + 10,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: 20,
            paddingVertical: 10,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={images.back}
              style={{height: 25, width: 25}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={tw`mx-auto`}>
            <Textcomp
              text={'View Location'}
              size={17}
              lineHeight={17}
              color={'#000413'}
              fontFamily={'Inter-SemiBold'}
            />
          </View>
        </View>

        <View style={tw`flex-1 bg-red-400 `}>
          <>
            {loading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator size="large" color={'white'} />
              </View>
            ) : (
              <>
                <MapView
                  style={{height: SIZES.height * 0.9, width: SIZES.width}}
                  ref={mapRef}
                  initialRegion={region}
                  // initialRegion={{
                  //   latitude: latitude,
                  //   longitude: longitude,
                  //   latitudeDelta: 0.26,
                  //   longitudeDelta: 0.26,
                  // }}
                  showsCompass={true}>
                  {providerLocation.lat && (
                    <Marker
                      coordinate={{
                        latitude: providerLocation.lat,
                        longitude: providerLocation.long,
                      }}
                      title={`${item?.serviceProvider?.fullName}`}
                      description="Service Provider"
                      identifier="Service Provider"
                      pinColor="red">
                      {item?.serviceProvider?.profilePic && (
                        <ProviderIcon />
                        // <FastImage
                        //   style={[
                        //     tw``,
                        //     {
                        //       width: perWidth(30),
                        //       height: perWidth(30),
                        //       borderRadius: perWidth(30) / 2,
                        //     },
                        //   ]}
                        //   source={{
                        //     uri: item?.serviceProvider?.profilePic,
                        //     headers: {Authorization: 'someAuthToken'},
                        //     priority: FastImage.priority.high,
                        //   }}
                        //   resizeMode={FastImage.resizeMode.cover}
                        // />
                      )}
                    </Marker>
                  )}
                </MapView>
              </>
            )}
          </>
        </View>
      </ScrollView>
      <Spinner visible={loading} customIndicator={<CustomLoading />} />
    </SafeAreaView>
  );
};

export default ViewLocation;
