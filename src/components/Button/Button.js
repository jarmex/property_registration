import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Fab } from 'native-base';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

const ButtonWrapper = styled.View`
  background-color: ${({ theme }) => theme.color.button};
  justify-content: center;
  align-items: center;
  height: 45;
  margin-top: 15;
  margin-bottom: 15;
  width: ${(props) => props.width || '80%'};
  border-radius: ${({ radius }) => radius || 22};
`;

const TextWrapper = styled.Text`
  color: #ffffff;
  font-size: 18;
  ${({ bold }) =>
    bold &&
    css`
      font-weight: bold;
    `};
`;
const PressButton = styled.TouchableOpacity`
  width: 100%;
  align-items: center;
  margin-top: 10;
`;
const View = styled.View`
  margin-top: 2;
  margin-bottom: 2;
`;
class ButtonExtended extends React.Component {
  state = {
    isLoading: false,
  };

  setLoadingState = async (isLoading) =>
    new Promise((resolve) => {
      this.setState({ isLoading }, resolve);
    });
  handleButtonTapped = async () => {
    if (this.props.normal) {
      this.props.onPress();
    } else {
      await this.setLoadingState(true);
      await this.props.onPress();
      await this.setLoadingState(false);
    }
  };
  render() {
    const { width, children, bold, ...rest } = this.props;
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return (
      <PressButton onPress={this.handleButtonTapped}>
        <ButtonWrapper width={width} {...rest}>
          <TextWrapper bold={bold}>{children}</TextWrapper>
        </ButtonWrapper>
      </PressButton>
    );
  }
}

ButtonExtended.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default ButtonExtended;

// export const Button = (props) => <ButtonExtended {...props} />;
export { ButtonExtended as Button };

export const FabEx = styled(Fab)`
  background-color: ${({ theme }) => theme.color.header};
`;
