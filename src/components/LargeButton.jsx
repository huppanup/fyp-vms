import React from "react";
import '../stylesheets/components.css'


export function LargeButton(props){
    return (
        <button className="large-button" onClick={props.onClick}>
        {props.icon ? <span id="icon">{props.icon}</span> : null}<span style={{margin:"auto"}}>{props.value}</span>
        </button>
    );
}
// TODO: Long messages overflow the popup body.