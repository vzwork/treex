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
import Dashboard from './components/Profile/Dashboard/Dashboard';
import Login from './components/Profile/Login/Login';
import Register from './components/Profile/Register/Register';
import Reset from './components/Profile/Reset/Reset';
import Guest from './components/Profile/Guest/Guest';

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
        <PersistGate loading={null} persistor={persistor}>
          <div id='App'>
            <div className={(this.state.light ? 'theme--light' : 'theme--default')}>
              <HashRouter
                basename='/'
              >
                <Navbar />
                <Routes>
                  <Route path='/' element={<Info />} />
                  <Route path='/tree' element={<Tree />} />
                  <Route path='/profile' element={<Profile />}>
                    <Route path='guest' element={<Guest />} />
                    <Route path='dashboard' element={<Dashboard />} />
                    <Route path='login' element={<Login />} />
                    <Route path='register' element={<Register />} />
                    <Route path='reset' element={<Reset />} />
                  </Route>
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