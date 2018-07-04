import React, { Component } from 'react';
import { Text, ActivityIndicator } from 'react-native';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import { CenterView, ContainerView, Button } from '../../../components';
import { CUSTOMER_QL } from './graphql';

const Title = styled.Text`
  font-size: 22;
  font-weight: bold;
  padding-bottom: 30;
  padding-top: 40;
  text-align: center;
`;
const PairOuterView = styled.View`
  align-self: stretch;
  flex-direction: row;
  margin-bottom: 10;
`;
const NameText = styled.Text`
  flex: 1;
  padding-right: 10;
  text-align: right;
  font-weight: 500;
`;
const ValueText = styled.Text`
  flex: 3;
`;

const ActionText = styled.Text`
  text-align: center;
  padding-top: 40;
  font-style: italic;
  text-decoration: underline;
`;
const CustomerPairView = ({ name, value }) => (
  <PairOuterView>
    <NameText>{name}:</NameText>
    <ValueText>{value}</ValueText>
  </PairOuterView>
);
class CustomerDetails extends Component {
  // const { params } = this.props.navigation.state;
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: params.name || 'Customer Details',
    };
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  _tappedNavigatePages = (owner, pageid) => {
    this.props.navigation.navigate(pageid, {
      ...owner,
    });
  };

  render() {
    return (
      <Query
        query={CUSTOMER_QL}
        variables={{ id: this.props.navigation.state.params.id }}
      >
        {({ loading, error, data }) => {
          if (loading) {
            return (
              <CenterView>
                <ActivityIndicator animating size="large" />
              </CenterView>
            );
          }
          if (error) {
            return (
              <CenterView>
                <Text>{error.message}</Text>
              </CenterView>
            );
          }
          return (
            <ContainerView flex={1} style={{ paddingHorizontal: 10 }}>
              <Title>Details</Title>
              <CustomerPairView name="Name" value={data.customer.name} />
              <CustomerPairView
                name="Customer Code"
                value={data.customer.code}
              />
              <CustomerPairView
                name="Phone Number"
                value={data.customer.primaryPhone}
              />
              <CustomerPairView
                name="Registered On"
                value={data.customer.createdAt}
              />

              <ActionText>Select an actions below</ActionText>
              <Button
                onPress={() =>
                  this._tappedNavigatePages(data.customer, 'tregistration')
                }
              >
                Operating Licence
              </Button>
              <Button
                onPress={() =>
                  this._tappedNavigatePages(data.customer, 'pregistration')
                }
              >
                Building Properties
              </Button>
              {/* <Button
                onPress={() =>
                  this._tappedNavigatePages(data.customer, 'pregistration')
                }
              >
                Land Properties
              </Button> */}
            </ContainerView>
          );
        }}
      </Query>
    );
  }
}

export default CustomerDetails;
