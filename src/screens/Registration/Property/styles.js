import React from 'react';
import styled from 'styled-components';
import { Button, Text } from 'native-base';

const ButtonViewItems = styled.View`
  position: absolute;
  left: 2;
  bottom: 2;
  width: 99%;
  height: 70;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
`;

const DoneText = styled.Text`
  font-size: 20;
  color: white;
  font-weight: bold;
`;
const ContainerView = styled.View`
  flex: 1;
  flex-direction: column;
  background-color: black;
`;

const OuterPendingView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
export { ButtonViewItems, ContainerView, DoneText, OuterPendingView };

const ReadGPSLocationView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const TextNote = styled.Text`
  font-size: 14px;
  align-self: stretch;
  text-align: center;
`;
const LocationView = styled.View`
  margin-bottom: 15;
`;

export const PendingLocationView = ({ message, position, onPress }) => (
  <ReadGPSLocationView>
    {!position ? (
      <TextNote>{message}</TextNote>
    ) : (
      <LocationView>
        <TextNote>Longitude: {position.coords.longitude}</TextNote>
        <TextNote>Latitude: {position.coords.latitude}</TextNote>
        <TextNote>Accuracy: {position.coords.accuracy}</TextNote>
        <TextNote>Altitude: {position.coords.altitude}</TextNote>
        <Button onPress={onPress} transparent style={{ marginTop: 10 }}>
          <Text>Use Location Info</Text>
        </Button>
      </LocationView>
    )}
  </ReadGPSLocationView>
);
