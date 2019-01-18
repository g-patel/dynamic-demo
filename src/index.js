// import React from 'react';
// import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import * as serviceWorker from './serviceWorker';



import React, { PureComponent } from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { connect, Provider } from 'react-redux';
// import './style.css';

// Util functions
const removeElementFromArray = function(arr, data) {
    const dataIdx = arr.indexOf(data);
    if(dataIdx >= 0) {
        arr.splice(dataIdx ,1);
    }
}

const UNFAVORITE = 'UNFAVORITE';
const FAVORITE = 'FAVORITE';
const ADD_RECENT = 'ADD_RECENT';
const RENAME = 'RENAME';

const demoReducer = (state = {}, action) => {
  const newState = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case FAVORITE: {
      const id = action.id;
      newState.content[id].favorite = true;
      if(!newState.favorites.includes(id)) {
        newState.favorites.push(id);
      }
      return newState;
    }  
    case UNFAVORITE: {
      const id = action.id;
      newState.content[id].favorite = false;
      removeElementFromArray(newState.favorites, id)
      return newState;
    }
    case RENAME: {
      const id = action.id;
      newState.content[id].name = action.newName;
      return newState;
    }
    case ADD_RECENT: {
      const id = action.id;
      newState.recents.unshift(id);
      return newState;
    }
    default: {
      return {
        content: {
          11: {
            name: 'item11',
            favorite: true
          },
          22: {
            name: 'item22',
            favorite: false
          },
          33: {
            name: 'item33',
            favorite: true
          }
        },
        favorites: [11, 33],
        recents: [33, 22, 11]
      }
    }
  }
}

const reducers = combineReducers({
  home: demoReducer
})

const store = createStore(reducers);
window.store = store;

class Card extends PureComponent {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    const cardStyle = {
      width: 100,
      minHeight: 100,
      border: "1px solid grey",
      float: "left"
    };
    return (
      <div style={cardStyle}>
        <div>{this.props.card.name}</div>
        <div>{this.props.card.favorite ? 'YES': 'NO'}</div>
      </div>
    );
  }
}

class Channel extends PureComponent {
  render() {
    const channelStyle = {
      clear: 'both'
    };
    return (
      <section style={channelStyle}>
        <h4>{this.props.title}</h4>
        {this.props.list.map((card) => {
          return (
            <Card card={card}>
            </Card>
            );
        })}
      </section>
    );
  }
}

const ConnectedFavChannel = connect((state) => {
  const favChannelProps = {
    list: []
  };
  state.home.favorites.forEach((favId) => {
    favChannelProps.list.push(JSON.parse(JSON.stringify(state.home.content[favId])));
  });
  return favChannelProps;
})(Channel);

const ConnectedRecentsChannel = connect((state) => {
  const recentChannelProps = {
    list: []
  };
  state.home.recents.forEach((recentId) => {
    recentChannelProps.list.push(JSON.parse(JSON.stringify(state.home.content[recentId])));
  });
  return recentChannelProps;
})(Channel);

class Home extends PureComponent {
  render() {
    return (
      <React.Fragment>
        <h1>Demo!</h1>
        <ConnectedFavChannel title={"Favorites"}></ConnectedFavChannel>
        <ConnectedRecentsChannel title={"Recents"}></ConnectedRecentsChannel>
      </React.Fragment>
    );
  }
}

class App extends PureComponent {
  componentDidMount() {
  }

  render() {
    console.log(this.props);
    return (
      <Home>
      </Home>
    );
  }
}

const AppContainer = connect()(App);

render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root')
);



// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
