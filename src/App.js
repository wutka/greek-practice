import './App.css';
import React, {useState, useEffect} from 'react';
import { Navigate, BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import {Bible} from "./bible";
import {Settings, createSettings} from "./settings.js";
import Quiz from "./quiz.js";
import Header from "./header.js";


const AppBase = styled.div`
  display: grid;
  color: gray;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto;
  grid-template-areas:
    "header"
    "main";
`;

const App = props => {
  const [state, setState] = useState({
    settings: createSettings(), bible: new Bible([]),
  });

  const setSettings = (settings) => {
    if (state.bible) {
      console.log("recomputed allowable parsings", state.allowableParsings);
      const allowableParsings = state.bible.computeAllowableParsings(settings);
      setState({...state, settings: settings, allowableParsings: allowableParsings});
    } else {
      setState({...state, settings: settings});
    }
  }

  useEffect(() => {
    if (props.tables) {
      fetch("/"+props.tables).then((res) =>
          res.json()).then(res => {
            const bible = new Bible(res);
            const allowableParsings = bible.computeAllowableParsings(state.settings);
            console.log("Loaded bible, allowable parsings", allowableParsings);
          setState({...state, bible: bible, allowableParsings: allowableParsings});
      });
    }
  }, [props.dictionary]);

  return (
      <BrowserRouter>
        <AppBase>
          <Header/>
          <Routes>
            <Route exact path="/" element={<Settings setOptions={setSettings}/>} />
            <Route exact path="/settings" element={<Settings setOptions={setSettings}/>} />
            <Route exact path="/quiz" element={<Quiz settings={state.settings} bible={state.bible} allowableParsings={state.allowableParsings}/>} />
          </Routes>

        </AppBase>
      </BrowserRouter>
  );
}

export default App;
