import React from "react";
import { useAuth } from "../AuthContext";
import { useVenue } from "../LocationContext";
import { FaEllipsisV } from "react-icons/fa";
import Modal from "react-modal";
import Popup from "../components/popup";

import VenueData from '../VenueDataHandler';
import { addConstraintsCricles, removeCircles } from "../leaflet";
import { remove } from "firebase/database";

const customModalStyles = {
    overlay: {
      backgroundColor: " rgba(0, 0, 0, 0.4)",
      width: "100%",
      height: "100vh",
      zIndex: "100",
      position: "fixed",
      top: "0",
      left: "0",
    },
    content: {
      width: "350px",
      height: "250px",
      zIndex: "150",
      position: "fixed",
      top: "40%",
      left: "40%",
      transform: "translate(-50%, -50%)",
      borderRadius: "10px",
      boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
      backgroundColor: "white",
      justifyContent: "center",
      overflow: "auto",
      margin: "auto",
      textAlign: "center"
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
    const [selectedConstraint, setSelectedConstraint] = React.useState({ type: '', id: '', x: '', y: '', fullPath: '' });
    const [inputX, setInputX] = React.useState('');
    const [inputY, setInputY] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');
    const [popupOpen, setPopupOpen] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [inCircles, setInCircles] = React.useState([]);
    const [outCircles, setoutCircles] = React.useState([]);
    const {isAdmin} = useAuth();

    React.useEffect(() => {
        if (venueID === null || floor === null) return;
        dataHandler.getAllConstraints(venueID, floor).then((data) => {
            setConstraintsInfo(data);
            removeCircles(props.map);
            addCircles(data);
        });
    },[venueID, floor]);
    
    const handleModalOpen = (type, id, x, y, fullPath) => {
        setSelectedConstraint({ type, id, x, y, fullPath });
        setInputX("");
        setInputY("");
        setErrorMessage("");
        setIsModalOpen(true);
    }

    const addCircles = (data) => {
        let inCirclesArray = [];
        let outCirclesArray = [];
        if (data["in"]) {
            data["in"].map((item) => {
            let circle = addConstraintsCricles(props.map, props.imageBounds?.transformation, item.x, item.y, "in");
            inCirclesArray.push(circle);
            });
        };
        if (data["out"]) {
            data["out"].map((item) => {
            let circle = addConstraintsCricles(props.map, props.imageBounds?.transformation, item.x, item.y, "out");
            outCirclesArray.push(circle);
            });
        };
        setInCircles(inCirclesArray);
        setoutCircles(outCirclesArray);
    };

    const handleConstraintEdit = () => {
        if (isNaN(parseFloat(inputX)) || isNaN(parseFloat(inputY))) {
            setErrorMessage("Please ensure that your input is a number.");
            return;
        } else if (parseFloat(inputX) < 0 || parseFloat(inputY) < 0) {
            setErrorMessage("Input number should not be negative.")
            return;
        }
        const { type, id, x, y, fullPath } = selectedConstraint;
        dataHandler.editConstraint(venueID, floor, type, id, fullPath, x, y, inputX, inputY).then((data) => {
            setMessage(data);
            setIsModalOpen(false);
            setPopupOpen(true);
            dataHandler.getAllConstraints(venueID, floor).then((data) => {
                setConstraintsInfo(data);
                removeCircles(props.map);
                addCircles(data);
            });
        })
        .catch((error) => {
            console.error(error);
            setMessage(error.message);
            setIsModalOpen(false);
            setPopupOpen(true);
        });
    };

    function ConstraintItem({type, id, x, y, fullPath}){
        return (
            <div style={constraintItemStyle} id={id}>
            { type === "in" ? <div style={Object.assign({}, circle, {color:"#003366", backgroundColor:"white"})}>IN</div> : <div style={Object.assign({}, circle, {color:"white", backgroundColor:"#003366"})}>OUT</div> 
            } <div style={constraintStyle}><div style={constraintTextStyle}>{x}</div><div style={constraintTextStyle}>{y}</div></div><div  style={optionStyle} >{isAdmin === 1 && <FaEllipsisV onClick={() => handleModalOpen(type, id, x, y, fullPath)}/>}</div>
            </div>
        )
    }
    
    return (
        <div style={listContainerStyle}>
            <Popup modalOpen={popupOpen} setModalOpen={setPopupOpen} message={message} navigateTo={false} />
            <Modal
                  isOpen={isModalOpen}
                  setModalOpen={setIsModalOpen}
                  ariaHideApp={false}
                  style={customModalStyles}
                  contentLabel="Constraint Edit"
                  shouldCloseOnOverlayClick={false}
                >
                  <h3>Constraint Edit</h3>
                  <label style={{ display: 'block', marginTop: '30px', marginBottom: '10px' }}>
                    x: <input type="text" value={inputX} onChange={(event) => setInputX(event.target.value)}/>
                  </label>
                  <label style={{ display: 'block' , marginBottom: '30px' }}>
                    y: <input type="text" value={inputY} onChange={(event) => setInputY(event.target.value)}/>
                  </label>
                  <div className="upload-buttons" style={{ bottom: "10px", display: "flex", justifyContent: "center"}}>
                    <button className="upload-close" onClick={() => setIsModalOpen(false)}>Close</button>
                    <button className="upload" onClick={handleConstraintEdit}>Update</button>
                  </div>
                  { errorMessage && (
                    <p style={{color: "red", marginTop:"10px"}} className="error-message">{errorMessage}</p>
                  )}
            </Modal>
            {
            constraintsInfo && constraintsInfo.in &&
                constraintsInfo.in.map((item) => (
                    <ConstraintItem type="in" key={"in" + item.id} id={item.id} x={item.x} y={item.y} fullPath={item.fullPath} />
                ))
            }
            {
            constraintsInfo && constraintsInfo.out &&
                constraintsInfo.out.map((item) => (
                    <ConstraintItem type="out" key={"out" + item.id} id={item.id} x={item.x} y={item.y} fullPath={item.fullPath} />
                ))
            }
        </div>
    );
}