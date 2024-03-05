import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { ReactSVG } from "react-svg";
import * as icons from "react-icons/fa6";
import "../stylesheets/dropdown.css"

export default ({id, options, placeholder, onSelected, style, curSelected, active}) => {
    const [isOpen, setIsOpen] = useState(false);

    function selectOption(option){
        setIsOpen(false);
        console.log("Callback to locationcontext setVenue");
        onSelected(option);
        console.log("Completed selectOption");

    }

    useEffect(() =>{
        if(isOpen){
            const handleClickOutside = (event) => {
                if (!document.querySelector("#" + id).contains(event.target))setIsOpen(false);
            };
            
            document.addEventListener('click', handleClickOutside);
            return () => {
                document.removeEventListener('click', handleClickOutside);
            }
        }
    },[isOpen]);

    const list = (
        <ul className={"dropdown-list"}>
            {Object.entries(options).map(([key,value]) => (<li className="dropdown-item" key={key} onClick={()=>selectOption(key)}>{value}</li>))}
        </ul>
    ); 

    return (
    <div id= {id} className={"dropdown"}>
        <div className={"dropdown-title" + (isOpen ? " active" : "")} style={style} onClick={()=>setIsOpen(!isOpen)}>
        { active ? (<div style={{flexGrow: "5", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginRight:"10px"}}>{options[curSelected] || placeholder}</div>) :(<div style={{flexGrow: "5", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginRight:"10px"}}>{"Loading..."}</div>)}
        <icons.FaCaretDown className="dropdown-icon" size={15} />
        </div>
        { isOpen && active && list }
    </div>
    );
}