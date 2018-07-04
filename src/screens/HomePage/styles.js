import styled, { css } from 'styled-components';
import { Dimensions } from 'react-native';

const ITEM_WIDTH = Dimensions.get('window').width / 2;

export const OuterView = styled.View`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
`;
export const Title = styled.Text`
  text-align: center;
  font-size: 30;
  font-weight: 500;
  color: #344154;
  margin-top: 30;
  margin-bottom: 30;
`;

export const MenuBaseView = styled.View`
  background-color: lightgray;
  margin-bottom: 2;
  max-width: ${ITEM_WIDTH};
  align-items: center;
  justify-content: space-around;
  flex: 0.5;
  height: 100;
  padding-top: 10;
  padding-bottom: 5;
  ${({ index }) =>
    index &&
    css`
      margin-right: 2;
    `};
  ${({ color }) =>
    color &&
    css`
      background-color: ${color};
    `};
`;
export const MenuBannerView = styled.View`
  padding: 20px 0px;
  background-color: lightgray;
  margin-bottom: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
  height: 150;
  flex-direction: row;
  ${({ color }) =>
    color &&
    css`
      background-color: ${color};
    `};
`;
export const MenuText = styled.Text`
  font-size: 18;
  color: white;
  padding: 0px 20px;
  text-align: center;
`;
export const BannerMenuText = styled.Text`
  font-size: 24;
  color: white;
  padding: 0px 20px;
`;

export const CustomerView = styled.View`
  flex-direction: column;
`;
