import './App.css';
import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import { TreeManager } from './data/TreeManager';

const persistor = persistStore(store);

const treeManager = TreeManager.getInstance();
let baseNode = {id:store.getState().baseNodeId, name:store.getState().baseNodeName}
let baseNodeExists = await treeManager.webHasTreeNode(baseNode);
if (!baseNodeExists) {
  baseNode = {id:'WUdK1a6fVuO5LjG1KouS', name:'root'}
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      light: false
    }
    
    treeManager.setBaseNode(baseNode);

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
              <BrowserRouter>
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
              </BrowserRouter>
            </div>
          </div>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;