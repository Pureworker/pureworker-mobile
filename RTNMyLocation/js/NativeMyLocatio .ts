import {TurboModule, TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  //   add(a: number, b: number): Promise<number>;
  getLocation(): void;
}

export default TurboModuleRegistry.get<Spec>('RTNMyLocation') as Spec | null;
