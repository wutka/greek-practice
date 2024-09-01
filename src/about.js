import './App.css';
import React, {useState, useEffect} from 'react';
import { useNavigate, BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import {Bible} from "./bible";

const AboutBase = styled.div`
`

export const About =  props => {
    const navigate = useNavigate();

    const onSettings = ev => {
        navigate("/settings");
    }

    const onQuiz = ev => {
        navigate("/quiz");
    }

    const onAbout = ev => {
        navigate("/about");
    }

    return (
        <div>
            <p>
                This program allows you to practice parsing Greek New Testament verbs in-context, that
                is, within a verse, rather than just giving you a verb without the verse in which
                it occurs.
            </p>
            <p>
               The Greek NT text used here is the SBL GNT from the Society for Biblical Literature,
               and the parsing data is from the MorphGNT project's parsing of the SBL GNT
                (available here <a href="https://github.com/morphgnt/sblgnt">https://github.com/morphgnt/sblgnt</a>.
                The Greek font used here is the <a href="https://www.sbl-site.org/educational/BiblicalFonts_SBLGreek.aspx">SBL Greek font</a>.
            </p>
            <p>
                On the settings page, you can select the various options you want to be quizzed on,
                with the default being everything. Use the Check button to see if your guesses
                for the parsing are correct, and the Next button to choose another random
                word.
            </p>
            <p>
                The source code for this React web app is available at <a href="https://github.com/wutka/greek-practice">https://github.com/wutka/greek-practice</a>.
                You can e-mail the author at <a href="mailto:mark@wutka.com">mark@wutka.com</a>.
            </p>
        </div>
    );

}
export default About;
