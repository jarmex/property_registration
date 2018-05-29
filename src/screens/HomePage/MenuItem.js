import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { MenuBaseView, MenuText } from './styles';

export const BrowseMenuItem = (props) => (
  <TouchableWithoutFeedback onPress={props.onPress} style={{ width: '100%' }}>
    <MenuBaseView>
      <MenuText>{props.label}</MenuText>
    </MenuBaseView>
  </TouchableWithoutFeedback>
);
