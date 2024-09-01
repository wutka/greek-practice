import './App.css';
import React, {useState, useEffect} from 'react';
import { Navigate, BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import {Bible} from "./bible";

const VerseWord = styled.div`
    font-size: large;
`

const HighlightedVerseWord = styled.div`
    font-size: xx-large;
    color: darkgreen;
`

const VerseDiv = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
`

const VerseText = props => {
    return (
        <VerseDiv>
            { props.verseWords.map((word, index) => {
                if (props.targetWord.versePos === index) {
                    return <HighlightedVerseWord key={index}>{word[5]}</HighlightedVerseWord>
                } else {
                    return <VerseWord key={index}>{word[5]}</VerseWord>
                }
            })}
        </VerseDiv>
    )
}
export const Quiz =  props => {
    const [state, setState] = useState({word: props.bible.chooseRandomWord(props.allowableParsings)});

    if (!state.word) {
        return;
    }
    return (
        <VerseText verseWords={state.word.verseWords} targetWord={state.word.targetWord} />
    );
}
export default Quiz;
