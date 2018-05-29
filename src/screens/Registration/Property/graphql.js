import gql from 'graphql-tag';

export const QueryPropertiesGQL = gql`
  query getPropertyByowner($id: Int!) {
    propertiesbyowner(id: $id) {
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

export const CreatePropertyQL = gql`
  mutation createProperty($building: PropertyInput) {
    createProperty(building: $building) {
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
