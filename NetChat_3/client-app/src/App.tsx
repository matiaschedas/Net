import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css'
import axios from 'axios';
import './App.css';
import { Grid } from 'semantic-ui-react';
import SidePanel from './Components/SidePanel/SidePanel';
import ColorPanel from './Components/ColorPanel/ColorPanel';
import Messages from './Components/Messages/Messages';
import MetaPanel from './Components/MetaPanel/MetaPanel';

class App extends Component {
  render() {
    return (
      <Grid columns="equal" className="app">
        <ColorPanel />
        <SidePanel />

        <Grid.Column className="column" style={{ marginLeft: 320 }}>
          <Messages />
        </Grid.Column>

        <Grid.Column width={4}>
          <MetaPanel />
        </Grid.Column>
      </Grid>
    )
  }
}

export default App;
