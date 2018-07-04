import React, { Component } from 'react';
import { Text } from 'react-native';
import { LocalData } from '../../../hoc';
import { Button, CenterView } from '../../../components';
import config from '../../../../config';
import { futch } from './util';

class ResendData extends Component {
  static navigationOptions = {
    title: 'Resend Data',
  };
  state = {
    loading: false,
    message: '',
  };
  _handleLoadToSever = (ldata) => {
    const { registerdata, onNewProperty, onClearProperty } = ldata;
    const toretry = [];
    if (registerdata && registerdata.length > 0) {
      // loop through and send data
      this.setState(
        { loading: true, message: 'Processing property data...' },
        async () => {
          // filter properties
          const properties = registerdata.filter(
            (ptype) => ptype.type === 'property',
          );
          properties.forEach((property) => {
            const message = `Sending data for ${
              property.name
            } with property ID=${property.propertyid}`;
            this.setState({ message }, async () => {
              const data = new FormData();
              data.append('name', property.name);
              data.append('ownerid', property.ownerid);
              data.append('propertyid', property.propertyid);
              data.append('type', property.type);
              property.data.forEach((photo, index) => {
                data.append('longitude', photo.location.longitude);
                data.append('latitude', photo.location.latitude);
                data.append('accuracy', photo.location.accuracy);
                data.append('photos', {
                  uri: photo.imagepath,
                  type: 'image/jpeg',
                  name: `photos-${index}`,
                });
              });
              // send data
              console.log(data);
              try {
                const res = await futch(
                  config.updatePhotosURL,
                  {
                    method: 'post',
                    body: data,
                  },
                  (e) => {
                    const progressIndicator = e.loaded / e.total;
                    console.log('progressIndicator', progressIndicator);
                    // this.setState({
                    //   progress: progressIndicator,
                    // });
                  },
                );
                console.log(res);
              } catch (errors) {
                console.log(errors.message);
                toretry.push(property);
              }
            });
          });
          // save and failed data
          const nonProperty = registerdata.filter((f) => f.type !== 'property');
          const remainData = [...nonProperty, ...toretry];
          if (remainData.length === 0) {
            await onClearProperty();
          } else {
            await onNewProperty(remainData);
          }
        },
      );
    }
  };
  render() {
    if (this.state.loading) {
      return (
        <CenterView>
          <Text>{this.state.message}</Text>
        </CenterView>
      );
    }
    return (
      <LocalData>
        {(ldata) => {
          const { registerdata } = ldata;
          console.log(registerdata);
          const counter = registerdata === null ? 0 : registerdata.length;
          return (
            <CenterView>
              <Text>Total number of pending data: {counter}</Text>
              <Button onPress={() => this._handleLoadToSever(ldata)}>
                Upload Data
              </Button>
            </CenterView>
          );
        }}
      </LocalData>
    );
  }
}

export default ResendData;
