/* eslint import/no-unresolved: */

import React, { Component } from 'react';
import { Alert, KeyboardAvoidingView } from 'react-native';
import { Form, Item, Input, Icon, Text } from 'native-base';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Button } from '@components';
import { formatError } from '../../util';
import { UserConsumer } from '../../hoc';
import { ContainerView } from '../../components';

const Title = styled.Text`
  font-size: 30;
  font-weight: bold;
  padding-top: 50;
  text-align: center;
  padding-bottom: 50;
  color: #243145;
`;
const LOGIN_QL = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      firstname
      lastname
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

  handleLoginRequest = async (login, onChangeUser) => {
    if (!this.state.username) {
      return Alert.alert('Invalid Username', 'The Username is required');
    }
    if (!this.state.password) {
      return Alert.alert('Invalid Password', 'The password is required');
    }
    try {
      const response = await login({
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
      <ContainerView>
        <Title>IRCM Platform</Title>
        <KeyboardAvoidingView behavior="padding">
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
            <Mutation mutation={LOGIN_QL}>
              {(login) => (
                <UserConsumer>
                  {({ onChangeUser }) => (
                    <Button
                      onPress={() =>
                        this.handleLoginRequest(login, onChangeUser)
                      }
                    >
                      <Text>Login</Text>
                    </Button>
                  )}
                </UserConsumer>
              )}
            </Mutation>
          </Form>
        </KeyboardAvoidingView>
      </ContainerView>
    );
  }
}

// Integrated Revenue Collection and Management Platform IRCM Platform
export default LoginScreen;
