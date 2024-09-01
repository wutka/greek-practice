import './App.css';
import React, {useState, useEffect} from 'react';
import { Navigate, BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import {Bible} from "./bible";

const QuizBase = styled.div`
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto;
    grid-template-areas: "pad1 book-chapter-verse pad1"
                         "pad2 verse pad3"
                         "pad2 answers pad3"
                         "pad2 controls pad3";
    padding: 1em;
`;

const BookChapterVerse = styled.div`
    grid-area: book-chapter-verse;
    font-size: xx-large;
    color: black;
`

const VerseWord = styled.div`
    font-size: xx-large;
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
    const [state, setState] = useState({});

    if (!props.currentWord) {
        return;
    }

    return (
        <QuizBase>
            <BookChapterVerse>{props.currentWord.book} {props.currentWord.chapter+":"+props.currentWord.verseNumber}</BookChapterVerse>
            <VerseText style={{gridArea: "verse"}} verseWords={props.currentWord.verseWords} targetWord={props.currentWord.targetWord} />
        </QuizBase>
    );
}
export default Quiz;
