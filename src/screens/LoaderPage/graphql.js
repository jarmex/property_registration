import gql from 'graphql-tag';

export const QueryElectoralAreaGQL = gql`
  query getAssemblyElectoralAreas($assemblyid: Int!) {
    electoralarea(assemblyid: $assemblyid) {
      name
      id
      AssemblyId
      SortationCode
    }
  }
`;

export const QueryStructureTypesQL = gql`
  query GetAllStructureType {
    structuretype {
      id
      name
      propertytypeid
    }
  }
`;

export const QueryRevenueSourceQL = gql`
  query getRevenueSources {
    revenuesources {
      name
      id
    }
  }
`;

export const QueryStaticDataQL = gql`
  query getStaticData($assemblyid: Int!) {
    electoralarea(assemblyid: $assemblyid) {
      name
      id
      AssemblyId
      SortationCode
    }
    structuretype {
      id
      name
      propertytypeid
    }
    revenuesources {
      name
      id
    }
  }
`;
