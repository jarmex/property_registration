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
import { futch } from './util';
import config from '../../../../config';

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
      progress: 0,
    };
    this.assemblyid = undefined;
  }

  handleNewCustomer = async (mutate, localdata) => {
    const { registerdata, onNewProperty, onClearProperty } = localdata;
    const { params } = this.props.navigation.state;
    console.log('REGISTERDATA', registerdata);
    // save the information to database
    const { progress, ...rest } = this.state;
    const newproperty = Object.assign({}, rest, {
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
      const result = await mutate({
        variables: {
          building: { ...newproperty },
        },
      });
      // TODO:

      // dataToSend.append
      // get the property ID and upload the information to the memory for future upload if the online upload fails
      // get the data from the memory where id matches
      if (registerdata !== null || registerdata.length > 0) {
        const propertyid = result.data.createProperty.id;
        // update the memory data if saving to remote server fails
        const savedata = registerdata.filter(
          (sdata) => sdata.ownerid === newproperty.ownerid,
        );
        const newdata = savedata.map((updata) =>
          Object.assign({}, updata, { propertyid }),
        );
        // save to applicaton database. if the save is successfully remove the item from memory
        // if not successful update memory with the propertyid

        if (newdata !== null && newdata.length > 0) {
          // use only the first data to save to database
          const datatoSave = newdata[0];
          console.log(datatoSave);
          const dataToSend = new FormData();
          dataToSend.append('name', datatoSave.name);
          dataToSend.append('ownerid', datatoSave.ownerid);
          dataToSend.append('propertyid', datatoSave.propertyid);
          dataToSend.append('type', datatoSave.type);
          datatoSave.data.forEach((photo, index) => {
            dataToSend.append('longitude', photo.coords.longitude);
            dataToSend.append('latitude', photo.coords.latitude);
            dataToSend.append('photos', {
              uri: photo.orginalUrl,
              type: 'image/jpeg',
              name: `photos-${index}`,
            });
          });
          console.log(dataToSend);
          try {
            const res = await futch(
              config.updatePhotosURL,
              {
                method: 'post',
                body: dataToSend,
              },
              (e) => {
                const progressIndicator = e.loaded / e.total;
                console.log(progressIndicator, progress);
                this.setState({
                  progress: progressIndicator,
                });
              },
            );
            console.log(res);
            // update the existing data
            const mydata = registerdata.filter(
              (dremove) => dremove.ownerid !== newproperty.ownerid,
            );
            if (mydata === null || mydata.length === 0) {
              await onClearProperty();
            } else {
              await onNewProperty(mydata);
            }
          } catch (errors) {
            console.log(errors);
          }
        }
      }

      Alert.alert('Success', 'Property successfully registered');
    } catch (error) {
      Alert.alert('Error', formatError(error));
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
                  {({ data, ...localdata }) => (
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
                              this.handleNewCustomer(mutate, localdata)
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
