import React from 'react';
import { Text } from 'react-native';
import { CenterView } from '../../components';

const PaymentTypes = () => (
  <CenterView>
    <Text>TODO: Payment Options - Cash|Mobile Money|Card Payments</Text>
  </CenterView>
);

PaymentTypes.navigationOptions = {
  title: 'Payment Options',
};

export default PaymentTypes;
