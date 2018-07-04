import ApolloClient from 'apollo-boost';
import { AsyncStorage } from 'react-native';
import { StorageKey } from '../util';
import config from '../../config';

const getAppUri = () => {
  // eslint-disable-next-line
  if (__DEV__) {
    return config.development;
  }
  return config.production;
};

export const client = new ApolloClient({
  uri: getAppUri(),
  request: async (operation) => {
    const login = await AsyncStorage.getItem(StorageKey.user);
    let token = '';
    if (login) {
      const loginObj = JSON.parse(login);
      token = loginObj.token;
    }
    operation.setContext({
      headers: {
        authorization: token,
      },
    });
  },
});
