// client/src/components/FileUpload.js
import React, { useState,useRef } from 'react';
import './FileUpload.css';
import axios from 'axios';
import uploadImage from './upload.png';

const FileUpload = ({ onUpload }) => {
  
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const hiddenFileInput = useRef(null);
  const [insertedRecord, setInsertedRecord] = useState(null);
  

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleClick = event => {
    hiddenFileInput.current.click();
  };

  const handleUpload = async () => {
    if (file) {
      // Read the file and encode it to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result.split(',')[1];
        console.log(base64Data);
        // Call the Google Cloud Vision API for OCR
        const apiKey = process.env.REACT_APP_GOOGLE_VISION_API;
        const apiUrl = 'https://vision.googleapis.com/v1/images:annotate?key=' + apiKey;

        const requestBody = {
          requests: [
            {
              image: {
                content: base64Data,
              },
              features: [
                {
                  type: 'DOCUMENT_TEXT_DETECTION',
                },
              ],
              imageContext: {
                languageHints: ['en', 'th'],
              },
            },
          ],
        };

        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });

          const result = await response.json();
          console.log('OCR Result:', result);

          // Extract OCR text from the result and call the onUpload function
          const ocrText = result.responses[0]?.fullTextAnnotation?.text || '';
          
          try {
            const axiosResponse = await axios.post('http://localhost:5000/data', { ocrText });
            console.log('OCR Text sent to server successfully');
            setUploadStatus('Record has been successfully added!!');
            setInsertedRecord(axiosResponse.data);
            setFile(null);
            onUpload(ocrText)
          } catch (error) {
            console.error('Error sending OCR text to server:', error);
            setUploadStatus('Record could not be added!!');
            setInsertedRecord(null);
            setFile(null);
          }

        } catch (error) {
          console.error('Error performing OCR with Google Cloud Vision API:', error);
          setUploadStatus('Record could not be added!!');
          setInsertedRecord(null);
          setFile(null);
        }
      };

      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="upload-container">
      {file ? (
        <div className="uploaded-file">
          <h3>Selected File:</h3>
          <p>{file.name}</p>
        </div>
        ) : (
        <div className="upload-btn-wrapper">
          <h3>Upload Your ID Card</h3>
          <button className="btn" onClick={handleClick}>
            <img className="image" src={uploadImage} alt="Upload a file" />
          </button>
        </div>
      )}

      <input type="file" accept=".png, .jpg, .pdf" onChange={handleFileChange} className="file-input" ref={hiddenFileInput} />
      
      <div className="upload-btn-wrapper">
        <button className="btn" onClick={handleUpload}>
          {file ? 'Submit' : 'Upload'}
        </button>
      </div>
      
      {uploadStatus && <p>{uploadStatus}</p>}
      <div>
          {insertedRecord && (
          <div>
            <p>Inserted Record:</p>
            <pre>
              {'{'}
              <br />
              {'    identification_number: ' + insertedRecord.record.identification_number + ','}
              <br />
              {'    name: ' + insertedRecord.record.name + ','}
              <br />
              {'    last_name: ' + insertedRecord.record.last_name + ','}
              <br />
              {'    date_of_birth: ' + insertedRecord.record.date_of_birth + ','}
              <br />
              {'    date_of_issue: ' + insertedRecord.record.date_of_issue + ','}
              <br />
              {'    date_of_expiry: ' + insertedRecord.record.date_of_expiry + ','}
              <br />
              {'}'}
            </pre>
        </div>
      )}
      </div>
    </div>
  );
};


export default FileUpload;
