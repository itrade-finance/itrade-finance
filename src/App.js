import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import {
  Switch,
  Route
} from "react-router-dom";
import IpfsRouter from 'ipfs-react-router'

import './i18n';
import tradeTheme from './theme';

import Trade from './components/trade';
import Positions from './components/positions';
import Footer from './components/footer';
import Home from './components/home';

class App extends Component {

  render() {

    return (
      <MuiThemeProvider theme={ createMuiTheme(tradeTheme) }>
        <CssBaseline />
        <IpfsRouter>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            alignItems: 'center',
            background: "#f9fafb"
          }}>
            <Footer />
            <Switch>
              <Route path="/margin">
                <Trade />
              </Route>
              <Route path="/positions">
                <Positions />
              </Route>
              <Route path="/debt">
                <Positions />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        </IpfsRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;
