import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  View,
  Image,
  Alert,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Icon } from 'native-base';
import RNFetchBlob from 'rn-fetch-blob';
import { LocalData } from '../../../hoc';
import {
  ButtonViewItems,
  ContainerView,
  DoneText,
  OuterPendingView,
  PendingLocationView,
} from './styles';
import { CenterView } from '../../../components';

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

const IMAGE_PATH = `${RNFetchBlob.fs.dirs.DocumentDir}/IRCMPlatform`;
export default class TakePicture extends Component {
  static navigationOptions = {
    title: 'Property Images',
    header: null,
  };
  state = {
    source: null,
    imagedata: [],
    type: RNCamera.Constants.Type.back,
    position: null,
    positionset: false,
    message: 'Waiting for GPS data......',
    coords: null,
    permission: true,
  };
  async componentDidMount() {
    try {
      // create a folder for storing the pictures
      const folderpermission = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);

      if (folderpermission) {
        const filterpm = Object.keys(folderpermission).map(
          (permission) =>
            folderpermission[permission] === PermissionsAndroid.RESULTS.GRANTED,
        );

        const result = filterpm.some((item) => item === false);
        if (result) {
          ToastAndroid.show(
            'Permissions not granted. Kindly grant permission in order for the app to work correctly.',
            ToastAndroid.LONG,
          );
          this.setState({
            message: 'Permissions not fully granted. ',
            permission: false,
          });
          return;
        }
      }
      const folderexist = await RNFetchBlob.fs.isDir(IMAGE_PATH);
      if (!folderexist) {
        await RNFetchBlob.fs.mkdir(IMAGE_PATH);
      }
      // console.log('testing here');
      this.watchID = navigator.geolocation.watchPosition(
        (position) => {
          console.log(position); // eslint-disable-line
          this.setState({
            position,
            coords: position.coords,
          });
        },
        (error) => {
          Alert.alert('Location Failed', error.message);
        },
        { enableHighAccuracy: true, timeout: 30000 },
      );
    } catch (error) {
      this.setState({ message: error.message });
      Alert.alert('Permission', error.message);
    }
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  takePicture = async (camera) => {
    if (!this.state.coords) {
      return Alert.alert(
        'Unknown Location',
        'The location property cannot be set. Try again',
      );
    }
    try {
      const options = { quality: 0.5, base64: false, width: 400 };
      const { uri } = await camera.takePictureAsync(options);
      // TODO: move the picture to the picture folder
      const newUri = uri.split('//')[1];
      const filename = newUri.split('/').pop();
      const imagefilepath = `${IMAGE_PATH}/${filename}`;
      await RNFetchBlob.fs.mv(newUri, imagefilepath);
      const fileupload = `file://${imagefilepath}`;
      this.setState({
        source: fileupload,
        imagedata: [...this.state.imagedata, fileupload],
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  addNewProperty = async (ldata, onStateChange) => {
    const { params } = this.props.navigation.state;
    // save the informaiton to memory before proceeding
    const newldata = Object.assign({}, ldata, {
      property: {
        type: 'images',
        ownerid: params.id,
        name: params.name,
        ...this.state.coords,
        imagepath: this.state.imagedata,
      },
    });
    // update the state data
    onStateChange(newldata);

    this.props.navigation.navigate('newproperty', {
      id: params.id,
      name: params.name,
    });
  };

  _handleUseLocation = () => {
    this.setState({
      positionset: true,
    });
    navigator.geolocation.clearWatch(this.watchID);
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
    if (!this.state.permission) {
      return (
        <CenterView>
          <Text>{this.state.message}</Text>
        </CenterView>
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
                  {({ ldata, onStateChange }) => (
                    <TouchableOpacity
                      onPress={() => this.addNewProperty(ldata, onStateChange)}
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
