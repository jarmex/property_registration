import React, { Component } from 'react';
import { FlatList, Alert } from 'react-native';
import { menulist } from './menulist';
import { StatusBarEx, ContainerView } from '../../components';
import { LocalData, UserConsumer } from '../../hoc';
import { BrowseMenuItem, BannerMenuItem } from './MenuItem';
import { Title } from './styles';

class HomePage extends Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    loadedconfiguration: false,
  };
  getMenuItems = (savedata) => {
    if (savedata && savedata.electoralarea) {
      return menulist.filter((item) => item.key !== 'loadconfiguration');
    }
    return menulist;
  };

  handleMenuSelected = async (item, assembly, onClearData, onClearUser) => {
    if (item.key === 'loadconfiguration') {
      this.setState({ loadedconfiguration: true });
      this.props.navigation.navigate(item.page, {
        assembly,
      });
      return;
    }
    if (item.key === 'logout') {
      try {
        await onClearData();
        await onClearUser();
      } catch (error) {} // eslint-disable-line

      this.props.navigation.navigate('login');
      return;
    }
    if (!this.state.loadedconfiguration) {
      return Alert.alert(
        'No Configuration',
        'No configuration loaded to memory. Please load configuration before continuing....',
      );
    }
    if (item.page) {
      this.props.navigation.navigate(item.page);
    }
  };

  render() {
    return (
      <ContainerView flex={1}>
        <StatusBarEx />
        <Title>IRCM Platform</Title>
        <UserConsumer>
          {({ user, onClearUser }) => (
            <LocalData>
              {({ data, onClearData }) => {
                const menus = this.getMenuItems(data);
                const topmenu = menus[0];
                const restItems = menus.slice(1);
                return (
                  <ContainerView flex={1}>
                    <BannerMenuItem
                      data={topmenu}
                      onPress={() =>
                        this.handleMenuSelected(
                          topmenu,
                          user.assembly,
                          onClearData,
                          onClearUser,
                        )
                      }
                    />
                    <FlatList
                      data={restItems}
                      contentContainerStyle={{
                        flex: 1,
                      }}
                      renderItem={({ item, index }) => (
                        <BrowseMenuItem
                          data={item}
                          index={index % 2 === 0}
                          onPress={() =>
                            this.handleMenuSelected(
                              item,
                              user.assembly,
                              onClearData,
                              onClearUser,
                            )
                          }
                        />
                      )}
                      keyExtractor={({ key }) => key}
                      numColumns={2}
                      horizontal={false}
                    />
                  </ContainerView>
                );
              }}
            </LocalData>
          )}
        </UserConsumer>
      </ContainerView>
    );
  }
}

export default HomePage;
