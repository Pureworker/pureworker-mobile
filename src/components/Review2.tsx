import React, { useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

import images from '../constants/images';
import colors from '../constants/colors';

type ReviewProps = {
  size?: boolean
  editable?: boolean
  value: number
}

const Review2 = ({ editable, value, size }: ReviewProps) => {
  const [selectReview, setReviewSelect] = useState(value ? value : 0);

  if (!editable && editable !== false) {
    editable = true;
  }

  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((starData, index) => (
        <View key={starData}>
          <TouchableOpacity
            disabled={!editable}
            style={{ marginRight: 20 }}
            onPress={() => setReviewSelect(starData)}>
            {starData < selectReview || starData == selectReview ? (
              <Image
                source={size ? images.star_2 : images.star}
                style={{
                  tintColor: '#FFC727',
                  height: size ? 30 : 30,
                  width: size ? 30 : 30,
                }}
              />
            ) : (
                <Image
                  source={size ? images.star_2 : images.star}
                  style={{
                    tintColor: colors.grey,
                    height: size ? 30 : 30,
                    width: size ? 30 : 30,
                  }}
                />
              )}
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default Review2;
