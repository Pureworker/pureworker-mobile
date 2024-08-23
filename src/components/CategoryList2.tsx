import React, { useEffect, useState } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';

import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import { useDispatch } from 'react-redux';
import SubCategoryItem from './SubCategoryItem2';
import TextWrapper from './TextWrapper';
import images from '../constants/images';
import colors from '../constants/colors';
// import {getSubCategory} from '../utils/api/func';
import { getSubCategory } from '../utils/api/func';

type SubCategoryListPRops = {
  categoryName: string;
  catId: number;
};
type SubCategoryListProps = {
  categoryName: string;
  catId: number;
  isOpen: boolean; // New prop for controlling the dropdown state
  onDropdownClick: (catId: number) => void; // Callback for updating parent component's state
};

const CategoryList = ({
  categoryName,
  catId,
  isOpen,
  onDropdownClick,
}: SubCategoryListProps) => {
  const [collapseState, setCollapseState] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [_getSubCategory, set_getSubCategory] = useState([]);
  // const {
  //   data: getSubCategoryData,
  //   isLoading,
  //   isError,
  // } = useGetSubCategoriesQuery({categoryId: catId});
  // const getSubCategory = getSubCategoryData ?? [];
  const dispatch = useDispatch();
  useEffect(() => {
    const initGetCategory = async () => {
      setisLoading(true);
      const res: any = await getSubCategory(catId);
      if (res?.status === 201 || res?.status === 200) {

        set_getSubCategory(res?.data?.data?.[0]?.services);
      }
      setisLoading(false);
    };
    initGetCategory();
  }, []);

  return (
    <View style={{}}>
      <Collapse
        onToggle={() => {
          if (!isLoading) {
            setDataLoaded(true);
          }
          onDropdownClick(catId);
          setCollapseState(!collapseState);
          console.log(_getSubCategory);
        }}
        isExpanded={isOpen}
        style={{
          justifyContent: 'center',
          flexDirection: 'column',
        }}>
        <CollapseHeader
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.lightBlack,
            marginVertical: 10,
            borderRadius: 5,
            height: 35,
            width: '95%',
            borderColor: colors.primary,
            borderWidth: 2,
            paddingHorizontal: 15,
          }}>
          <View style={{}}>
            <TextWrapper
              fontType={'semiBold'}
              style={{
                fontSize: 14,
                color: '#fff',
              }}>
              {categoryName}
            </TextWrapper>
          </View>
          {isOpen ? (
            <Image
              source={images.polygonDown}
              resizeMode={'contain'}
              style={{width: 15, height: 15}}
            />
          ) : (
            <Image
              source={images.polygonForward}
              resizeMode={'contain'}
              style={{width: 15, height: 15}}
            />
          )}
          <TextWrapper
            fontType={'semiBold'}
            style={{
              fontSize: 35,
              color: '#D20713',
              position: 'absolute',
              right: -25,
            }}
            children={''}>
            {/* {'*'} */}
          </TextWrapper>
        </CollapseHeader>
        <CollapseBody>
          {isLoading ? (
            <ActivityIndicator
              style={{marginTop: 332}}
              size={'large'}
              color={colors.parpal}
            />
          ) : (
            <>
              {_getSubCategory && (
                <View
                  style={{
                    borderColor: colors.primary,
                    backgroundColor: colors.lightBlack,
                    borderWidth: 2,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    width: '95%',
                    paddingLeft: 4,
                  }}>
                  {_getSubCategory.map((item: any, index: number) => {
                    var offerStyle;
                    if (index > 0) {
                      offerStyle = {marginBottom: 25};
                    }
                    return (
                      <SubCategoryItem
                        style={{}}
                        key={index}
                        itemDetail={item}
                        catId={catId}
                        index={index}
                      />
                    );
                  })}
                </View>
              )}
            </>
          )}
        </CollapseBody>
      </Collapse>
    </View>
  );
};
export default CategoryList;
