/* eslint import/no-unresolved: */

import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
import { Easing, Animated } from 'react-native';
import {
  CustomerRegistration,
  TenantsRegistration,
  PropertyRegistration,
  NewRegistration,
  NewProperty,
} from '@Registration';

import theme from '../theme';
import LoginPage from '../screens/Login/Login';
import HomePage from '../screens/HomePage/HomePage';
import LoadConfigurations from '../screens/LoaderPage/LoadDataToMemory';
import TakePicture from '../screens/Registration/Property/TakePicture';

const transitionConfig = () => ({
  transitionSpec: {
    duration: 300,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing,
  },
  screenInterpolator: (sceneProps) => {
    const { layout, position, scene } = sceneProps;
    const { index } = scene;

    const height = layout.initHeight;
    const translateY = position.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [height, 0, 0],
    });

    const opacity = position.interpolate({
      inputRange: [index - 1, index - 0.99, index],
      outputRange: [0, 1, 1],
    });

    return { opacity, transform: [{ translateY }] };
  },
});

const appStackNavigation = createStackNavigator(
  {
    home: HomePage,
    cregistration: CustomerRegistration,
    tregistration: TenantsRegistration,
    pregistration: PropertyRegistration,
    newcustomer: NewRegistration,
    newproperty: NewProperty,
    loadconfiguration: LoadConfigurations,
    takepicture: TakePicture,
  },
  {
    initialRouteName: 'home',
    navigationOptions: () => ({
      headerStyle: {
        backgroundColor: theme.color.header,
      },
      headerTintColor: 'white',
    }),
    transitionConfig,
  },
);

export const createRootNavigator = (initialScreen) =>
  createSwitchNavigator(
    {
      login: LoginPage,
      homestack: appStackNavigation,
    },
    { initialRouteName: initialScreen || 'login' },
  );
