import React from 'react';
import {TouchableOpacity} from 'react-native';

import TextWrapper from './TextWrapper';
import colors from '../constants/colors';
import {useDispatch, useSelector} from 'react-redux';
import {addCategory, removeCategory} from '../store/reducer/mainSlice';

const SubCategoryItem = ({style, itemDetail, index}: any) => {
  const category = useSelector((state: any) => state.user.category);
  const title = itemDetail.label;
  const dispatch = useDispatch();

  return (
    <TouchableOpacity
      onPress={() => {
        if (
          Array.isArray(category) &&
          category.length &&
          category.includes(title)
        ) {
          dispatch(removeCategory(title));
        } else {
          dispatch(addCategory(title));
        }
      }}
      style={{marginTop: 8}}>
      <TextWrapper
        fontType={'semiBold'}
        style={{
          color:
            Array.isArray(category) &&
            category.length &&
            category.includes(title)
              ? colors.primary
              : colors.white,
          marginLeft: 11,
          marginRight: 8,
          marginBottom: 8,
        }}>
        {title}
      </TextWrapper>
    </TouchableOpacity>
  );
};

export default SubCategoryItem;
