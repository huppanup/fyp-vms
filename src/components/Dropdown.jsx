import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { ReactSVG } from "react-svg";
import * as icons from "react-icons/fa6";
import "../stylesheets/dropdown.css"

export default ({id, options, placeholder, selected}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSelected, setIsSelected] = useState();

    function selectOption(option){
        setIsSelected(option);
        setIsOpen(false);
        selected(option);
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
        <div className={"dropdown-title" + (isOpen ? " active" : "")} onClick={()=>setIsOpen(!isOpen)}>
        <div style={{flexGrow: "5", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginRight:"10px"}}>{options[isSelected] || placeholder}</div><icons.FaCaretDown className="dropdown-icon" size={15} />
        </div>
        { isOpen && list }
    </div>
    );
}