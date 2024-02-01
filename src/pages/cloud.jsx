import React from 'react';
import { FaStar, FaCaretDown, FaFolder, FaFile, FaArrowDown, FaUpload } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { getStorage, ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import "../stylesheets/cloud.css";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import Modal from "react-modal";

export default () => {
    const [files, setFiles] = useState([]);
    const storage = getStorage();
    const [locations, setLocations] = useState([]);
    const [currentFolder, setCurrentFolder] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const customModalStyles = {
      overlay: {
        backgroundColor: " rgba(0, 0, 0, 0.4)",
        width: "100%",
        height: "100vh",
        zIndex: "10",
        position: "fixed",
        top: "0",
        left: "0",
      },
      content: {
        width: "500px",
        height: "500px",
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
        textAlign: "center",
      },
    };

    const fetchFiles = (listRef) => {
        return listAll(listRef)
            .then((res) => {
                const folderList = res.prefixes.map((prefix) => ({
                  ref: prefix,
                  isFolder: true,
                }));

                const fileList = res.items.map((item) => ({
                    ref: item,
                    isFolder: false,
                  }));

                const formattedFiles = folderList.concat(fileList).map((file) => {
                    const fileURLPromise = file.isFolder ? Promise.resolve(null) : getDownloadURL(file.ref);
                    if (!file.isFolder) { 
                        return Promise.all([fileURLPromise, getMetadata(file.ref)]).then(([fileURL, metadata]) => ({
                            id: file.ref.name,
                            data: {
                              filename: file.ref.name,
                              fileURL: fileURL,
                              size: metadata.size,
                              timestamp: metadata.updated,
                              isFolder: file.isFolder,
                            },
                        }));
                    } else {
                        return {
                            id: file.ref.name,
                            data: {
                              filename: file.ref.name,
                              fileURL: file.ref.fullPath,
                              size: "-",
                              timestamp: "-",
                              isFolder: file.isFolder,
                            },
                        };
                    }
                  });
            
                  return Promise.all(formattedFiles);
                });
        };

      const openModal = () => {
        setIsModalOpen(true);
      }

      const closeModal = () => {
        setIsModalOpen(false);
      }

      useEffect(() => {
        const storageRef = ref(storage);
      
        listAll(storageRef)
        .then((res) => {
          const fetchedLocationNames = res.prefixes.map((prefix) => {
            const formattedName = prefix.name.replace(/_/g, ' ');
            return formattedName;
          });
          setLocations(fetchedLocationNames);
        })
        .catch((error) => {
          console.error('Error fetching location names:', error);
        });
      }, []);
      
      useEffect(() => {
        if (locations.length > 0) {
          if (selectedLocation.length == "") setSelectedLocation(locations[0]);
          const reformattedName = selectedLocation.replace(/ /g, "_");
          const listRef = ref(storage, reformattedName);
          setCurrentFolder(reformattedName);
      
          fetchFiles(listRef)
            .then((formattedFiles) => {
              setFiles(formattedFiles);
            })
            .catch((error) => {
              console.error('Error fetching files:', error);
            });
        } 
      }, [locations, selectedLocation]);
      
    const changeBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    const handleFolderClick = (folderId) => {
        const folderRef = ref(storage, folderId);
        setCurrentFolder(folderId);
        fetchFiles(folderRef)
          .then((formattedFiles) => {
            setFiles(formattedFiles); // Replace previous files with the new fetched files
          })
          .catch((error) => {
            console.error('Error fetching files for folder:', error);
          });
    };
    
    return (
        <>
        <div className="main-container">
            <div className="cloud-main-panel">
            <div className="cloud-location">
                <div className="cloud-header">
                    <div className="header-left">
                        <FaStar className="star-icon active" size={40} />
                        <Dropdown className='location-name'
                            options={locations}
                            value={selectedLocation}
                            onChange={(option) => setSelectedLocation(option.value)}
                            placeholder=""
                            controlClassName="myControl"
                            arrowClassName="myArrow"
                        />
                    </div>
                </div>
                <div className="cloud-body">
                    <div className="cloud-data">
                        <div className="cloud-upload">
                          <h2 className="folder-location">{"/" + currentFolder}</h2>
                          <button className='upload-button' onClick={openModal}> <FaUpload size={15} className='upload'/>Upload Files</button>
                          <Modal
                            isOpen={isModalOpen}
                            onRequestClose={() => setIsModalOpen(false)}
                            ariaHideApp={false}
                            style={customModalStyles}
                            contentLabel="Cloud Upload Form"
                            shouldCloseOnOverlayClick={false}
                          >
                          <h2>Upload Files</h2>
                          <button onClick={closeModal}>close</button>
                          </Modal>
                        </div>
                        <table className="cloud-table">
                            <thead>
                            <tr>
                                <th>Name <FaArrowDown size={10} className='arrow-down'/></th>
                                <th>Last Modified <FaArrowDown size={10} className='arrow-down'/></th>
                                <th>File Size <FaArrowDown size={10} className='arrow-down'/></th>
                            </tr>
                            </thead>
                            <tbody>
                            {files.map((file) => (
                                <tr key={file.data.filename}>
                                {file.data.isFolder ? (
                                    <td>
                                    <a href="#" onClick={() => handleFolderClick(file.data.fileURL)} style={{ color: 'black', textDecoration: 'underline' }}>
                                      <FaFolder size={15} className='cloud-folder' /> {file.data.filename}
                                    </a>
                                  </td>
                                ) : (
                                <td>
                                    <a href={file.data.fileURL} target="_blank" style={{ color: 'black', textDecoration: 'underline' }}>
                                      <FaFile size={15} /> {file.data.filename}
                                    </a>
                                </td>
                                )}
                                <td>{file.data.timestamp !== "-" ? new Date(file.data.timestamp).toISOString().split('T')[0] : "-"}</td>
                                <td>{file.data.size !== "-" ? changeBytes(file.data.size) : "-"}</td>
                            </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
      </div>
        </>
    )
}