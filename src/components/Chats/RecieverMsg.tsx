import React from 'react';
import { View, Text, Image } from 'react-native';

import moment from 'moment';
import commonStyle from '../../constants/commonStyle';

type RecieverMsgProps = {
    message: string
    index: number
    time: string
}

const RecieverMsg = ({ message, index, time }: RecieverMsgProps) => {

    return (
        <View
            key={index}
            style={{
                flexDirection: 'row',
                marginVertical: 8,
            }}>

            <View
                style={{
                    borderRadius: 5,
                    marginRight: 30,
                    backgroundColor: '#fff',
                    padding: 5,
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
                <Text
                    style={{
                        marginHorizontal: 7,
                        fontFamily: commonStyle.fontFamily.regular,
                        color: '#000',
                    }}>
                    {message}
                </Text>
                <Text
                    style={{
                        alignSelf: 'flex-end',
                        marginHorizontal: 7,
                        fontSize: 11,
                        fontFamily: commonStyle.fontFamily.regular,
                        color: '#555555',
                        marginTop: 'auto'
                    }}>
                    {moment(time).format('hh:mm')}
                </Text>
            </View>
        </View>
    );
};
export default RecieverMsg;
