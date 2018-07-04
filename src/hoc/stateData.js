import React from 'react';

const { Provider, Consumer } = React.createContext();

export class StateProvider extends React.Component {
  state = {
    state: {},
  };
  onStateChange = (state) => {
    this.setState({ state });
  };
  render() {
    const { state } = this.state;
    const passedObject = Object.assign({}, state, {
      onStateChange: this.onStateChange,
    });
    return <Provider value={passedObject}>{this.props.children}</Provider>;
  }
}
export { Consumer as StateData };
