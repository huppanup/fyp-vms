import React from "react";
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

const customStyles = {
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
    },
  };

export default ({modalOpen, setModalOpen, message, navigateTo}) => {
    const navigate = useNavigate();
    return (
        <Modal
          isOpen={modalOpen}
          onRequestClose={() => setModalOpen(false)}
          style={customStyles}
          ariaHideApp={false}
          contentLabel="Pop up Message"
          shouldCloseOnOverlayClick={true}
        >
        <div className="popup-body" style={{display: "flex", height: "140px",margin:"auto", color: "#434343", fontSize: "14px", verticalAlign:"middle", textAlign:"center", alignItems: "center", justifyContent:"center"}}>
            {message}
        </div>
        <div className="popup-footer" style={{height: "35px", textAlign:"center", verticalAlign:"center"}}><button className="login-button" onClick={ () => {
          if (navigateTo) {
            navigate(navigateTo);
            setModalOpen(false);
          } else {
            setModalOpen(false);
          }
        }} style={{width: "100px", textAlign:"center", marginTop: "0"}}>CLOSE</button></div>
        </Modal>
    );
}