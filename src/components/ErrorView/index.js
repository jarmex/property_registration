import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { CenterView } from '../styles';

const Text = styled.Text`
  font-size: 18;
  text-align: center;
  padding-horizontal: 16;
`;

const ErrorView = ({ message, children }) => (
  <CenterView>
    <Text>{message}</Text>
    {children}
  </CenterView>
);

ErrorView.propTypes = {
  message: PropTypes.string.isRequired,
};

export default ErrorView;
