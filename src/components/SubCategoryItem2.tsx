import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';

import TextWrapper from './TextWrapper';
import colors from '../constants/colors';
import {useDispatch, useSelector} from 'react-redux';
import {
  addCategory,
  addprovidersByCateegory,
  removeCategory,
} from '../store/reducer/mainSlice';
import {getProviderByService} from '../utils/api/func';
import {useNavigation} from '@react-navigation/native';
import tw from 'twrnc';

const SubCategoryItem = ({style, itemDetail, index}: any) => {
  const category = useSelector((state: any) => state.user.category);
  const providersByCateegory = useSelector(
    (state: any) => state.user.providersByCateegory,
  );
  const title = itemDetail.value || itemDetail?.name;
  const dispatch = useDispatch();

  // useEffect(() => {

  //   ();
  // }, [dispatch, id]);
  const [isLoading, setisLoading] = useState(false);

  const userType = useSelector((state: any) => state.user.isLoggedIn);

  const initFecthProviders = async (id: any) => {
    setisLoading(true);
    const res: any = await getProviderByService(id);
    console.log('service-dddddddd', res?.data);
    if (res?.status === 201 || res?.status === 200) {
      dispatch(addprovidersByCateegory(res?.data?.data));
    }
    //if customer navigate to _service , if provide navigate to _VService
    if (userType.userType === 'CUSTOMER') {
      navigation.navigate('_Services', {service: itemDetail});
    } else {
      navigation.navigate('_VServices', {service: itemDetail});
    }
    setisLoading(false);
  };
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        // console.log(providersByCateegory);
        // console.log(itemDetail);
        initFecthProviders(itemDetail?._id);
      }}
      style={[
        tw`rounded-full items-center justify-center `,
        {
          marginTop: 8,
          borderWidth: 1,
          marginBottom: 4,
          borderColor: colors.primary,
          marginRight: 8,
        },
      ]}>
      <TextWrapper
        fontType={'semiBold'}
        style={{
          color: colors.white,
          marginLeft: 0,
          paddingVertical: 4,
          paddingHorizontal: 10,
        }}>
        {title}
      </TextWrapper>
    </TouchableOpacity>
  );
};

export default SubCategoryItem;
