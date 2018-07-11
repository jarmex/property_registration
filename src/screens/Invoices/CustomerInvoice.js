import React, { Component } from 'react';
import { Text, View, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Query } from 'react-apollo';
import { Card, CardItem, Body } from 'native-base';
import moment from 'moment';
import styled from 'styled-components';
import { ErrorView, LoadingView } from '../../components';
import { QUERY_INVOICE_PER_CUSTOMER } from './graphql';
import { formatError } from '../../util';
import { Pages } from '..';

const SubTitle = styled.Text`
  font-weight: bold;
  font-size: 16;
`;
const SubDetails = styled.View`
  flex-direction: row;
`;
const SubDetailItem = styled.Text`
  flex: 1;
`;

class QueryInvoices extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Query Invoice',
    headerRight: (
      <View>
        {/* <Icon
          name="cart"
          style={{ color: 'white', marginRight: 13 }}
          onPress={navigation.naviate(Pages.PaymentPage)}
        /> */}
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate(Pages.PaymentPage)}
        >
          <View>
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
                marginRight: 13,
              }}
            >
              Pay
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    ),
  });
  state = {};
  render() {
    const { params } = this.props.navigation.state;
    return (
      <Query
        query={QUERY_INVOICE_PER_CUSTOMER}
        variables={{ customerId: params.id }}
      >
        {({ data, error, loading }) => {
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
          return (
            <View style={{ flex: 1 }}>
              <FlatList
                style={{ flex: 1 }}
                data={data.invoices}
                keyExtractor={({ id }) => `ID-${id}`}
                contentContainerStyle={{ padding: 5 }}
                renderItem={({ item }) => (
                  <Card>
                    <CardItem header>
                      <Text style={{ fontWeight: 'bold', color: 'black' }}>
                        {moment(item.createdAt).format('DD-MMMM-YYYY')}
                      </Text>
                    </CardItem>
                    <CardItem>
                      <Body>
                        <SubTitle>Description</SubTitle>
                        <Text>{item.description}</Text>
                        <SubTitle>Details</SubTitle>
                        <SubDetails>
                          <SubDetailItem>Amount</SubDetailItem>
                          <SubDetailItem>
                            {item.outstandingamount}
                          </SubDetailItem>
                        </SubDetails>
                        <SubDetails>
                          <SubDetailItem>Invoice Number</SubDetailItem>
                          <SubDetailItem>{item.invoiceno}</SubDetailItem>
                        </SubDetails>
                      </Body>
                    </CardItem>
                    <CardItem footer>
                      <SubDetails>
                        <Text
                          style={{
                            fontSize: 22,
                            fontWeight: 'bold',
                            flex: 1,
                            color: 'black',
                          }}
                        >
                          Total
                        </Text>
                        <Text
                          style={{
                            fontSize: 22,
                            fontWeight: 'bold',
                            textAlign: 'right',
                            flex: 1,
                            color: 'black',
                          }}
                        >
                          {item.outstandingamount}
                        </Text>
                      </SubDetails>
                    </CardItem>
                  </Card>
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
