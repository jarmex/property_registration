import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  View,
  Image,
  CameraRoll,
  Alert,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Icon } from 'native-base';
import { LocalData } from '../../../hoc';
import {
  ButtonViewItems,
  ContainerView,
  DoneText,
  OuterPendingView,
  PendingLocationView,
} from './styles';

const PendingView = () => (
  <OuterPendingView>
    <ActivityIndicator size="large" />
  </OuterPendingView>
);
const NotAuthorizedView = () => (
  <OuterPendingView>
    <Text>Waiting...........</Text>
  </OuterPendingView>
);

export default class TakePicture extends Component {
  static navigationOptions = {
    title: 'Property Images',
  };
  state = {
    source: null,
    imagedata: [],
    type: RNCamera.Constants.Type.back,
    position: null,
    positionset: false,
    message: 'Waiting for GPS data......',
  };
  async componentDidMount() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      console.log(granted);
      if (granted === PermissionsAndroid.RESULTS.GRANTED || granted === true) {
        // WHATEVER WAY YOU WANT THEM TO KNOW THAT THEY HAVE GRANTED THE PERMISSION
        // MAY BE USING BASIC ALERT OR TOASTANDROID
        this.watchID = navigator.geolocation.watchPosition(
          (position) => {
            console.log(position); // eslint-disable-line
            this.setState({ position });
          },
          (error) => {
            Alert.alert('Location Failed', error.message);
          },
          { enableHighAccuracy: true, timeout: 20000 },
        );
      } else {
        // SAME AS ABOVE
        this.setState({ message: granted });
        ToastAndroid.show(
          'Location Permission not granted. Try again',
          ToastAndroid.LONG,
        );
      }
    } catch (error) {
      Alert.alert('Permission', error.message);
    }
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  takePicture = async (camera) => {
    try {
      const options = { quality: 0.5, base64: true };
      const data = await camera.takePictureAsync(options);
      const saveImageLink = await CameraRoll.saveToCameraRoll(data.uri);
      console.log(saveImageLink); // eslint-disable-line
      this.setState({
        source: data.uri,
        imagedata: [
          ...this.state.imagedata,
          {
            imagepath: saveImageLink,
            originalUrl: data.uri,
            location: this.state.position,
          },
        ],
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
    console.log(this.state.imagedata); // eslint-disable-line
  };

  addNewProperty = async (data, onNewProperty) => {
    const { params } = this.props.navigation.state;
    // save the informaiton to memory before proceeding
    try {
      const newpropdata = {
        type: 'property',
        ownerid: params.id,
        name: params.name,
        data: this.state.imagedata,
      };
      if (data === null) {
        const newdata = [newpropdata];
        await onNewProperty(newdata);
      } else {
        // append the data to the existing one
        const existdata = [...data, newpropdata];
        await onNewProperty(existdata);
      }
    } catch (err) {
      Alert.alert('Error', err.message);
      return;
    }

    this.props.navigation.navigate('newproperty', {
      id: params.id,
      name: params.name,
    });
  };

  _handleUseLocation = () => {
    this.setState({ positionset: true });
  };
  render() {
    if (!this.state.positionset) {
      return (
        <PendingLocationView
          message={this.state.message}
          position={this.state.position}
          onPress={this._handleUseLocation}
        />
      );
    }
    return (
      <ContainerView>
        <RNCamera
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
          type={this.state.type}
          flashMode={RNCamera.Constants.FlashMode.on}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={
            'We need your permission to use your camera phone'
          }
          pendingAuthorizationView={<PendingView />}
          notAuthorizedView={<NotAuthorizedView />}
        >
          {({ camera }) => (
            <ButtonViewItems>
              <View
                style={{
                  height: 70,
                  width: 80,
                  alignItems: 'center',
                }}
              >
                {this.state.source && (
                  <Image
                    source={{ uri: this.state.source }}
                    resizeMode="contain"
                    style={{ height: 70, width: 50 }}
                  />
                )}
              </View>
              <TouchableOpacity
                onPress={() => this.takePicture(camera)}
                style={styles.capture}
              >
                <Icon
                  name="aperture"
                  style={{ color: 'white', fontSize: 55 }}
                />
              </TouchableOpacity>
              <View
                style={{
                  height: 70,
                  width: 80,
                  justifyContent: 'center',
                }}
              >
                <LocalData>
                  {({ registerdata: data, onNewProperty }) => (
                    <TouchableOpacity
                      onPress={() => this.addNewProperty(data, onNewProperty)}
                    >
                      <DoneText>Done</DoneText>
                    </TouchableOpacity>
                  )}
                </LocalData>
              </View>
            </ButtonViewItems>
          )}
        </RNCamera>
      </ContainerView>
    );
  }
}

const styles = StyleSheet.create({
  capture: {
    flex: 0,
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
