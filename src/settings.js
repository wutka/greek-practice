import './App.css';
import React, {useState, useEffect} from 'react';
import { useNavigate, BrowserRouter, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import {Bible} from "./bible";
import boostrap from "bootstrap";

const SettingsBase = styled.div`
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto;
    grid-template-areas: "pad1 pad1 pad1"
                         "pad2 settings pad3"
                         "pad2 errorMessage pad3"
                         "pad2 controls pad3";
    padding: 1em;
`;

const ErrorMessage = styled.div`
    color: red;
    grid-area: errorMessage;
`

const SettingsGridBase = styled.div`
    grid-area: settings;
    display: flex;
    flex-direction: row;
`;
const LabelDiv = styled.div`
    font-weight: bold;
    text-align: center;
`;

const ControlGrid = styled.div`
    grid-area: controls;
`

const SettingGroup = props => {
    return (
        <div className="form-check">
            <LabelDiv>{props.category}</LabelDiv>
            {props.items.map(item => {
                let settingLetter = settingsLetters[item.id];
                return (<div key={item.id+"div"}><input className="form-check-input" type="checkbox" id={item.id} name={item.id}
                                          onChange={props.onChange} checked={props.settings[settingLetter.offset][settingLetter.code]}/>
                        <label className="form-check-label" htmlFor={item.id}>{item.label}</label>
                        </div>);
            })}
        </div>
    );
}

const settings = [
    {
        category: "Voice", items: [
            {id: "active", label: "Active"},
            {id: "middle", label: "Middle"},
            { id: "passive", label: "Passive"},
        ]},
    { category: "Tense", items: [
            { id: "present", label: "Present"},
            { id: "imperfect", label: "Imperfect"},
            { id: "future", label: "Future"},
            { id: "aorist", label: "Aorist"},
            { id: "perfect", label: "Perfect"},
            { id: "pluperfect", label: "Pluperfect"},
        ]},
    { category: "Mood", items: [
            { id: "indicative", label: "Indicative"},
            { id: "imperative", label: "Imperative"},
            { id: "subjunctive", label: "Subjunctive"},
            { id: "optative", label: "Optative"},
            { id: "infinitive", label: "Infinitive"},
            { id: "participle", label: "Participle"},
        ]},
    { category: "Person", items: [
            {id: "first", label: "First"},
            {id: "second", label: "Second"},
            {id: "third", label: "Third"},
        ]
    },
    { category: "Number", items: [
            { id: "singular", label: "Singular"},
            { id: "plural", label: "Plural"},
        ]},
    { category: "Case", items: [
            { id: "nominative", label: "Nominative"},
            { id: "accusative", label: "Accusative"},
            { id: "genitive", label: "Genitive"},
            { id: "dative", label: "Dative"},
        ]},
    { category: "Gender", items: [
            { id: "masculine", label: "Masculine"},
            { id: "feminine", label: "Feminine"},
            { id: "neuter", label: "Neuter"},
        ]}
];

const SettingsGrid = (props) => {
    return (
    <SettingsGridBase>
        { settings.map(setting => {
            return <SettingGroup settings={props.settings} key={setting.category} onChange={props.onChange} category={setting.category} items={setting.items}/>
        })}
    </SettingsGridBase>
    );
}

const settingCategories = [ "Person", "Tense", "Voice", "Mood", "Case", "Number", "Gender"];

const settingsOffsets = {
    "Person": 0,
    "Tense": 1,
    "Voice": 2,
    "Mood": 3,
    "Case": 4,
    "Number": 5,
    "Gender": 6
}

const settingsLetters = {
    "active": { code: "A", offset: 2 },
    "middle": { code: "M", offset: 2 },
    "passive": { code: "P", offset: 2 },
    "present": { code: "P", offset: 1},
    "imperfect": { code: "I", offset: 1},
    "future": { code: "F", offset: 1},
    "aorist": { code: "A", offset: 1},
    "perfect": { code: "X", offset: 1},
    "pluperfect": { code: "Y", offset: 1},
    "indicative": { code: "I", offset: 3},
    "imperative": { code: "D", offset: 3},
    "subjunctive": { code: "S", offset: 3},
    "optative": { code: "O", offset: 3},
    "infinitive": { code: "N", offset: 3},
    "participle": { code: "P", offset: 3},
    "first": { code: "1", offset: 0},
    "second": { code: "2", offset: 0},
    "third": { code: "3", offset: 0},
    "singular": { code: "S", offset: 5},
    "plural": { code: "P", offset: 5},
    "nominative": { code: "N", offset: 4},
    "accusative": { code: "A",offset: 4},
    "genitive": { code: "G",offset: 4},
    "dative": { code: "D",offset: 4},
    "masculine": { code: "M", offset: 6},
    "feminine": { code: "F", offset: 6},
    "neuter": { code: "N", offset: 6},
}

export const createSettings = () => {
    const settings = {}
    for (const settingLetter of Object.values(settingsLetters)) {
        if (!settings[settingLetter.offset]) {
            settings[settingLetter.offset] = {};
        }
        settings[settingLetter.offset][settingLetter.code] = true;
    }
    return settings;
}

const checkSettings = (settings) => {
    const setCategories = [false, false, false, false, false, false, false];
    for (const [offset, letters] of Object.entries(settings)) {
        for (const [key, value] of Object.entries(letters)) {
            if (value) {
                setCategories[offset] = true;
                break;
            }
        }
    }

    let unsetCategories = "";
    for (let i = 0; i < setCategories.length; i++) {
        if (!setCategories[i]) {
            if (unsetCategories.length > 0) {
                unsetCategories += ", ";
            }
            unsetCategories += settingCategories[i];
        }
    }
    return unsetCategories;
}

const copySettings = (settings) => {
    const newSettings = {}
    for (const [offset, letters] of Object.entries(settings)) {
        newSettings[offset] = {}
        for (const [code, set] of Object.entries(letters)) {
            newSettings[offset][code] = set;
        }
    }
    return newSettings;
}

export const Settings =  props => {
    const [state, setState] = useState({
        settings: createSettings(),
        errorMessage: "",
    });

    const navigate = useNavigate();

    const onChange = ev => {
        const target = ev.target;
        const id = target.id;
        const settingLetter = settingsLetters[id];
        const newSettings = copySettings(state.settings);
        if (target.checked) {
            console.log(id, "is checked");
            newSettings[settingLetter.offset][settingLetter.code] = true;
        } else {
            console.log(id, "is unchecked");
            newSettings[settingLetter.offset][settingLetter.code] = false;
        }
        setState({...state, settings: newSettings});
    }

    const onQuiz = ev => {
        const errorCategories = checkSettings(state.settings);
        if (errorCategories) {
            setState({...state, errorMessage: "These categories need at least one option checked: "+errorCategories})
            return;
        }
        props.setOptions(state.settings);
        navigate("/quiz");
    }

    return (
        <SettingsBase>
            <SettingsGrid onChange={onChange} settings={state.settings} />
            { state.errorMessage ? <ErrorMessage>{state.errorMessage}</ErrorMessage> : "" }
            <ControlGrid><button type={"button"} className={"btn btn-primary"} onClick={onQuiz}>Run Quiz</button></ControlGrid>
        </SettingsBase>
    );

}
export default Settings;
