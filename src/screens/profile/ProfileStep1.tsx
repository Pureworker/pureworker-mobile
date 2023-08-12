
import React, {useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '../../constants/navigation';
import Header from '../../components/Header';
import images from '../../constants/images';
import Button from '../../components/Button';
import TextWrapper from '../../components/TextWrapper';
import commonStyle from '../../constants/commonStyle';
import CategoryList from '../../components/CategoryList';
import { useGetCategoryQuery } from '../../store/slice/api';
import colors from '../../constants/colors';
import { useDispatch, useSelector } from 'react-redux';
import { addCategory, removeCategory } from '../../store/reducer/mainSlice';
import { generalStyles } from '../../constants/generalStyles';
import ProfileStepWrapper from '../../components/ProfileStepWrapper';
import TextInputs from '../../components/TextInputs';

const PRofileStep1 = () => {
  const navigation = useNavigation<StackNavigation>();
  const [addService, setAddService] = useState('');
  const [isAddService, setIsAddService] = useState(false);

  const { data: getCategoryData, isLoading, isError } = useGetCategoryQuery();
  const getCategory = getCategoryData ?? [];

  const category = useSelector((state: any) => state.user.category);
  const dispatch = useDispatch();
  return (
    <View style={[{ flex: 1, backgroundColor: colors.greyLight }]}>
      <ScrollView>
        <Header
          style={{ backgroundColor: colors.greyLight }}
          imageStyle={{ tintColor: colors.black }}
          textStyle={{
            color: colors.black,
            fontFamily: commonStyle.fontFamily.semibold,
          }}
          title={'Complete your Registration'}
          image={images.back}
        />
        <ProfileStepWrapper active={'one'} />
        <View style={{ marginHorizontal: 20 }}>
          <TextWrapper
            children="Add Services"
            fontType={'semiBold'}
            style={{ fontSize: 20, marginTop: 30, color: colors.black }}
          />
          <TextWrapper
            children="What services do you provide?"
            fontType={'semiBold'}
            style={{
              fontSize: 16,
              marginTop: 13,
              marginBottom: 45,
              color: colors.black,
            }}
          />

          <FlatList
            style={{ flex: 1 }}
            data={getCategory}
            ListFooterComponent={() => {
              return (
                <View
                  style={{
                    flex: 1,
                    marginTop: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {isLoading && (
                    <ActivityIndicator size={'large'} color={colors.parpal} />
                  )}
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <CategoryList categoryName={item.name} catId={item?.id} />
            )}
            ListEmptyComponent={() => (
              <Text
                style={[
                  {
                    color: '#000',
                    alignSelf: 'center',
                    marginTop: 100,
                    fontFamily: commonStyle.fontFamily.regular,
                  },
                ]}>
                {!isLoading ? 'No service found' : ''}
              </Text>
            )}
          />
          {isAddService ? (
            <>
              <TextInputs
                styleInput={{ color: colors.white }}
                style={{
                  marginTop: 0,
                  backgroundColor: colors.lightBlack,
                  borderWidth: 2,
                  borderColor: colors.primary,
                }}
                labelText={'Type name of service'}
                state={addService}
                setState={setAddService}
                keyBoardType={'email-address'}
              />
              <View
                style={{
                  marginTop: 10,
                  marginBottom: 30,
                  alignItems: 'flex-end',
                }}>
                <Button
                  onClick={() => {
                    if (addService) {
                      dispatch(addCategory(addService));
                      setAddService('');
                    }
                  }}
                  style={{ width: 130, backgroundColor: colors.lightBlack }}
                  textStyle={{ color: colors.primary }}
                  text={'Done'}
                />
              </View>
            </>
          ) : null}
        </View>

        <View
          style={[
            generalStyles.rowBetween,
            { marginHorizontal: 20, marginBottom: 35 },
          ]}>
          <Button
            onClick={() => {
              setIsAddService(!isAddService);
            }}
            style={{ width: 130, backgroundColor: colors.lightBlack }}
            textStyle={{ color: colors.primary }}
            text={'Add another'}
          />
          <Button
            onClick={() => {
              navigation.navigate('ProfileStep2');
            }}
            style={{ width: 90, backgroundColor: colors.lightBlack }}
            textStyle={{ color: colors.primary }}
            text={'Next'}
          />
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {category?.length
            ? category?.map((item: any, index: any) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 13,
                    marginHorizontal: 20,
                  }}>
                  <View
                    key={index}
                    style={{
                      paddingHorizontal: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: colors.lightBlack,
                      height: 30,
                      width: 'auto',
                      borderRadius: 5,
                    }}>
                    <TextWrapper
                      fontType={'semiBold'}
                      style={{
                        fontSize: 12,
                        color: '#fff',
                      }}>
                      {item}
                    </TextWrapper>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(removeCategory(item));
                    }}>
                    <Image
                      source={images.cross}
                      style={{
                        width: 15,
                        height: 15,
                        marginLeft: 20,
                        tintColor: '#000',
                      }}
                    />
                  </TouchableOpacity>
                </View>
              );
            })
            : null}
        </View>
      </ScrollView>
    </View>
  );
};

export default PRofileStep1;
