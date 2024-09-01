import './App.css';
import React, {useState, useEffect} from 'react';
import { useNavigate, BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import {Bible} from "./bible";

const HeaderBase = styled.div`
    background-color: lightseagreen;
    display: grid;
    grid-template-areas: "controls logo";
    grid-template-columns: 60% 40%;
    
`

const Controls = styled.div`
    grid-area: controls;
    display: flex;
    flex-direction: row;
    column-gap: 40px;
    align-items: flex-start;
    padding-top: 20px;
`

const Logo = styled.div`
    grid-area: logo;
    text-align: right;
    font-size: 40px;
    font-family: "SBL Greek";
    color: darkblue;
`

export const Header =  props => {
    const navigate = useNavigate();

    const onSettings = ev => {
        navigate("./settings");
    }

    const onQuiz = ev => {
        navigate("./quiz");
    }

    const onAbout = ev => {
        navigate("./about");
    }

    return (
        <HeaderBase>
            <Controls>
                <button type="button" className="btn btn-primary" onClick={onSettings} id="settings"
                        name="settings">Settings
                </button>
                <button type="button" className="btn btn-primary" onClick={onQuiz} id="quiz"
                        name="quiz">Quiz</button>
                <button type="button" className="btn btn-primary" onClick={onAbout} id="about"
                        name="about">About</button>
            </Controls>
            <Logo>NT Greek Verb Practice</Logo>
        </HeaderBase>);

}
export default Header;
