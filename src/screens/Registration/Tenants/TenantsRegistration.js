import React, { Component } from 'react';
import { Alert } from 'react-native';
import {
  Text,
  ListItem,
  Item,
  Icon,
  Form,
  Input,
  Content,
  Container,
  Right,
  Label,
  Body,
  Picker,
} from 'native-base';
import { Mutation } from 'react-apollo';
import { Button } from '../../../components';
import { LocalData } from '../../../hoc';
import { NEW_TENANT } from './graphql';
import { formatError } from '../../../util';

class TenantsRegistration extends Component {
  static navigationOptions = {
    title: 'Operating License',
  };
  constructor(props) {
    super(props);
    this.state = {
      tenantType: 'Commercial',
      propertyid: undefined,
      taxexemption: 'No',
      rentcycle: '0',
      paymentcycle: '0',
      startdate: '',
      enddate: '',
    };
  }
  _tappedSelectProperty = () => {
    this.props.navigation.navigate('searchproperty');
  };
  _handleSubmit = async (createTenant, lstate, onStateChange) => {
    const { property, ...rest } = lstate;
    const { params } = this.props.navigation.state;

    if (!params) {
      return Alert.alert(
        'No Customer',
        'There was a problem with the customer details. Please go back and try again',
      );
    }
    if (!property) {
      return Alert.alert(
        'No Property',
        'There is no property selected. Try again',
      );
    }
    if (!this.state.tenantType) {
      return Alert.alert('No Tenant Type', 'Please select the Tenant Type');
    }
    if (!this.state.startdate) {
      return Alert.alert(
        'No Start Date',
        'The start date is not valid. Try again. The acceptable format is YYYY/MM/DD',
      );
    }
    try {
      // save the data to database
      const tenant = {
        customerid: params.id,
        propertyid: property.id,
        tenantType: this.state.tenantType,
        rentcycle: this.state.rentcycle,
        paymentcycle: this.state.paymentcycle,
        startdate: this.state.startdate,
        enddate: this.state.enddate,
        taxexemption: this.state.taxexemption === 'Yes',
      };
      await createTenant({
        variables: { tenant },
      });

      onStateChange(rest);
      Alert.alert(
        'Success',
        'The tenant details was added successfully',
        [
          {
            text: 'Go Back',
            onPress: () => {
              this.props.navigation.goBack();
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        { cancelable: false },
      );
    } catch (error) {
      Alert.alert('Error Occurred', formatError(error));
    }
  };
  render() {
    return (
      <Container>
        <LocalData>
          {({ lstate, onStateChange }) => {
            const { property } = lstate;
            const propname = { ...property };
            return (
              <Content>
                <ListItem onPress={this._tappedSelectProperty}>
                  <Body>
                    <Text>{propname.name || 'Select Property'}</Text>
                    <Text note>
                      {propname.electoralArea || 'No Property Selected'}
                    </Text>
                  </Body>
                  <Right>
                    <Icon name="arrow-forward" />
                  </Right>
                </ListItem>
                <Form style={{ paddingHorizontal: 10 }}>
                  <Item>
                    <Label>Tenant Type</Label>
                    <Picker
                      mode="dialog"
                      iosIcon={<Icon name="ios-arrow-down-outline" />}
                      placeholder="Select"
                      placeholderStyle={{ color: '#bfc6ea' }}
                      placeholderIconColor="#007aff"
                      style={{ width: undefined }}
                      selectedValue={this.state.tenantType}
                      onValueChange={(tenantType) =>
                        this.setState({ tenantType })
                      }
                    >
                      <Picker.Item label="Residential" value="Residential" />
                      <Picker.Item label="Commercial" value="Commercial" />
                    </Picker>
                  </Item>

                  <Item floatingLabel>
                    <Label>Start Date (yyyy/mm/dd)</Label>
                    <Input
                      value={this.state.startdate}
                      onChangeText={(startdate) => this.setState({ startdate })}
                    />
                  </Item>
                  <Item floatingLabel>
                    <Label>End Date (yyyy/mm/dd)</Label>
                    <Input
                      value={this.state.enddate}
                      onChangeText={(enddate) => this.setState({ enddate })}
                    />
                  </Item>
                </Form>
                <Mutation mutation={NEW_TENANT}>
                  {(createTenant) => (
                    <Button
                      onPress={() =>
                        this._handleSubmit(createTenant, lstate, onStateChange)
                      }
                    >
                      Submit
                    </Button>
                  )}
                </Mutation>
              </Content>
            );
          }}
        </LocalData>
      </Container>
    );
  }
}

export default TenantsRegistration;
