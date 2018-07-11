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
            (ptype) => ptype.type === 'images',
          );
          properties.forEach((property) => {
            const message = `Sending data for ${
              property.name
            } with property ID=${property.propertyid}`;

            this.setState({ message }, async () => {
              const dataToSend = new FormData();
              dataToSend.append('name', property.propertyname);
              dataToSend.append('ownerid', property.ownerid);
              dataToSend.append('propertyid', property.propertyid);
              dataToSend.append('longitude', property.longitude);
              dataToSend.append('latitude', property.latitude);
              dataToSend.append('accuracy', property.accuracy);
              dataToSend.append('createdby', property.createdby);
              property.imagepath.forEach((item) => {
                // get the file name here
                const filename = item.split('/').pop();
                dataToSend.append('photos', {
                  uri: item,
                  type: 'image/jpg',
                  name: filename,
                });
              });
              // send data
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
              } catch (errors) {
                // console.log(errors.message);
                toretry.push(property);
              }
            });
          });
          // save and failed data
          const nonProperty = registerdata.filter((f) => f.type !== 'images');
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
          // console.log(registerdata);
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
