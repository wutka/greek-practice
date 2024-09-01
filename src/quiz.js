import './App.css';
import React, {useState, useEffect} from 'react';
import { Navigate, BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import {parsingCategories, parsingCategoryLetters, PARSING} from "./bible";
import boostrap from "bootstrap";

const QuizBase = styled.div`
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto;
    grid-template-areas: "pad1 book_chapter_verse pad2"
                         "pad1 verse pad2"
                         "pad1 answers pad2"
                         "pad1 controls pad2";
    row-gap: 40px;
    padding: 1em;
`;

const BookChapterVerse = styled.div`
    grid-area: book_chapter_verse;
    font-size: xx-large;
    color: black;
`

const VerseBase = styled.div`
    grid-area: verse;
`

const VerseWord = styled.div`
    font-size: xx-large;
`

const HighlightedVerseWord = styled.div`
    font-size: xx-large;
    color: darkgreen;
`

const ParsingGridBase = styled.div`
    display:flex;
    flex-direction: row;
    grid-area: answers;
`

const ParsingGroupBase = styled.div`
    display: flex;
    flex-direction: column;
`

const Controls = styled.div`
    display: flex;
    flex-direction: row;
    grid-area: controls;
    column-gap: 100px;
`

const VerseDiv = styled.div`
    font-family: "SBL Greek";
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
`

const LabelDiv = styled.div`
    font-weight: bold;
    text-align: center;
`;

const createInitialState = () => {
    const categoryMap = {}
    for (const category of parsingCategories) {
        categoryMap[category.category] = {}
        categoryMap[category.category].enabled = true;
        const itemOrder = [];
        for (const categoryItem of category.items) {
            itemOrder.push(categoryItem.id);
            categoryMap[category.category][categoryItem.id] = {
                id: categoryItem.id,
                label: categoryItem.label,
                checked: false,
                correct: false,
                incorrect: false
            }
        }
        categoryMap[category.category].itemOrder = itemOrder;
    }
    return { checkingResults: false, categoryMap: categoryMap}
}

export const Quiz =  props => {
    const [state, setState] = useState(createInitialState());


    const copyState = (state) => {
        const newCategoryMap = {};
        for (const [category, items] of Object.entries(state.categoryMap)) {
            newCategoryMap[category] = {};
            newCategoryMap[category].enabled = state.categoryMap[category].enabled;
            newCategoryMap[category].itemOrder = state.categoryMap[category].itemOrder;
            for (const categoryItem of Object.values(items)) {
                newCategoryMap[category][categoryItem.id] = {
                    id: categoryItem.id,
                    label: categoryItem.label,
                    checked: categoryItem.checked,
                    correct: categoryItem.correct,
                    incorrect: categoryItem.incorrect,
                }
            }
        }
        return { checkingResults: state.checkingResults, categoryMap: newCategoryMap }
    }

    const categoryList = [];
    for (const category of parsingCategories) {
        categoryList.push(category.category);
    }

    if (!props.currentWord) {
        return;
    }

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

    const onChange = ev => {
        const target = ev.target;
        const id = target.id;

        const newState = copyState(state);

        const categoryName = parsingCategoryLetters[id].category;
        const category = newState.categoryMap[categoryName];

        for (const itemName of category.itemOrder) {
            const item = category[itemName];
            if (item.id === id) {
                item.checked = true;
            } else {
                item.checked = false;
            }
        }
        setState(newState);
    }

    const doCheck = ev => {
        const newState = copyState(state);
        newState.checkingResults = true;

        for (const categoryName of categoryList) {
            const category = newState.categoryMap[categoryName];

            for (const itemName of category.itemOrder) {
                const item = category[itemName];
                const codeInfo = parsingCategoryLetters[item.id];
                item.correct = false;
                item.incorrect = false;
                if (item.checked) {
                    if (codeInfo.code === props.currentWord.targetWord[PARSING][codeInfo.offset]) {
                        item.correct = true;
                    } else {
                        item.incorrect = true;
                    }
                } else {
                    if (codeInfo.code === props.currentWord.targetWord[PARSING][codeInfo.offset]) {
                        item.correct = true;
                    }
                }
            }
        }
        setState(newState);
    }

    const doNext = ev => {
        setState(createInitialState);
        props.chooseNextWord();
    }

    const noChange = ev => { return false; }

    const ParsingGroup = props => {
        return (
            <ParsingGroupBase className="form-check" disabled={!props.enabled}>
                <LabelDiv>{props.category}</LabelDiv>
                {props.items.map(item => {
                    if (!state.checkingResults) {
                        return (<div key={item.id+"div"}><input className="form-check-input" type="checkbox" id={item.id} name={item.id}
                                                                onChange={onChange} checked={item.checked}/>
                            <label className="form-check-label" htmlFor={item.id}>{item.label}</label>
                        </div>);
                    } else {
                        if (item.correct) {
                            return (<div key={item.id + "div"} style={{color: "#008000"}}><input className="form-check-input" type="checkbox"
                                                                      id={item.id} name={item.id}
                                                                      checked={item.checked} onChange={noChange}/>
                                <label className="form-check-label" htmlFor={item.id}>{item.label}</label>
                            </div>);
                        } else if (item.incorrect) {
                            return (<div key={item.id + "div"} style={{color: "#ff2020"}}><input className="form-check-input" type="checkbox"
                                                                      id={item.id} name={item.id}
                                                                      checked={item.checked} onChange={noChange}/>
                                    <label className="form-check-label" htmlFor={item.id}>{item.label}</label>
                            </div>);
                        } else {
                            return (<div key={item.id + "div"}><input className="form-check-input" type="checkbox"
                                                                                                             id={item.id} name={item.id}
                                                                                                             checked={item.checked} onChange={noChange}/>
                                    <label className="form-check-label" htmlFor={item.id}>{item.label}</label>
                            </div>);
                        }
                    }
                })}
            </ParsingGroupBase>
        );
    }

    return (
        <QuizBase>
            <BookChapterVerse>{props.currentWord.book} {props.currentWord.chapter+":"+props.currentWord.verseNumber}</BookChapterVerse>
            <VerseBase><VerseText verseWords={props.currentWord.verseWords} targetWord={props.currentWord.targetWord} /></VerseBase>
            <ParsingGridBase>
                { categoryList.map(category => {
                    const categoryInfo = state.categoryMap[category];
                    return <ParsingGroup enabled={categoryInfo.enabled} category={category} items={
                        categoryInfo.itemOrder.map(id => categoryInfo[id])}/>
                })}
            </ParsingGridBase>
            <Controls>
                <button type="button" className="btn btn-primary" onClick={doCheck} id="check" name="check">Check</button>
                <button type="button" className="btn btn-primary" onClick={doNext} id="next" name="next">Next</button>
            </Controls>
        </QuizBase> ) ;
}
export default Quiz;
