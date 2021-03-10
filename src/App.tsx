import React from 'react';
import logo from './assets/img/icons/logo.svg';
import './styles/App.css';

import Link from './components/Link';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Link className="App-link" href="https://reactjs.org">
          Learn React
        </Link>
      </header>
    </div>
  );
}

export default App;
