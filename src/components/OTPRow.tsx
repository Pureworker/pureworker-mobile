import React from 'react'
import { View } from "react-native";

import OtpBox from './OtpBox';

export default class OTPRow extends React.Component {

  constructor(props: any) {
    super(props);

    this.state = {
      otp: [],
    };

    this.a1:  = React.createRef();
    this.a2 = React.createRef();
    this.a3 = React.createRef();
    this.a4 = React.createRef();
    this.a5 = React.createRef();
    this.a6 = React.createRef();

    this.boxes = Array.apply(null, Array(6)).map(function () {});

    this.moveTextInput = this.moveTextInput.bind(this);
    this.updateOTP = this.updateOTP.bind(this);
  }

  moveTextInput = (direction: String, index: number) => {

    if (index == 0) {
      if (direction === 'left') {
      } else if (direction === 'right') {
        this[`a${index + 2}`].current.focus();
      }
    } else if (index == this.boxes.length - 1) {
      if (direction === 'left') {
        this[`a${index}`].current.focus();
      } else if (direction === 'right') {
        this[`a${index + 1}`].current.blur();

        this.props.confirmCode(this.state.otp.join(''), () => {
          for (let i = 0; i < this.boxes.length; i++) {
            this[`a${i + 1}`].current.clear();
          }
          this[`a${this.boxes.length}`].current.clear();
        });
      }
    } else {
      if (direction === 'reveleft') {
        this[`a${index}`].current.focus();
      } else if (direction === 'right') {
        this[`a${index + 2}`].current.focus();
      }
    }
  };

  updateOTP(value: any, index: number) {
    var otp = this.state.otp;
    otp[index] = value;
    this.setState({otp});
  }

  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginTop: 68,
        }}>
        {this.boxes.map((value, index) => (
          <OtpBox
            key={index}
            ref={this[`a${index + 1}`]}
            keyRef={index}
            update={this.updateOTP}
            move={this.moveTextInput}
          />
        ))}
      </View>
    )
  }

}