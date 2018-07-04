import React from 'react';
import { Query } from 'react-apollo';
import { View, FlatList } from 'react-native';
import { Text, Icon, ListItem, Body, Right } from 'native-base';
import { SEARCH_PROPERTY } from './graphql';
import { formatError } from '../../util';
import { LocalData } from '../../hoc';
import { ErrorView, LoadingView, SearchBar } from '../../components';

class SearchProperty extends React.Component {
  static navigationOptions = {
    title: 'Search Property',
  };
  state = {
    search: '',
  };
  onCustomerDetails = (item, lstate, onStateChange) => {
    const newState = Object.assign(lstate, { property: item });
    onStateChange(newState);
    this.props.navigation.goBack();
  };
  _handleSearch = (searchvalue) => {
    this.setState({ search: searchvalue });
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <LocalData>
          {({ lstate, onStateChange }) => (
            <Query
              query={SEARCH_PROPERTY}
              variables={{ name: this.state.search }}
            >
              {({ data, loading, error, networkStatus }) => {
                if (networkStatus === 4) return <Text>Refetching!</Text>;
                if (loading) {
                  return <LoadingView />;
                }
                if (error) {
                  return <ErrorView message={formatError(error)} />;
                }
                const { searchproperty } = data;

                return (
                  <View style={{ flex: 1 }}>
                    <SearchBar
                      onSearchUpdate={(search) => this._handleSearch(search)}
                    />
                    <FlatList
                      data={searchproperty}
                      renderItem={({ item }) => (
                        <ListItem
                          onPress={() =>
                            this.onCustomerDetails(item, lstate, onStateChange)
                          }
                        >
                          <Body>
                            <Text>{item.name}</Text>
                            <Text note>
                              Tin: {item.tin}, ID: {item.idnumber}
                            </Text>
                          </Body>
                          <Right>
                            <Icon name="arrow-forward" />
                          </Right>
                        </ListItem>
                      )}
                      keyExtractor={({ id }) => `ID-${id}`}
                    />
                  </View>
                );
              }}
            </Query>
          )}
        </LocalData>
      </View>
    );
  }
}

export default SearchProperty;
