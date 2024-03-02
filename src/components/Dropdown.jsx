import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { ReactSVG } from "react-svg";
import * as icons from "react-icons/fa6";
import "../stylesheets/dropdown.css"

export default ({options, placeholder, onChange}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState();

    function selectOption(option){
        setSelected(option);
        setIsOpen(false);
        onChange(option);
    }

    useEffect(() =>{
        if(isOpen){
            const handleClickOutside = (event) => {
                if (!document.querySelector(".dropdown").contains(event.target))setIsOpen(false);
            };
            
            document.addEventListener('click', handleClickOutside);
            return () => {
                document.removeEventListener('click', handleClickOutside);
            }
        }
    },[isOpen]);

    const list = (
        <ul className={"dropdown-list"}>
            {options.map((option) => (<li className="dropdown-item" onClick={()=>selectOption(option)}>{option}</li>))}
        </ul>
    ); 

    return (
    <div className={"dropdown"}>
        <div className={"dropdown-title" + (isOpen ? " active" : "")} onClick={()=>setIsOpen(!isOpen)}>
        <div style={{flexGrow: "5", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginRight:"10px"}}>{selected || placeholder}</div><icons.FaCaretDown className="dropdown-icon" size={15} />
        </div>
        { isOpen && list }
    </div>
    );
}