import React from 'react';

import { AsyncStorage } from 'react-native';
import { StorageKey } from '../util';

const { Provider, Consumer } = React.createContext();

export class LocalDataProvider extends React.Component {
  state = {
    data: {},
    registerdata: null,
    onClearProperty: async () =>
      this.clearSaveData(StorageKey.registerdata, 'registerdata'),
    onNewProperty: async (propertydata) =>
      this.saveLocalData(propertydata, StorageKey.registerdata, 'registerdata'),
    onSaveData: async (localData) =>
      this.saveLocalData(localData, StorageKey.data, 'data'),
  };

  async componentWillMount() {
    try {
      const localData = await AsyncStorage.getItem(StorageKey.data);
      if (localData !== null) {
        const data = JSON.parse(localData);
        this.setState({ data });
      }
      const registerdataEx = await AsyncStorage.getItem(
        StorageKey.registerdata,
      );
      if (registerdataEx !== null) {
        const registerdata = JSON.parse(registerdataEx);
        this.setState({ registerdata });
      }
    } catch (error) {
      // console.log(error)
    }
  }
  clearSaveData = (storKey, statename) =>
    new Promise(async (resolve, reject) => {
      try {
        await AsyncStorage.removeItem(storKey);
        this.setState({ [statename]: null });
        resolve('success');
      } catch (error) {
        reject(error);
      }
    });

  saveLocalData = (dataToSave, storekey, statename) =>
    new Promise(async (resolve, reject) => {
      try {
        await AsyncStorage.setItem(storekey, JSON.stringify(dataToSave));
        this.setState({ [statename]: dataToSave });
        resolve(dataToSave);
      } catch (error) {
        reject(error);
      }
    });

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}
export const LocalData = Consumer;
