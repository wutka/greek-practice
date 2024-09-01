import './fonts/SBL_grk.ttf';
import './App.css';
import React, {useState, useEffect} from 'react';
import { Navigate, BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import {Bible} from "./bible";
import {Settings, createSettings} from "./settings.js";
import Quiz from "./quiz.js";
import About from "./about.js";
import {HeaderBase, Header} from "./header.js";


const AppBase = styled.div`
  display: grid;
  color: gray;
  height: 100vh;
  grid-template-columns: 40px auto 40px;
  grid-template-rows: 100px auto;
  grid-template-areas:
    "pad1 header pad2"
    "pad1 main pad2";
`;

const Pad1 = styled.div`
    grid-area: pad1;
    background-color: lightseagreen;
`;

const Pad2 = styled.div`
    grid-area: pad2;
    background-color: lightseagreen;
`;

const App = props => {
  const [state, setState] = useState({
    loaded: false, settings: createSettings(), bible: new Bible([]), currentWord: null, allowableParsings: [],
  });

  const setSettings = (settings) => {
    if (state.bible) {
      const allowableParsings = state.bible.computeAllowableParsings(settings);
      const currentWord = state.bible.chooseRandomWord(allowableParsings);
      setState({...state, settings: settings, allowableParsings: allowableParsings, currentWord: currentWord});
    } else {
      setState({...state, settings: settings});
    }
  }

  const chooseNextWord = () => {
      const currentWord = state.bible.chooseRandomWord(state.allowableParsings);
      setState({...state, currentWord: currentWord});
  }

  useEffect(() => {
    if (props.tables) {
      fetch(props.tables).then((res) =>
          res.json()).then(res => {
            const bible = new Bible(res);
            const allowableParsings = bible.computeAllowableParsings(state.settings);
            const currentWord = bible.chooseRandomWord(allowableParsings);
          setState({...state, loaded: true, bible: bible, allowableParsings: allowableParsings,
                currentWord: currentWord });
      });
    }
  }, [props.dictionary]);

  if (!state.loaded) {
      return (<div>Loading...</div>);
  }

  return (
      <BrowserRouter basename="/ntgreekverbpractice">
        <AppBase>
          <Header style={{gridArea: "header"}}/>
          <Pad1/>
          <Routes>
            <Route exact path="/" element={<Settings setOptions={setSettings}/>} />
            <Route exact path="/settings" element={<Settings setOptions={setSettings}/>} />
            <Route exact path="/about" element={<About/>} />
            <Route exact path="/quiz" element={<Quiz settings={state.settings}
                                                     bible={state.bible}
                                                     allowableParsings={state.allowableParsings}
                                                     currentWord={state.currentWord}
                                                     chooseNextWord={chooseNextWord}
                                                />}
                />
          </Routes>
          <Pad2/>
        </AppBase>
      </BrowserRouter>
  );
}

export default App;
