import { StyleSheet, Dimensions } from "react-native";


export const generalStyles = StyleSheet.create({
  absoluteBottom: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },

  rowBetween: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },

  contentCenter: {
    alignItems: 'center', justifyContent: 'center',
  },

  rowCenter: {
    flexDirection: 'row', alignItems: 'center',
  },

  horizontalCenter: {
    flexDirection: 'row', justifyContent: 'center'
  },

  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },

});

export const WIDTH_WINDOW = Dimensions.get('window').width
export const HEIGHT_WINDOW = Dimensions.get('window').height
export const WIDTH_SCREEN = Dimensions.get('screen').width
export const HEIGHT_SCREEN = Dimensions.get('screen').height