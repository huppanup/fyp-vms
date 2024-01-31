import React from 'react';
import "../stylesheets/cloud.css";


export default () => {
    

  return (
    <>
    <div className="main-container">
        <div className="cloud-main-panel">
        <iframe width="100%" height="100%" src="https://www.openstreetmap.org/export/embed.html?bbox=127.08180248737337%2C37.319532987776675%2C127.08387047052386%2C37.321023990244015&amp;layer=mapnik" style={ {border : "1px solid black"}}></iframe>
        </div>
  </div>
    </>
)  
}