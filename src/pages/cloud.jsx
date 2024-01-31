import React from 'react';
import { FaStar, FaCaretDown, FaFolder, FaFile, FaArrowDown } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { getStorage, ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import "../stylesheets/cloud.css";

export default () => {
    const [files, setFiles] = useState([]);
    const storage = getStorage();

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
      
      useEffect(() => {
        const listRef = ref(storage, 'HKUST_fusion');
      
        fetchFiles(listRef)
          .then((formattedFiles) => {
            setFiles(formattedFiles);
            console.log(formattedFiles);
          })
          .catch((error) => {
            console.error('Error fetching files:', error);
          });
      }, []);
      
    const changeBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    const handleFolderClick = (folderId) => {
        console.log(folderId);
        const folderRef = ref(storage, folderId);
        fetchFiles(folderRef)
          .then((formattedFiles) => {
            setFiles(formattedFiles); // Replace previous files with the new fetched files
            console.log(formattedFiles);
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
                        <FaStar className="cloud-star-icon" size={40} />
                        <h1 className="location-name">HKUST Fusion</h1>
                        <FaCaretDown size={20} className="cloud-dropdown"/>
                    </div>
                </div>
                <div className="cloud-body">
                    <div className="cloud-data">
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