import React from 'react';
import { AsyncStorage } from 'react-native';
import { ThemeProvider } from 'styled-components';
import { ApolloProvider } from 'react-apollo';
import { client } from './src/apollo';
import { createRootNavigator } from './src/routes/appRoutes';
import theme from './src/theme';
import { UserProvider, LocalDataProvider } from './src/hoc';
import { StorageKey } from './src/util';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screenTodisplay: null,
    };
    this._bootstrapAsync().done();
  }
  _bootstrapAsync = async () => {
    try {
      const userstr = await AsyncStorage.getItem(StorageKey.user);
      const user = JSON.parse(userstr);
      if (user.token) {
        this.setState({ screenTodisplay: 'homestack' }); // present the OTP for further authentication before login
      } else {
        this.setState({ screenTodisplay: 'login' }); // show login screen
      }
    } catch (error) {
      this.setState({ screenTodisplay: 'login' }); // error occured. Show login screend
    }
  };
  render() {
    if (this.state.screenTodisplay === null) return null;
    const Layout = createRootNavigator(this.state.screenTodisplay);
    return (
      <ApolloProvider client={client}>
        <UserProvider>
          <ThemeProvider theme={theme}>
            <LocalDataProvider>
              <Layout />
            </LocalDataProvider>
          </ThemeProvider>
        </UserProvider>
      </ApolloProvider>
    );
  }
}
