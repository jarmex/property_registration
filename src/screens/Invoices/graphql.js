import gql from 'graphql-tag';

export const QUERY_INVOICE_PER_CUSTOMER = gql`
  query getAllInvoice($customerId: Int!) {
    invoices(customerId: $customerId) {
      invoiceno
      invoicetype
      invoiceamount
      status
      billingitem
      outstandingamount
      amountpaid
      rateable
      rateImpost
      id
      createdAt
      description
    }
  }
`;

export const QUERY_ALL_INVOICE = gql`
  query GetAllInvoices {
    allinvoices {
      name
      id
      amount
    }
  }
`;
