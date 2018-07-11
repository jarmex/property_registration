import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Query } from 'react-apollo';
import { ListItem, Body, Right } from 'native-base';
import { ErrorView, LoadingView } from '../../components';
import { QUERY_ALL_INVOICE } from './graphql';
import { formatError } from '../../util';
import { Pages } from '../index';

class QueryInvoices extends Component {
  static navigationOptions = {
    title: 'Query Invoice',
  };

  state = {};

  viewInvoiceDetails = (item) => {
    this.props.navigation.navigate(Pages.InvoiceDetails, {
      ...item,
    });
  };
  render() {
    return (
      <Query query={QUERY_ALL_INVOICE}>
        {({ data, loading, error, networkStatus }) => {
          if (networkStatus === 8) {
            return (
              <ErrorView message="No network connection. Contact System administrator if issue persist">
                {this.renderButton()}
              </ErrorView>
            );
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
          // console.log(data.allinvoices);
          return (
            <View style={{ flex: 1 }}>
              <FlatList
                data={data.allinvoices}
                keyExtractor={({ id }) => `ID-${id}`}
                renderItem={({ item }) => (
                  <ListItem onPress={() => this.viewInvoiceDetails(item)}>
                    <Body>
                      <Text>{item.name}</Text>
                    </Body>
                    <Right>
                      <Text>{item.amount}</Text>
                    </Right>
                  </ListItem>
                )}
              />
            </View>
          );
        }}
      </Query>
    );
  }
}

export default QueryInvoices;
