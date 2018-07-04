export const formatError = (error) => {
  if (error.networkError) {
    return 'There is no network connectivity. Please check internet connection and try again';
  }
  if (error.graphQLErrors) {
    return error.graphQLErrors
      .map((err) => {
        if (err.details && err.details.length > 0) {
          return err.details.map((nerr) => nerr.message).join(';');
        }
        return err.message;
      })
      .join(';');
  }

  return error.message;
};
