import './App.css';
import React, {useState, useEffect} from 'react';
import {Bible} from "./bible";


const App = props => {
  const [state, setState] = useState({
  });

  useEffect(() => {
    if (props.dictionary) {
      fetch("/"+props.dictionary).then((res) =>
          res.json()).then(res => {
        setState({...state, bible: new Bible(res)});
      });
    }
  }, [props.dictionary]);

  return (
    <div className="App">
      <header className="App-header">
      </header>
    </div>
  );
}

export default App;
