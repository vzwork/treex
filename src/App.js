import './App.css';
import React, { Component } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from "./store";
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react'
import Tree from './components/Tree/Tree';
import Navbar from './components/Navbar/Navbar';
import Info from './components/Info/Info';
import Profile from './components/Profile/Profile';

const persistor = persistStore(store);

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      light: false
    }

    this.changeTheme = this.changeTheme.bind(this);
  }

  changeTheme() {
    this.setState({ light: !this.state.light })
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <div id='App'>
            <div className={(this.state.light ? 'theme--light' : 'theme--default')}>
              <HashRouter
                basename='/'
              >
                <Navbar />
                <Routes>
                  <Route path='/' element={<Info />} />
                  <Route path='/tree' element={<Tree />} />
                  <Route path='/profile' element={<Profile />} />
                </Routes>
              </HashRouter>
            </div>
          </div>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;