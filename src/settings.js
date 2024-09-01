import './App.css';
import React, {useState } from 'react';
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {parsingCategories, parsingCategoryLetters} from "./bible";
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
                let settingLetter = parsingCategoryLetters[item.id];
                return (<div key={item.id+"div"}><input className="form-check-input" type="checkbox" id={item.id} name={item.id}
                                          onChange={props.onChange} checked={props.settings[settingLetter.offset][settingLetter.code]}/>
                        <label className="form-check-label" htmlFor={item.id}>{item.label}</label>
                        </div>);
            })}
        </div>
    );
}


const SettingsGrid = (props) => {
    return (
    <SettingsGridBase>
        { parsingCategories.map(setting => {
            return <SettingGroup settings={props.settings} key={setting.category} onChange={props.onChange} category={setting.category} items={setting.items}/>
        })}
    </SettingsGridBase>
    );
}

const settingCategories = [ "Person", "Tense", "Voice", "Mood", "Case", "Number", "Gender"];

export const createSettings = () => {
    const settings = {}
    for (const settingLetter of Object.values(parsingCategoryLetters)) {
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
        const settingLetter = parsingCategoryLetters[id];
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
        navigate("../quiz");
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
