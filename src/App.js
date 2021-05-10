
import './App.css';
import React from 'react';
import {HashRouter, Redirect, Route, Switch} from 'react-router-dom';
import Scanner from "./components/Scanner"


function App() {
  return (
    <HashRouter>
    <Switch>
        <Route exact path="/">
            <Redirect to="/scanner"/>
        </Route>
    
        <Route exact path="/scanner" component={Scanner}/>

    </Switch>
</HashRouter>
  );
}

export default App;
