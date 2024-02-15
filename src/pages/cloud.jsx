import React from "react";
import { FaStar, FaCaretDown, FaFolder, FaFile, FaArrowDown, FaArrowLeft, FaUpload, FaTrash} from "react-icons/fa";
import { useEffect, useState } from "react";
import { getStorage, ref, listAll, getDownloadURL, getMetadata, uploadBytes, deleteObject } from "firebase/storage";
import "../stylesheets/cloud.css";
import "react-dropdown/style.css";
import Popup from "../components/popup";
import Dropdown from "react-dropdown";
import Modal from "react-modal";

export default () => {
  const storage = getStorage();
  const [files, setFiles] = useState([]);
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState("");
  const [currentFolder, setCurrentFolder] = useState("");
  const [checkedItems, setCheckedItems] = useState({});
  const [selectAll, setSelectAll] = useState(false);
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [message, setMessage] = useState("");

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
      width: "400px",
      height: "400px",
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
    return listAll(listRef).then((res) => {
      const folderList = res.prefixes.map((prefix) => ({
        ref: prefix,
        isFolder: true,
      }));

      const fileList = res.items.map((item) => ({
        ref: item,
        isFolder: false,
      }));

      const formattedFiles = folderList.concat(fileList).map((file) => {
        const fileURLPromise = file.isFolder
          ? Promise.resolve(null)
          : getDownloadURL(file.ref);
        if (!file.isFolder) {
          return Promise.all([fileURLPromise, getMetadata(file.ref)]).then(
            ([fileURL, metadata]) => ({
              id: file.ref.name,
              data: {
                filename: file.ref.name,
                fileURL: fileURL,
                size: metadata.size,
                timestamp: metadata.updated,
                isFolder: file.isFolder,
              },
            })
          );
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

  useEffect(() => {
    const storageRef = ref(storage);

    listAll(storageRef)
      .then((res) => {
        const fetchedVenueNames = res.prefixes.map((prefix) => {
          const formattedName = prefix.name.replace(/_/g, " ");
          return formattedName;
        });
        setVenues(fetchedVenueNames);
      })
      .catch((error) => {
        console.error("Error fetching venue names:", error);
      });
  }, []);

  useEffect(() => {
    if (venues.length > 0) {
      if (!selectedVenue) setSelectedVenue(venues[0]);
      const reformattedName = selectedVenue.replace(/ /g, "_");
      const listRef = ref(storage, reformattedName);
      setCurrentFolder(reformattedName);
      fetchFiles(listRef)
        .then((formattedFiles) => {
          setFiles(formattedFiles);
        })
        .catch((error) => {
          console.error("Error fetching files:", error);
        });
    }
  }, [venues, selectedVenue]);

  const changeBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const handleFolderClick = (folderId) => {
    const folderRef = ref(storage, folderId);
    setCurrentFolder(folderId);
    fetchFiles(folderRef)
      .then((formattedFiles) => {
        setFiles(formattedFiles); // Replace previous files with the new fetched files
      })
      .catch((error) => {
        console.error("Error fetching files for folder:", error);
      });
  };

  const handlePreviousClick = () => {
    const lastIndex = currentFolder.lastIndexOf("/");
    if (lastIndex != -1) {
      const prevFolder = currentFolder.slice(0, lastIndex);
      setCurrentFolder(prevFolder);
      const previousRef = ref(storage, prevFolder);
      fetchFiles(previousRef)
        .then((formattedFiles) => {
          setFiles(formattedFiles); // Replace previous files with the new fetched files
        })
        .catch((error) => {
          console.error("Error fetching files for folder:", error);
        });
    }
  };

  const uploadFile = () => {
    if (selectedFile != null) {
      const file = selectedFile;
      const fileLocation = currentFolder + "/" + file.name;
      const storageRef = ref(storage, fileLocation);
      uploadBytes(storageRef, file)
        .then((snapshot) => {
          console.log("Uploaded a blob or file!");
          closeModal();
          setMessage("Uploaded successfully!");
          setPopupOpen(true);
          const folderRef = ref(storage, currentFolder);
          fetchFiles(folderRef).then((formattedFiles) => {
            setFiles(formattedFiles);
          })
          .catch((error) => {
            console.error("Error fetching files for folder:", error);
          });
        })
        .catch((error) => {
          console.error("Error uploading files:", error);
          closeModal();
          setMessage("Error uploading files: " + error);
          setPopupOpen(true);
        });
    }
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const deleteFile = () => {
    const filesToDelete = Object.entries(checkedItems)
    .filter(([filename, isChecked]) => isChecked)
    .map(([filename]) => filename);

    const deletePromises = filesToDelete.map((file) => {
      const deleteRef = ref(storage, currentFolder + "/" + file);
      return deleteObject(deleteRef);
    });
  
    Promise.all(deletePromises)
      .then(() => {
        setCheckedItems({});
        setMessage("Deleted successfully!");
        setPopupOpen(true);
        const folderRef = ref(storage, currentFolder);
        fetchFiles(folderRef)
          .then((formattedFiles) => {
            setFiles(formattedFiles);
          })
          .catch((error) => {
            console.error("Error fetching files for folder:", error);
          });
      })
      .catch((error) => {
        setMessage("Error deleting files: " + error);
        setPopupOpen(true);
      });
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    setCheckedItems((prevState) => {
      const updatedItems = {};
      files.forEach((file) => {
        if (!file.data.isFolder) updatedItems[file.data.filename] = checked;
      });
      return updatedItems;
    });
  };
  
  const handleCheckBox = (e, filename) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [filename]: e.target.checked,
    }));
  };

  return (
      <div className="cloud-container">
      <Popup modalOpen={popupOpen} setModalOpen={setPopupOpen} message={message} navigateTo={false} />
          <div className="cloud-body">
            <div className="cloud-header">
              <h2 className="folder-path">
                <FaArrowLeft size={20} className="arrow-left" onClick={() => handlePreviousClick()} />
                {"/" + currentFolder}
              </h2>
              <div className="button-container">
                {
                  Object.values(checkedItems).includes(true) && (
                    <button className="upload-button" onClick={deleteFile}> <FaTrash size={15} className="upload" /> Delete Files </button>
                  )
                }
                <button className="upload-button" onClick={openModal}> <FaUpload size={15} className="upload" /> Upload Files </button>
                <Modal
                  isOpen={isModalOpen}
                  onRequestClose={() => setIsModalOpen(false)}
                  ariaHideApp={false}
                  style={customModalStyles}
                  contentLabel="Cloud Upload Form"
                  shouldCloseOnOverlayClick={false}
                >
                  <h2>Upload Files</h2>
                  <input type="file" className="upload-file" onChange={handleFileSelect} />
                  <div className="upload-buttons">
                    <button className="upload-close" onClick={closeModal}>Close</button>
                    <button className="upload" onClick={uploadFile}>Upload</button>
                  </div>
                </Modal>
              </div>
          </div>
          <div className="list-container">
          <table id="file-list">
              <thead>
                <tr>
                  <th className="cloud-checkbox-th">
                    <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                    />
                  </th>
                  <th>Name <FaArrowDown size={10} className="arrow-down" /></th>
                  <th>Last Modified <FaArrowDown size={10} className="arrow-down" /></th>
                  <th>File Size <FaArrowDown size={10} className="arrow-down" />
                  </th>
                </tr>
              </thead>
              <tbody>
              {files.map((file) => (
                  <tr key={file.data.filename}>
                    <td className="cloud-checkbox-td">
                      <input
                        type="checkbox"
                        checked={checkedItems[file.data.filename] || false}
                        disabled={file.data.isFolder}
                        onChange={(e) => handleCheckBox(e, file.data.filename)}
                        className="cloud-checkbox"
                      />
                    </td>
                    {file.data.isFolder ? (
                      <td>
                        <a href="#" onClick={() => handleFolderClick(file.data.fileURL)}
                          style={{color: "black", textDecoration: "underline"}}>
                          <FaFolder size={15} className="cloud-folder" />
                          {file.data.filename}
                        </a>
                      </td>
                    ) : (
                      <td>
                        <a href={file.data.fileURL} target="_blank" style={{color: "black", textDecoration: "underline"}}>
                          <FaFile size={15} /> {file.data.filename}
                        </a>
                      </td>
                    )}
                    <td>
                      {file.data.timestamp !== "-" ? new Date(file.data.timestamp).toISOString().split("T")[0] : "-"}
                    </td>
                    <td>
                      {file.data.size !== "-" ? changeBytes(file.data.size) : "-"}
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
            </div>
          </div>
      </div>
  );
};
