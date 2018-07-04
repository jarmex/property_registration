import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { Text, Icon, ListItem, Body, Right } from 'native-base';
import { Query } from 'react-apollo';
import { QueryCustomersGQL } from './graphql';
import { formatError } from '../../../util';
import { FabEx, ErrorView, LoadingView, SearchBar } from '../../../components';

class CustomerRegistration extends Component {
  static navigationOptions = {
    title: 'Customer Registrations',
  };
  state = {
    search: '',
  };
  // onSearchUpdate = (search) => {
  //   this.setState({ search });
  // };
  onAddNewCustomerForm = () => {
    this.props.navigation.navigate('newcustomer');
  };
  onCustomerDetails = (owner) => {
    this.props.navigation.navigate('customerdetails', {
      ...owner,
    });
  };
  _handleSearch = (searchvalue) => {
    // console.log(searchvalue);
    this.setState({ search: searchvalue });
  };
  renderButton = () => (
    <FabEx
      position="bottomRight"
      active
      direction="up"
      onPress={this.onAddNewCustomerForm}
    >
      <Icon name="add" />
    </FabEx>
  );

  render() {
    return (
      <Query
        query={QueryCustomersGQL}
        variables={{ search: this.state.search }}
      >
        {({ data, loading, error, networkStatus }) => {
          if (networkStatus === 8) {
            return (
              <ErrorView message="No network connection. Contact System administrator if issue persist">
                {this.renderButton()}
              </ErrorView>
            );
          }
          if (networkStatus === 4) {
            return <Text>Refetching!</Text>;
          }
          if (loading) {
            return <LoadingView />;
          }
          if (error) {
            return (
              <ErrorView message={formatError(error)}>
                {this.renderButton()}
              </ErrorView>
            );
          }
          const { getcustomers } = data;
          return (
            <View style={{ flex: 1 }}>
              <FlatList
                data={getcustomers}
                renderItem={({ item }) => (
                  <ListItem onPress={() => this.onCustomerDetails(item)}>
                    <Body>
                      <Text>{item.name}</Text>
                      <Text note>
                        Tin: {item.tin}, ID: {item.idnumber}
                      </Text>
                    </Body>
                    <Right>
                      <Icon name="arrow-forward" />
                    </Right>
                  </ListItem>
                )}
                keyExtractor={({ id }) => `ID-${id}`}
                ListHeaderComponent={
                  <SearchBar
                    onSearchUpdate={(search) => this._handleSearch(search)}
                  />
                }
              />
              {this.renderButton()}
            </View>
          );
        }}
      </Query>
    );
  }
}

export default CustomerRegistration;
