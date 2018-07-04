import React from 'react';

import { AsyncStorage } from 'react-native';
import { StorageKey } from '../util';

const { Provider, Consumer } = React.createContext();

export class UserProvider extends React.Component {
  state = {
    user: null,
    onChangeUser: async (user) =>
      new Promise(async (resolve, reject) => {
        try {
          await AsyncStorage.setItem(StorageKey.user, JSON.stringify(user));
          this.setState({ user });
          resolve(user);
        } catch (error) {
          reject(error);
        }
      }),
    onClearUser: async () =>
      new Promise(async (resolve, reject) => {
        try {
          await AsyncStorage.removeItem(StorageKey.user);
          this.setState({ user: null });
          resolve('success');
        } catch (error) {
          reject(error);
        }
      }),
  };

  async componentWillMount() {
    try {
      const userstr = await AsyncStorage.getItem(StorageKey.user);
      if (userstr) {
        const user = JSON.parse(userstr);

        this.setState({ user });
      }
    } catch (error) {
      // console.log(error)
    }
  }

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}
export const UserConsumer = Consumer;
export const UserProps = Consumer;
// export const withUser = (Component) => (props) => (
//   <Consumer>
//     {(values) => {
//       const allprops = Object.assign({}, props, values);
//       return <Component {...allprops} />;
//     }}
//   </Consumer>
// );
