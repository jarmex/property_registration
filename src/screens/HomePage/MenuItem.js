import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'native-base';
import {
  MenuBaseView,
  MenuBannerView,
  MenuText,
  BannerMenuText,
  CustomerView,
} from './styles';

export const BrowseMenuItem = ({
  data: { label, icon, ...rest },
  onPress,
  index,
}) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <MenuBaseView {...rest} index={index}>
      <Icon name={icon} style={{ color: 'white', fontSize: 35 }} />
      <MenuText>{label}</MenuText>
    </MenuBaseView>
  </TouchableWithoutFeedback>
);
export const BannerMenuItem = ({
  data: { label, desc, icon, ...rest },
  onPress,
}) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <MenuBannerView {...rest}>
      <Icon name={icon} style={{ color: 'white', fontSize: 65 }} />
      <CustomerView>
        <BannerMenuText>{label}</BannerMenuText>
        <BannerMenuText>{desc}</BannerMenuText>
      </CustomerView>
    </MenuBannerView>
  </TouchableWithoutFeedback>
);
