import graphql from 'graphql-tag';

export const NEW_TENANT = graphql`
  mutation createTenant($tenant: TenantInput) {
    createTenant(tenant: $tenant) {
      id
    }
  }
`;
