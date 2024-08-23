import React from 'react';
import { View, Text, Image } from 'react-native';

import moment from 'moment';
import commonStyle from '../../constants/commonStyle';


type SenderMsgProps = {
    message: string
    index: number
    time: string
}
const SenderMsg = ({ message, index, time }: SenderMsgProps) => {

    return (
        <View
            key={index}
            style={{
                flexDirection: 'row-reverse',
                marginVertical: 8,
                alignSelf: 'flex-end',

            }}>
            <View
                style={{
                    borderRadius: 5,
                    marginLeft: 30,
                    backgroundColor: '#E2E2E2',
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
                        fontFamily: commonStyle.fontFamily.regular,
                        color: '#555555',
                        fontSize: 11,
                        marginTop: 'auto'
                    }}>
                    {moment(time).format('hh:mm')}
                </Text>
            </View>
        </View>
    );
};
export default SenderMsg;
