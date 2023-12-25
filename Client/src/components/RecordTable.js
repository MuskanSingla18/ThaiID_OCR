// client/src/components/RecordsTable.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RecordTable.css'; 
import EditModal from "../components/EditModal.js"

    const RecordsTable = () => {
    const [records, setRecords] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [editedId, setEditedId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('All');
    // Fetch records from the server on component mount
    useEffect(() => {
      const fetchRecords = async () => {
        try {
          const response = await axios.get('http://localhost:5000/data');

          const activeRecords = response.data.filter((record) => record.status === "Valid" || record.status === "success");
            setRecords(activeRecords);
        } catch (error) {
          console.error('Error fetching records:', error);
        }
      };
  
      fetchRecords();
    }, []); // Empty dependency array to run this effect only once
  
    // Set up Server-Sent Events (SSE)
    useEffect(() => {
      const eventSource = new EventSource('http://localhost:5000/events');
  
      eventSource.onmessage = (event) => {
        const newRecord = JSON.parse(event.data);
        setRecords((prevRecords) => [newRecord, ...prevRecords]);
      };
  
      eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        eventSource.close();
      };
  
      return () => {
        eventSource.close();
      };
    }, []);
  
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/data/${id}`);
            
            const fetchRecords = async () => {
              try {
                const response = await axios.get('http://localhost:5000/data');
      
                const activeRecords = response.data.filter((record) => record.status === "Valid" || record.status === "success");
                  setRecords(activeRecords);
              } catch (error) {
                console.error('Error fetching records:', error);
              }
            };
        
            fetchRecords();
        } catch (error) {
          console.error('Error deleting record:', error);
        }
    };

    const handleEdit = (id) => {
        // Set edit mode to true and initialize edited data
        setEditMode(true);
        setEditedId(id);
        const recordToEdit = records.find((record) => record._id === id);
        setEditedData({
            identification_number: recordToEdit.identification_number,
            name: recordToEdit.name,
            last_name: recordToEdit.last_name,
            date_of_birth: recordToEdit.date_of_birth,
            date_of_issue: recordToEdit.date_of_issue,
            date_of_expiry: recordToEdit.date_of_expiry,
         });

        setShowModal(true);
    };

    const closeModal = () => {
        // Close the modal
        setShowModal(false);
        setEditMode(false);
        setEditedData({});
    };
    
      // Handle apply edit
    const handleApplyEdit = async () => {
        try {
            const updatedFields = { ...editedData }; // Copy editedData to avoid state mutation
            const response = await axios.put(`http://localhost:5000/data/${editedId}`, updatedFields);
      
            // Update the state with the updated record
            setRecords((prevRecords) =>
              prevRecords.map((record) =>
                record._id === editedId ? { ...record, ...response.data } : record
              )
            );
      
            // Reset edit mode and clear edited data
            setEditMode(false);
            setEditedData({});
          } catch (error) {
            console.error('Error updating record:', error);
          }
    };

    const formatTimestamp = (timestamp) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        const formattedDate = new Date(timestamp).toLocaleDateString('en-US', options);
        return formattedDate;
    };

    const handleStatusChange = (e) => {
      setSelectedStatus(e.target.value);
      const fetchRecords = async () => {
        try {
          const response = await axios.get('http://localhost:5000/data/:selectedStatus');
          setRecords(response.data);
        } catch (error) {
          console.error('Error fetching records:', error);
        }
      };
  
      fetchRecords();
    };

  return (
    <div>
      <h2 className="heading">Scanned Records</h2>
      <div className="filter-section">
        <label>Status:</label>
        <select value={selectedStatus} onChange={handleStatusChange}>
          <option value="All">All</option>
          <option value="Valid">Valid</option>
          <option value="Invalid">Invalid</option>
        </select>
      </div>
      <ul className="records-list">
        {records.map((record, index) => (
            <li key={record._id} className="record-box">
                <div className="record-content">
                    <div className="record-header">
                        <strong>Record {index + 1}:</strong>
                        <span className="timestamp">{formatTimestamp(record.timestamp)}</span>
                        <span className={`status ${record.status.toLowerCase()}`}>{"Status: " + record.status}</span>
                    </div>
                    <pre>
                        {'{'}
                        <br />
                        {'    identification_number: ' + record.identification_number + ','}
                        <br />
                        <br />
                        {'    name: ' + record.name + ','}
                        <br />
                        <br />
                        {'    last_name: ' + record.last_name + ','}
                        <br />
                        <br />
                        {'    date_of_birth: ' + record.date_of_birth + ','}
                        <br />
                        <br />
                        {'    date_of_issue: ' + record.date_of_issue + ','}
                        <br />
                        <br />
                        {'    date_of_expiry: ' + record.date_of_expiry + ','}
                        <br />
                        {'}'}
                    </pre>

                    {editMode && editedId && showModal && (
                        <EditModal
                            editedData={editedData}
                            setEditedData={setEditedData}
                            handleApplyEdit={handleApplyEdit}
                            closeModal={closeModal}
                        />
                    )}

                    <button className="edit-button" onClick={() => handleEdit(record._id)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(record._id)}>Delete</button>
                </div>
            </li>
        ))}
      </ul>
    </div>
  );
};

export default RecordsTable;
