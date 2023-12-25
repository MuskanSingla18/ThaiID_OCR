// EditModal.js
import React from 'react';
import './EditModal.css'; // Create/Edit this CSS file for styling

const EditModal = ({ editedData, setEditedData, handleApplyEdit, closeModal }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Render form inputs based on keys in the editedData */}
        {Object.keys(editedData).map((key) => (
          <div key={key} className="edit-form">
            <label>{key}:</label>
            <input
              type="text"
              value={editedData[key]}
              onChange={(e) => setEditedData((prevData) => ({ ...prevData, [key]: e.target.value }))}
            />
          </div>

        ))}
            <button className="apply-button" onClick={handleApplyEdit}>
                Apply
            </button>
            <button className="close-modal-button" onClick={closeModal}>
                Close
            </button>
        
      </div>
    </div>
  );
};

export default EditModal;
