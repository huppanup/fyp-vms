import React from "react";
import { useLocation } from "react-router-dom";
import { useVenue } from "../LocationContext";
import { FaEllipsisV } from "react-icons/fa";
import Modal from "react-modal";

import VenueData from '../VenueDataHandler';

const customModalStyles = {
    overlay: {
      backgroundColor: " rgba(0, 0, 0, 0.4)",
      width: "100%",
      height: "100vh",
      zIndex: "100",
      position: "fixed",
      top: "0",
      left: "0",
      margin: "auto"
    },
    content: {
      width: "350px",
      height: "180px",
      zIndex: "150",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "10px",
      boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
      backgroundColor: "white",
      justifyContent: "center",
      overflow: "auto",
      margin: "auto"
    },
  };

const constraintItemStyle = {
    display: "flex",
    padding: "10px",
    height: "50px",
    gap: "15px",
    borderRadius : "10px",
    boxShadow: "0 2px 3px #5f5f5f43"
}

const optionStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent:"center",
    flex: "1",
    flexGrow: "0",
    flexShrink:"0"
}

const circle = {
    height:"100%",
    aspectRatio:"1/1",
    boxShadow: "0 2px 3px #5f5f5f43",
    borderRadius: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent:"center",
    fontWeight: "bolder",
}

const listContainerStyle = {
    display: "flex",
    gap: "10px",
    flexDirection:"column",
    width: "100%",
    padding: "10px 5px",
    flex: "1",
    boxSizing:"border-box"
};

const constraintStyle = {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    width: "200px",
    overflow: "hidden"
}

const constraintTextStyle = {
    flex: "1",
    whiteSpace:"nowrap",
    overflow: "hidden",
    textOverflow:"ellipsis",
    fontSize: "14px"
}

export default (props) => {
    const [constraintsInfo, setConstraintsInfo] = React.useState({});
    const { venueID, floor, dataHandler } = useVenue();
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    React.useEffect(() => {
        if (venueID === null || floor === null) return;
        dataHandler.getAllConstraints(venueID, floor).then((data) => setConstraintsInfo(data));
    },[venueID, floor]);

    const handleConstraintEdit = (type, id, x, y) => {
        console.log(id);
        dataHandler.editConstraint(venueID, floor, type, id, x, y).then((data) => {
            console.log(data);
        })
    };

    function ConstraintItem({type, id, x, y}){
        return (
            <div style={constraintItemStyle} id={id}>
            { type === "in" ? <div style={Object.assign({}, circle, {color:"#003366", backgroundColor:"white"})}>IN</div> : <div style={Object.assign({}, circle, {color:"white", backgroundColor:"#003366"})}>OUT</div> 
            } <div style={constraintStyle}><div style={constraintTextStyle}>{x}</div><div style={constraintTextStyle}>{y}</div></div><div  style={optionStyle} ><FaEllipsisV onClick={() => setIsModalOpen(true)}/></div>
            </div>
        )
    }
    
    return (
        <div style={listContainerStyle}>
            <Modal
                  isOpen={isModalOpen}
                  setModalOpen={setIsModalOpen}
                  ariaHideApp={false}
                  style={customModalStyles}
                  contentLabel="Cloud Upload Form"
                  shouldCloseOnOverlayClick={false}
                >
                  <div>Constraint Edit</div>
                  <div className="upload-buttons">
                    <button className="upload-close" onClick={() => setIsModalOpen(false)}>Close</button>
                    <button className="upload" onClick={() => setIsModalOpen(false)}>Upload</button>
                  </div>
            </Modal>
            {
            constraintsInfo && constraintsInfo.in &&
                constraintsInfo.in.map((item) => (
                    <ConstraintItem type="in" key={"in" + item.id} id={item.id} x={item.x} y={item.y} />
                ))
            }
            {
            constraintsInfo && constraintsInfo.out &&
                constraintsInfo.out.map((item) => (
                    <ConstraintItem type="out" key={"out" + item.id} id={item.id} x={item.x} y={item.y} />
                ))
            }
        </div>
    );
}
// TODO: Long messages overflow the popup body.