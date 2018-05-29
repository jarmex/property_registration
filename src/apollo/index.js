import ApolloClient from 'apollo-boost';
import { AsyncStorage } from 'react-native';
import { StorageKey } from '../util';
import config from '../../config';

export const client = new ApolloClient({
  uri: config.development,
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
