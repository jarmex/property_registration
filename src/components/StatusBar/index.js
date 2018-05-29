import React from 'react';
import { StatusBar } from 'react-native';
import theme from '../../theme';

/* <StatusBar
  barStyle="light-content"
  backgroundColor="#311B92"
/> */

export const StatusBarEx = () => (
  <StatusBar backgroundColor={theme.color.statusbar} barStyle="light-content" />
);
