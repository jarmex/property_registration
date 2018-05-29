import React, { Component } from 'react';
import { Icon, Input, Item, Button, Text } from 'native-base';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const View = styled.View`
  height: 50;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
`;

class SearchCustomerBar extends Component {
  static propTypes = {
    onSearchUpdate: PropTypes.func.isRequired,
  };
  state = { search: '' };
  onButtonPress = () => {
    this.props.onSearchUpdate(this.state.search);
  };
  render() {
    return (
      <View>
        <Item style={{ flex: 3 }}>
          <Icon name="search" />
          <Input
            value={this.state.search}
            placeholder="Search"
            onChangeText={(search) => this.setState({ search })}
          />
        </Item>
        <Button transparent style={{ flex: 1 }}>
          <Text>Search</Text>
        </Button>
      </View>
    );
  }
}

export default SearchCustomerBar;
