import './App.css';
import React, {useState, useEffect} from 'react';
import { Navigate, BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import {parsingCategories, parsingCategoryLetters} from "./bible";

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

const VerseDiv = styled.div`
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
            newCategoryMap[category.category] = {};
            newCategoryMap[category.category].enabled = state[category.category].enabled;
            newCategoryMap[category.category].itemOrder = state[category.category].itemOrder;
            for (const categoryItem of items) {
                newCategoryMap[category.category][categoryItem.id] = {
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

    }

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
                            return (<div key={item.id + "div"} style={{color: "#20ff20"}}><input className="form-check-input" type="checkbox"
                                                                      id={item.id} name={item.id}
                                                                      checked={item.checked} />
                                <label className="form-check-label" htmlFor={item.id}>{item.label}</label>);
                            </div>);
                        } else if (item.incorrect) {
                            return (<div key={item.id + "div"} style={{color: "#ff2020"}}><input className="form-check-input" type="checkbox"
                                                                      id={item.id} name={item.id}
                                                                      checked={item.checked} />
                                    <label className="form-check-label" htmlFor={item.id}>{item.label}</label>
                            </div>);
                        } else {
                            return (<div key={item.id + "div"}><input className="form-check-input" type="checkbox"
                                                                                                             id={item.id} name={item.id}
                                                                                                             checked={item.checked} />
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
        </QuizBase>
    );
}
export default Quiz;
