import styled, { css } from 'styled-components';

export const ContainerView = styled.View`
  ${({ flex }) =>
    flex &&
    css`
      flex: ${flex};
    `};

  ${({ center }) =>
    center &&
    css`
      justify-content: center;
      align-items: center;
    `};
  ${({ mtop }) =>
    mtop &&
    css`
      margin-top: ${mtop};
    `};

  ${({ justify }) =>
    justify &&
    css`
      justify-content: ${justify};
    `};

  ${({ align }) =>
    align &&
    css`
      align-items: ${align};
    `};

  ${({ bgcolor }) =>
    bgcolor &&
    css`
      background-color: ${bgcolor};
    `};
`;

export const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.color.background};
`;
