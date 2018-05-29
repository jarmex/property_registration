import React, { Component } from 'react';
import { Text, Alert } from 'react-native';
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Picker,
  Icon,
} from 'native-base';
import { Mutation } from 'react-apollo';
import { Button, StatusBarEx } from '../../../components';
import { CreateCustomerGQL, QueryCustomersGQL } from './graphql';
import { UserConsumer, LocalData } from '../../../hoc';

class NewCustomerForm extends Component {
  static navigationOptions = {
    title: 'New Customer',
  };

  constructor(props) {
    super(props);
    this.initialState = {
      zoneId: undefined,
      name: '',
      code: '',
      longitude: 0,
      latitude: 0,
      primaryPhone: '',
      secondaryPhone: '',
      email: '',
      idnumber: '',
      tin: '',
      idtype: '',
      addressone: '',
      addresstwo: '',
    };
    this.state = {
      ...this.initialState,
    };
  }

  handleNewCustomer = async (ldata, createCustomer) => {
    // do the validation here

    if (!this.state.zoneId) {
      return Alert.alert('Invalid Zone', 'The zone is required');
    }
    if (!this.state.name) {
      return Alert.alert('Invalid Name', 'The name is required');
    }
    if (!this.state.primaryPhone) {
      return Alert.alert(
        'Invalid Primary Phone',
        'The primary phone is required',
      );
    }

    try {
      await createCustomer({
        variables: {
          customer: {
            ...this.state,
          },
        },
      });
      Alert.alert('Success', 'Record successfully added to the database.');
      // reset all base to the initial state
      this.setState({ ...this.initialState });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  updateCache = (cache, { data: { createCustomer } }) => {
    const data = cache.readQuery({
      query: QueryCustomersGQL,
      variables: { search: '' },
    });
    console.log(data); // eslint-disable-line
    data.getcustomers.push(createCustomer);
    // Write our data back to the cache.
    cache.writeQuery({
      query: QueryCustomersGQL,
      variables: { search: '' },
      data,
    });
  };
  render() {
    return (
      <Container>
        <StatusBarEx />
        <Content>
          <Form>
            <UserConsumer>
              {({ user }) => (
                <Item style={{ paddingTop: 10, paddingBottom: 10 }}>
                  <Label>Zone</Label>
                  <Picker
                    mode="dialog"
                    iosIcon={<Icon name="ios-arrow-down-outline" />}
                    placeholder="Select Zone"
                    placeholderStyle={{ color: '#bfc6ea' }}
                    placeholderIconColor="#007aff"
                    style={{ width: undefined }}
                    selectedValue={this.state.zoneId}
                    onValueChange={(zoneId) => this.setState({ zoneId })}
                  >
                    <Picker.Item label="Select Zone" value="" />
                    {user.zones &&
                      user.zones.map((zone) => (
                        <Picker.Item
                          key={zone.id}
                          label={zone.name}
                          value={zone.id}
                        />
                      ))}
                  </Picker>
                </Item>
              )}
            </UserConsumer>

            <Item floatingLabel>
              <Label>Full Name</Label>
              <Input
                value={this.state.name}
                onChangeText={(name) => this.setState({ name })}
              />
            </Item>
            <Item floatingLabel>
              <Label>Code</Label>
              <Input
                value={this.state.code}
                onChangeText={(code) => this.setState({ code })}
              />
            </Item>
            <Item floatingLabel>
              <Label>Primary Phone</Label>
              <Input
                value={this.state.primaryPhone}
                onChangeText={(primaryPhone) => this.setState({ primaryPhone })}
              />
            </Item>
            <Item floatingLabel>
              <Label>Secondary Phone</Label>
              <Input
                value={this.state.secondaryPhone}
                onChangeText={(secondaryPhone) =>
                  this.setState({ secondaryPhone })
                }
              />
            </Item>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input
                value={this.state.email}
                onChangeText={(email) => this.setState({ email })}
              />
            </Item>
            <Item floatingLabel>
              <Label>TIN</Label>
              <Input
                value={this.state.tin}
                onChangeText={(tin) => this.setState({ tin })}
              />
            </Item>
            <Item style={{ paddingTop: 10, paddingBottom: 10 }}>
              <Label>ID Type</Label>
              <Picker
                mode="dialog"
                iosIcon={<Icon name="ios-arrow-down-outline" />}
                placeholder="Select ID Type"
                placeholderStyle={{ color: '#bfc6ea' }}
                placeholderIconColor="#007aff"
                style={{ width: undefined }}
                selectedValue={this.state.idtype}
                onValueChange={(idtype) => this.setState({ idtype })}
              >
                <Picker.Item label="Select ID Type" value="" />
                <Picker.Item label="Voter's ID" value="Voters ID" />
                <Picker.Item label="Drivers License" value="Drivers License" />
                <Picker.Item label="Passport" value="Passport" />
                <Picker.Item label="National ID" value="National ID" />
              </Picker>
            </Item>
            <Item floatingLabel>
              <Label>ID Number</Label>
              <Input
                value={this.state.idnumber}
                onChangeText={(idnumber) => this.setState({ idnumber })}
              />
            </Item>

            <Item floatingLabel>
              <Label>Address 1</Label>
              <Input
                value={this.state.addressone}
                onChangeText={(addressone) => this.setState({ addressone })}
              />
            </Item>
            <Item floatingLabel>
              <Label>Address 2</Label>
              <Input
                value={this.state.addresstwo}
                onChangeText={(addresstwo) => this.setState({ addresstwo })}
              />
            </Item>
            <LocalData>
              {(ldata) => (
                <Mutation
                  mutation={CreateCustomerGQL}
                  update={this.updateCache}
                >
                  {(createCustomer) => (
                    <Button
                      onPress={() =>
                        this.handleNewCustomer(ldata, createCustomer)
                      }
                      style={{ marginTop: 15, marginBottom: 15 }}
                    >
                      <Text>Submit</Text>
                    </Button>
                  )}
                </Mutation>
              )}
            </LocalData>
          </Form>
        </Content>
      </Container>
    );
  }
}

export default NewCustomerForm;
