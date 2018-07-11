import React, { Component } from 'react';
import { Text, Alert } from 'react-native';
import { Mutation } from 'react-apollo';
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

import { Button, StatusBarEx } from '../../../components';
import { formatError } from '../../../util';
import { UserConsumer, LocalData } from '../../../hoc';
import { CreatePropertyQL } from './graphql';
import config from '../../../../config';
import { futch } from './util';

class NewProperty extends Component {
  static navigationOptions = {
    title: 'New Property',
  };
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      structuretypeid: undefined,
      housenumber: '',
      streetname: '',
      lvbnumber: '',
      description: '',
      area: '',
      billingaddress: '',
      createdby: 1,
      digitaladdress: '',
      electoralareaid: undefined,
    };
    this.assemblyid = undefined;
  }

  handleNewCustomer = async (mutate, localstate, user) => {
    const { params } = this.props.navigation.state;
    const newproperty = Object.assign({}, this.state, {
      ownerid: params.id,
      assemblyid: this.assemblyid,
    });
    if (!newproperty.name) {
      return Alert.alert('Invalid Field', 'The Property Name is required');
    }
    if (!newproperty.assemblyid) {
      return Alert.alert(
        'Unknow Assembly',
        'The system is not able to determine the assembly assigned to you. Please logout and login again.',
      );
    }
    if (!newproperty.electoralareaid) {
      return Alert.alert('Electora Area', 'The Electora Area is required');
    }
    if (!newproperty.structuretypeid) {
      Alert.alert('Structure Type', 'Select Structure type from the list');
      return;
    }
    if (!newproperty.streetname) {
      return Alert.alert(
        'Street Name required',
        'The street name cannot be empty',
      );
    }
    if (!newproperty.electoralareaid) {
      return Alert.alert(
        'Select Electoral Area',
        'The Electoral Area is required',
      );
    }

    try {
      let result = null;
      const { lstate, registerdata, onStateChange, onNewProperty } = localstate;
      try {
        result = await mutate({
          variables: {
            building: { ...newproperty },
          },
        });
      } catch (error) {
        // save to device memory
        const { property, ...others } = lstate;
        const modifyPropertyToAddImages = Object.assign({}, newproperty, {
          images: property,
          type: 'property',
        });
        // save others back to memory
        onStateChange(others);
        // save to device disk
        const datatosave = [...registerdata, modifyPropertyToAddImages];
        await onNewProperty(datatosave);
        // alert the user of failed to save data to remote server
        Alert.alert(
          'Unsave Data',
          `Unable to save data to remote server. The data is save locally on the device. 
            Use Re-Send data to push the data to server`,
        );
        return;
      }
      // upload images here
      this._uploadimages(result, localstate, user);

      Alert.alert(
        'Success',
        'Property successfully registered.',
        [
          {
            text: 'Home',
            onPress: () => {
              this.props.navigation.popToTop();
            },
          },
        ],
        { cancelable: false },
      );
    } catch (error) {
      Alert.alert('Error', formatError(error));
    }
  };

  _uploadimages = async (result, localstate, user) => {
    if (result === null) return;
    const { lstate, registerdata, onNewProperty, onStateChange } = localstate;
    const { property, ...rest } = lstate;

    const dataToSend = new FormData();
    dataToSend.append('name', this.state.name);
    dataToSend.append('ownerid', property.ownerid);
    dataToSend.append('propertyid', result.data.createProperty.id);
    dataToSend.append('longitude', property.longitude);
    dataToSend.append('latitude', property.latitude);
    dataToSend.append('accuracy', property.accuracy);
    dataToSend.append('createdby', user.id);
    property.imagepath.forEach((item) => {
      // get the file name here
      const filename = item.split('/').pop();
      dataToSend.append('photos', {
        uri: item,
        type: 'image/jpg',
        name: filename,
      });
    });
    // console.log(dataToSend);
    try {
      await futch(config.updatePhotosURL, {
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'multipart/form-data',
        },
        method: 'POST',
        body: dataToSend,
      });
      // console.log(res);
      onStateChange(rest);
    } catch (error) {
      // console.log(error);
      // save to disk and clear the memory for this property data
      const sTodisk = Object.assign({}, property, {
        propertyid: result.data.createProperty.id,
        propertyname: this.state.name,
        createdby: user.id,
      });
      const datatosave = [...registerdata, sTodisk];
      await onNewProperty(datatosave);
      onStateChange(rest);
      throw error;
    }
  };

  render() {
    const { params } = this.props.navigation.state;
    return (
      <Container>
        <StatusBarEx />
        <Content>
          <UserConsumer>
            {({ user }) => {
              this.assemblyid = user.assembly.id;
              return (
                <LocalData>
                  {({ data, ...rest }) => (
                    <Form>
                      <Item floatingLabel>
                        <Label>Property Name</Label>
                        <Input
                          value={this.state.name}
                          onChangeText={(name) => this.setState({ name })}
                        />
                      </Item>

                      <Item floatingLabel>
                        <Label>Owner Name</Label>
                        <Input value={params.name} disabled />
                      </Item>

                      <Item floatingLabel>
                        <Label>Assembly</Label>
                        <Input value={user.assembly.name} disabled />
                      </Item>

                      <Item style={{ paddingTop: 10, paddingBottom: 10 }}>
                        <Label>Electora Area</Label>
                        <Picker
                          mode="dialog"
                          iosIcon={<Icon name="ios-arrow-down-outline" />}
                          placeholder="Select"
                          placeholderStyle={{ color: '#bfc6ea' }}
                          placeholderIconColor="#007aff"
                          style={{ width: undefined }}
                          selectedValue={this.state.electoralareaid}
                          onValueChange={(electoralareaid) =>
                            this.setState({ electoralareaid })
                          }
                        >
                          <Picker.Item label="Select ...." value="" />
                          {data.electoralarea &&
                            data.electoralarea.map((earea) => (
                              <Picker.Item
                                label={earea.name}
                                key={earea.id}
                                value={earea.id}
                              />
                            ))}
                        </Picker>
                      </Item>
                      <Item style={{ paddingTop: 10, paddingBottom: 10 }}>
                        <Label>Structure Type</Label>
                        <Picker
                          mode="dialog"
                          iosIcon={<Icon name="ios-arrow-down-outline" />}
                          placeholder="Structure ID"
                          placeholderStyle={{ color: '#bfc6ea' }}
                          placeholderIconColor="#007aff"
                          style={{ width: undefined }}
                          selectedValue={this.state.structuretypeid}
                          onValueChange={(structuretypeid) =>
                            this.setState({ structuretypeid })
                          }
                        >
                          <Picker.Item label="Select ...." value="" />
                          {data.structuretype.map((stype) => (
                            <Picker.Item
                              label={stype.name}
                              key={stype.id}
                              value={stype.id}
                            />
                          ))}
                        </Picker>
                      </Item>
                      <Item floatingLabel>
                        <Label>House Number</Label>
                        <Input
                          value={this.state.housenumber}
                          onChangeText={(housenumber) =>
                            this.setState({ housenumber })
                          }
                        />
                      </Item>
                      <Item floatingLabel>
                        <Label>LVB Number</Label>
                        <Input
                          value={this.state.lvbnumber}
                          onChangeText={(lvbnumber) =>
                            this.setState({ lvbnumber })
                          }
                        />
                      </Item>
                      <Item floatingLabel>
                        <Label>Street Name</Label>
                        <Input
                          value={this.state.streetname}
                          onChangeText={(streetname) =>
                            this.setState({ streetname })
                          }
                        />
                      </Item>
                      <Item floatingLabel>
                        <Label>Area</Label>
                        <Input
                          value={this.state.area}
                          onChangeText={(area) => this.setState({ area })}
                        />
                      </Item>

                      <Item floatingLabel>
                        <Label>Description</Label>
                        <Input
                          value={this.state.description}
                          onChangeText={(description) =>
                            this.setState({ description })
                          }
                        />
                      </Item>
                      <Item floatingLabel>
                        <Label>Billing Address</Label>
                        <Input
                          value={this.state.billingaddress}
                          onChangeText={(billingaddress) =>
                            this.setState({ billingaddress })
                          }
                        />
                      </Item>

                      <Item floatingLabel>
                        <Label>GH Post Address</Label>
                        <Input
                          value={this.state.digitaladdress}
                          onChangeText={(digitaladdress) =>
                            this.setState({ digitaladdress })
                          }
                        />
                      </Item>
                      <Mutation mutation={CreatePropertyQL}>
                        {(mutate) => (
                          <Button
                            onPress={() =>
                              this.handleNewCustomer(mutate, rest, user)
                            }
                            style={{ marginTop: 15, marginBottom: 15 }}
                          >
                            <Text>Submit</Text>
                          </Button>
                        )}
                      </Mutation>
                    </Form>
                  )}
                </LocalData>
              );
            }}
          </UserConsumer>
        </Content>
      </Container>
    );
  }
}

export default NewProperty;
