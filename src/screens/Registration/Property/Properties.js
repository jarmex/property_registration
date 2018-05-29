import React, { Component } from 'react';
import { FlatList, ActivityIndicator, View, Alert } from 'react-native';
import { ListItem, Text, Body, Right, Icon, Button } from 'native-base';
import { Query } from 'react-apollo';
import { QueryPropertiesGQL } from './graphql';
import { formatError } from '../../../util';
import { FabEx } from '../../../components';

class PropertyOwner extends Component {
  state = {
    active: false,
  };
  onViewProperty = () => {
    // show the details of the property for editing
  };
  addNewProperty = () => {
    const { params } = this.props.navigation.state;
    this.props.navigation.navigate('takepicture', {
      id: params.id,
      name: params.name,
    });
  };

  addTenantInfo = () => {
    Alert.alert(
      'Implementation????',
      'This is not completed yet. Check back later',
    );
  };
  render() {
    const { params } = this.props.navigation.state;
    return (
      <Query query={QueryPropertiesGQL} variables={{ id: params.id }}>
        {({ data: { propertiesbyowner }, loading, error }) => {
          if (loading) {
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ActivityIndicator size="large" />
              </View>
            );
          }
          if (error) {
            return (
              <View>
                <Text>{formatError(error)}</Text>
              </View>
            );
          }
          return (
            <View style={{ flex: 1 }}>
              <FlatList
                data={propertiesbyowner}
                renderItem={({ item }) => (
                  <ListItem onPress={() => this.onViewProperty(item)}>
                    <Body>
                      <Text>{item.name}</Text>
                      <Text note>{item.assembly}</Text>
                      <Text note>{item.structureType}</Text>
                    </Body>
                    <Right>
                      <Icon name="arrow-forward" />
                    </Right>
                  </ListItem>
                )}
                keyExtractor={({ id }) => id}
              />
              <FabEx
                position="bottomRight"
                active={this.state.active}
                direction="up"
                // onPress={this.addNewProperty}
                onPress={() => this.setState({ active: !this.state.active })}
              >
                <Icon name="add" />
                <Button
                  style={{ backgroundColor: '#DD5144' }}
                  onPress={this.addNewProperty}
                >
                  <Icon name="home" />
                </Button>
                <Button
                  style={{ backgroundColor: '#34A34F' }}
                  onPress={this.addTenantInfo}
                >
                  <Icon name="briefcase" />
                </Button>
              </FabEx>
            </View>
          );
        }}
      </Query>
    );
  }
}
PropertyOwner.navigationOptions = ({ navigation }) => {
  const { params } = navigation.state;
  return {
    title: `${params.name}'s Properties` || 'Registered Properties',
  };
};

export default PropertyOwner;
