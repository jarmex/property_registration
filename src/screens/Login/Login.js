/* eslint import/no-unresolved: */

import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Container, Form, Item, Input, Icon, Text } from 'native-base';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Button } from '@components';
import { formatError } from '@util';
import { UserConsumer } from '../../hoc';

const LoginGQL = gql`
  mutation loginUser($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      assembly {
        id
        name
        district
      }
      zones {
        id
        name
        city
        polygonecoords
        code
      }
    }
  }
`;

class LoginScreen extends Component {
  state = { username: '', password: '' };

  handleLoginRequest = async (onChangeUser) => {
    if (!this.state.username) {
      return Alert.alert('Invalid Username', 'The Username is required');
    }
    if (!this.state.password) {
      return Alert.alert('Invalid Password', 'The password is required');
    }
    try {
      const response = await this.props.mutate({
        variables: {
          username: this.state.username,
          password: this.state.password,
        },
      });
      // const login = JSON.stringify(response.data.login);
      // await AsyncStorage.setItem('login', login);
      onChangeUser(response.data.login); // from the customer context
      setTimeout(() => {
        this.props.navigation.navigate('homestack');
      }, 10);
    } catch (err) {
      Alert.alert('Error Occurred', formatError(err));
    }
  };
  render() {
    return (
      <Container
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Form style={{ padding: 15, alignSelf: 'stretch' }}>
          <Item>
            <Icon name="person" active />
            <Input
              placeholder="Username"
              value={this.state.username}
              onChangeText={(username) => this.setState({ username })}
            />
          </Item>
          <Item style={{ marginTop: 15, marginBottom: 15 }}>
            <Icon name="lock" active />
            <Input
              placeholder="Password"
              secureTextEntry
              value={this.state.password}
              onChangeText={(password) => this.setState({ password })}
            />
          </Item>
          <UserConsumer>
            {({ onChangeUser }) => (
              <Button onPress={() => this.handleLoginRequest(onChangeUser)}>
                <Text>Login</Text>
              </Button>
            )}
          </UserConsumer>
        </Form>
      </Container>
    );
  }
}

export default graphql(LoginGQL)(LoginScreen);
