import React, { Component } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Query } from 'react-apollo';
import { StatusBarEx } from '../../components';
import { QueryStaticDataQL } from './graphql';
import { LocalData } from '../../hoc';

class LoadInitialDataToMemory extends Component {
  static navigationOptions = {
    title: 'Saving Local Data...',
  };
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <StatusBarEx />
        <LocalData>
          {({ onSaveData }) => {
            const { params } = this.props.navigation.state;
            return (
              <Query
                query={QueryStaticDataQL}
                variables={{ assemblyid: params.assembly.id }}
              >
                {({ data, loading, error }) => {
                  if (loading) {
                    return (
                      <View>
                        <ActivityIndicator size="large" />
                        <Text>Loading initial Data.....</Text>
                      </View>
                    );
                  }
                  if (error) {
                    return (
                      <View>
                        <Text>{error.message}</Text>
                      </View>
                    );
                  }
                  // save data to memory
                  onSaveData(data);
                  return (
                    <View>
                      <Text>Save Completed Successfully</Text>
                    </View>
                  );
                }}
              </Query>
            );
          }}
        </LocalData>
      </View>
    );
  }
}

export default LoadInitialDataToMemory;
