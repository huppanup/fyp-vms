import React from 'react';
import { useEffect, useState } from 'react';
import "../stylesheets/map.css";
import { ReactSVG } from "react-svg";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

export default () => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <>
    <div className="main-container">
        <div className="map-main-panel" >
        <div style={{display:"flex",flexDirection:"row",alignItems: "center"}}>
        <Sidebar className="sideBar" collapsed={collapsed} collapsedWidth={"0px"} >
          <Menu>
            <SubMenu label="Charts">
              <MenuItem> Pie charts </MenuItem>
              <MenuItem> Line charts </MenuItem>
            </SubMenu>
            <MenuItem> Documentation </MenuItem>
            <MenuItem> Calendar </MenuItem>
          </Menu>
        </Sidebar>
        <ReactSVG onClick={() => setCollapsed(!collapsed)}src='./tab.svg' style={{width:"50px", zIndex: "100"}}>SVG AREA</ReactSVG>
        </div>
        <div id="mapWrap">
        <div id="mapContainer">
        <iframe width="100%" height="100%" src="https://www.openstreetmap.org/export/embed.html?bbox=127.08180248737337%2C37.319532987776675%2C127.08387047052386%2C37.321023990244015&amp;layer=mapnik" style={ {border : "1px solid black"}}></iframe>
        </div>
        </div>
        </div>
  </div>
    </>
)  
}