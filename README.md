TCR UI
======

## [Notes](./internals/notes.md)

## Commands

**Run:**

Start development server: `https://localhost:3000`

    $ npm start

**Linter:**

    $ npm run lint

**Generate boilerplate code for common parts (components/containers):**

    $ npm run generate

-----

## Directory structure

```
├── app - Main directory
|   ├── assets - Images, fonts
|   ├── components - Stateless, functional UI components rendering data provided by props
|   ├── config - Configuration files
|   ├── containers - Stateful containers providing application state, control-flow & business logic
|   |   ├── [NameSpace] - Container directory
|   |   |   ├── actions.js - Setup expected dispatch actions
|   |   |   ├── constants.js - Declare action types
|   |   |   ├── index.js - Main smart component
|   |   |   ├── Loadable.js - Async component loading
|   |   |   ├── messages.js - Module for display text
|   |   |   ├── reducer.js - Evaluation of user inputs
|   |   |   ├── sagas.js - Side effects and/of asynchronous Redux; Concurrency
|   |   |   ├── selectors.js - Composable library enables efficient Redux
|   ├── libs - Library modules
|   ├── tests - Jest tests
|   ├── translations - Words
|   ├── utils - Helpers, injections
|   ├── vendor - External library modules
|   ├── app.js - Application entry
|   ├── configureStore.js - Create store with dynamic reducers
|   ├── reducers.js - Reducer config
├── docs - Documentation
├── internals - Generators, webpack, testing, and other config
├── server - Server shit
├── truffle - Smart contracts and deployment scripts
```

---

#### Redux & Actions

- Each container should have its own actions/constants/reducer/sagas/selectors

#### Reducers

```js
import { fromJS } from 'immutable';

import {
  DEFAULT_ACTION,
  REGISTRY_EVENT,
  CONTRACT_EVENT,
  REGISTRY_ERROR,
  SET_TOKENS_ALLOWED,
  SET_CANONICAL_MIN_DEPOSIT,
} from './constants';

// Entire Redux state tree needs to be one giant Immutable object
const initialState = fromJS({
  registry_events: [],
  contract_events: [],
  tokensAllowed: '',
  canonicalMinDeposit: '',
  registryError: '',
});

// NO plain JS objects
function registryReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case CONTRACT_EVENT:
      return state
        .updateIn(['contract_events'], list => list.push(action.event));
    case REGISTRY_EVENT:
      return state
        .updateIn(['registry_events'], list => list.push(action.event));
    case REGISTRY_ERROR:
      return state
        .set('registryError', action.error);
    case SET_CANONICAL_MIN_DEPOSIT:
      return state
        .set('canonicalMinDeposit', action.minDeposit);
    case SET_TOKENS_ALLOWED:
      return state
        .set('tokensAllowed', action.tokens);
    default:
      return state;
  }
}

export default registryReducer;
```

#### Actions

* Define each action in `containers/[NameSpace]/actions.js`
* Define each action as a string in `containers/[NameSpace]/constants.js`

---

## Immutable and Reselect snippets:

### [./internals/snippets.md](./snippets.md)
---

### Higher Order Components

If we want to inject the click handler into arbitrary components without redundancy, an HoC is perfect. The following code is a factory function that creates a higher-order component:

```js
const withLogger = (WrappedComponent) => {
  return class ClickLogger extends React.Component {
    constructor(props) {
      super(props);

      this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
      console.log(e)
    }

    render() {
      const { title, content } = this.props;
      return (
        <div>
          <WrappedComponent {...this.props} onClick={this.onClick} />
        </div>
      );
    }
  }
}

// Now we can create a component that calls the click handler any time it is clicked with the following:
const LoggableComponent = withLogger(BaseComponent);
```

Another use of the HoC is to transform props of a wrapped component. For example, if we have numerous components with a title prop, and we want to create variants of components with capitalized tiles–or any other string transformation–we could create an HoC to handle the transformation:

```js
const makeUpperCase = (WrappedComponent) => {
  return class UpperCaseComponent extends React.Component {
    render() {
      const props = Object.assign({}, this.props, {
        title: this.props.title.toUpperCase()
      });

      return <WrappedComponent { ...props } />
    }
  };
}
```

State-changing example:

```js
const makeToggleable = (WrappedComponent, color) => {
  return class ToggleableComponent extends React.Component {
    constructor(props) {
      super(props);

      this.state = { toggled: false };
      this.toggleColor = this.toggleColor.bind(this);
    }

    toggleColor() {
      this.setState({ toggled: !this.state.toggled });
    }

    render() {
      const fontColor = this.state.toggled? color: 'black';
      return (
        <WrappedComponent { ...this.props }
          style={{color: fontColor}}
          onClick={this.toggleColor} />
      );
    }
  }
}

// This HoC is similar to the logger we created above, but its click handler alters the state, then updates the style based on the state and rerenders, passing the style to the wrapped component. An additional change is that the HoC takes in another component–the color to render when the state is toggled on. HoCs are not restricted to just taking a component; they may take any other arguments you like.

const ToggleableComponent = makeToggleable(BaseComponent, 'red');
```

As a final note, I’d like to mention that since HoCs take components as input and return other components as output, HoCs may be passed other HoCs.

For example, we could combine two of the above examples to create a component that is toggle-able, and has an uppercase title with one line of code:

```js
const UpperCaseToggleableComponent = makeUpperCase(makeToggleable(BaseComponent, 'red'));
```

Note:

Use a Higher Order Component to convert your Smart Component’s Immutable.JS props to your Dumb Component’s JavaScript props

Something needs to map the Immutable.JS props in your Smart Component to the pure JavaScript props used in your Dumb Component. That something is a Higher Order Component (HOC) that simply takes the Immutable.JS props from your Smart Component, and converts them using toJS() to plain JavaScript props, which are then passed to your Dumb Component.

-----

### License

This project is licensed under the MIT license, Copyright (c) 2017 Isaac Kang. For more information see `LICENSE.md`.