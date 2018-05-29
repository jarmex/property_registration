import gql from 'graphql-tag';

export const QueryCustomersGQL = gql`
  query getcustomers($search: String) {
    getcustomers(search: $search) {
      id
      name
      code
      longitude
      latitude
      primaryPhone
      secondaryPhone
      email
      idtype
      idnumber
      addressone
      addresstwo
      tin
      zoneId
      createdAt
    }
  }
`;

export const NewPropertyOwnerGQL = gql`
  mutation createNewPropertyOwner($owner: PropertyOwnerInput!) {
    createPropertyOwner(owner: $owner) {
      id
      ownerType
      idtype
      idnumber
      lastname
      firstname
      middlename
      fullname
      business
      description
      tin
      email
      phone
      mobile
      phone1
      address
      city
      gender
      website
      revenuesource
      createdAt
    }
  }
`;

export const CreateCustomerGQL = gql`
  mutation createCustomer($customer: CustomerInput!) {
    createCustomer(customer: $customer) {
      id
      name
      code
      longitude
      latitude
      primaryPhone
      secondaryPhone
      email
      idtype
      idnumber
      addressone
      addresstwo
      tin
      zoneId
      createdAt
    }
  }
`;
