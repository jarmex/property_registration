import graphql from 'graphql-tag';

export const SEARCH_PROPERTY = graphql`
  query searchproperty($name: String!) {
    searchproperty(name: $name) {
      id
      name
      ownerid
      addressCode
      houseNumber
      lvbNumber
      area
      electoralArea
      assembly
      region
      structureType
      description
      streetName
      noOfTenant
      createdAt
    }
  }
`;
