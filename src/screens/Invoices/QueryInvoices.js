import React, { Component } from 'react';
import { Text } from 'react-native';
import { CenterView } from '../../components';

class QueryInvoices extends Component {
  static navigationOptions = {
    title: 'Query Invoice',
  };
  state = {};
  render() {
    return (
      <CenterView>
        <Text>TODO: Query QueryInvoices</Text>
      </CenterView>
    );
  }
}

export default QueryInvoices;
