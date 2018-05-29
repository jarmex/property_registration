import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { menulist } from './menulist';
import { StatusBarEx } from '../../components';
import { LocalData, UserConsumer } from '../../hoc';
import { BrowseMenuItem } from './MenuItem';
import { OuterView, Title } from './styles';

class HomePage extends Component {
  static navigationOptions = {
    header: null,
  };
  getMenuItems = (savedata) => {
    if (savedata.electoralarea) {
      return menulist;
    }
    return [
      ...menulist,
      {
        label: 'Load Configurations',
        desc: `Last update: ${savedata.lastupdated}`,
        page: 'loadconfiguration',
        key: 'loadconfiguration',
      },
    ];
  };

  handleMenuSelected = (item, assembly) => {
    if (item.key === 'loadconfiguration') {
      this.props.navigation.navigate(item.page, {
        assembly,
      });
      return;
    }
    if (item.page) {
      this.props.navigation.navigate(item.page);
    }
  };

  render() {
    return (
      <OuterView>
        <StatusBarEx />
        <Title>Property Registration</Title>
        <UserConsumer>
          {({ user }) => (
            <LocalData>
              {({ data }) => {
                const menus = this.getMenuItems(data);
                return (
                  <FlatList
                    data={menus}
                    renderItem={({ item }) => (
                      <BrowseMenuItem
                        label={item.label}
                        desc={item.desc}
                        onPress={() =>
                          this.handleMenuSelected(item, user.assembly)
                        }
                      />
                    )}
                    keyExtractor={({ key }) => key}
                  />
                );
              }}
            </LocalData>
          )}
        </UserConsumer>
      </OuterView>
    );
  }
}

export default HomePage;
