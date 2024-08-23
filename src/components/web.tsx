import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {WebView, WebViewNavigation} from 'react-native-webview';
import Modal from 'react-native-modal/dist/modal';
import tw from 'twrnc';
import { SIZES } from '../utils/position/sizes';

const PaystackWebView = ({
  visible,
  onClose,
  paymentLink,
  paystackKey,
  billingEmail,
  firstName,
  lastName,
  phone,
  billingName,
  amount,
  userID,
  assetID,
  onSuccess,
}: any) => {
  if (!visible) {
    return null;
  }
  console.log(visible);
  const handleMessage = event => {
    console.log(event);

    // Check if the received message is the cancel event from the WebView
    if (event.nativeEvent.data === 'cancel') {
      // Close the modal
      onClose();
    }
  };

  const messageReceived = (data: string) => {
    const webResponse = JSON.parse(data);
    // if (handleWebViewMessage) {
    //   handleWebViewMessage(data);
    // }
    switch (webResponse.event) {
      case 'cancelled':
        onClose();
        // onCancel({status: 'cancelled'});
        break;

      case 'successful':
        onClose();
        const reference = webResponse.transactionRef;

        if (onSuccess) {
          onSuccess({
            status: 'success',
            transactionRef: reference,
            data: webResponse,
          });
          console.log({
            status: 'success',
            transactionRef: reference,
            data: webResponse,
          });
        }
        break;

      default:
        // if (handleWebViewMessage) {
        //   handleWebViewMessage(data);
        // }
        break;
    }
  };

  const CLOSE_URL = 'https://standard.paystack.co/close';
  const onNavigationStateChange = (state: WebViewNavigation) => {
    const {url} = state;
    if (url === CLOSE_URL) {
      onClose();
    }
  };

  const Paystackcontent = `   
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Paystack</title>
    </head>
      <body  onload="payWithPaystack()" style="background-color:#fff;height:100vh">
        <script src="https://js.paystack.co/v1/inline.js"></script>
        <script type="text/javascript">
          window.onload = payWithPaystack;
          function payWithPaystack(){
          var handler = PaystackPop.setup({ 
            key: '${paystackKey}',
            email: '${billingEmail}',
            firstname: '${firstName}',
            lastname: '${lastName}',
            phone: '${phone}',
            amount: ${amount}, 

            metadata: {
            asset: '${assetID}',
            user: '${userID}',
            custom_fields: [
                    {
                    display_name:  '${firstName + ' ' + lastName}',
                    variable_name:  '${billingName}',
                    value:'',
                    asset: '${assetID}',
                    user: '${userID}'
                    }
            ]},
            callback: function(response){
                  var resp = {event:'successful', transactionRef:response};
                    window.ReactNativeWebView.postMessage(JSON.stringify(resp))
            },
            onClose: function(){
                var resp = {event:'cancelled'};
                window.ReactNativeWebView.postMessage(JSON.stringify(resp))
            }
            });
            handler.openIframe();
            }
        </script> 
      </body>
  </html> 
  `;

  return (
    <Modal
      isVisible={visible}
      onBackButtonPress={() => onClose()}
      onBackdropPress={() => onClose()}
      swipeThreshold={200}
      style={{
        width: SIZES.width,
        padding: 0,
        margin: 0,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onSwipeComplete={() => onClose()}>
      <View
        style={[
          {
            width: SIZES.width,
            height: SIZES.height * 0.875,
            // backgroundColor: 'blue',
          },
          tw`mt-auto`,
        ]}>
        <View style={styles.webviewContainer}>
          <WebView
            // source={{uri: paymentLink}}
            source={{html: Paystackcontent}}
            originWhitelist={['*']}
            style={styles.webview}
            messagingEnabled={true} // Enable messaging
            javaScriptEnabled={true}
            // onMessage={handleMessage} // Handle received messages
            onMessage={e => {
              console.log(e.nativeEvent);
              messageReceived(e.nativeEvent?.data);
            }}
            // onLoadStart={() => setisLoading(true)}
            // onLoadEnd={() => setisLoading(false)}
            onNavigationStateChange={onNavigationStateChange}
          />
          {/* <View style={{width: 340, height: 500, backgroundColor: 'red'}} /> */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
  },
  webviewContainer: {
    width: '100%', // Adjust the width as needed
    height: '100%', // Adjust the height as needed
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    // backgroundColor: 'red',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
  },
});

export default PaystackWebView;
