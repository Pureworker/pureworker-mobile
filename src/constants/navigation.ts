import { NavigationProp, ParamListBase } from "@react-navigation/native";

export type StackNavigation = NavigationProp<ParamListBase>;

export type IOSMode = 'date' | 'time' | 'datetime' | 'countdown';
export type AndroidMode = 'date' | 'time';

export type Route = {
  key: string
  name: string
  params: {
    isActive: number | boolean
  }
}