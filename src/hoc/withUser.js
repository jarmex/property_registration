import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { UserConsumer } from './userProvider';

export const withUser = (Component) => {
  const componentName = Component.displayName || Component.name || 'Component';
  class WithUser extends React.Component {
    static displayName = `WithUser(${componentName})`;
    render() {
      return (
        <UserConsumer>
          {(values) => {
            const allprops = Object.assign({}, this.props, values);
            return <Component {...allprops} />;
          }}
        </UserConsumer>
      );
    }
  }
  return hoistStatics(WithUser, Component);
};
