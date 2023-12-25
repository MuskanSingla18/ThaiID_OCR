import './App.css';
import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import RecordsTable from './components/RecordTable';


function App() {

  const [ocrResults, setOCRResults] = useState();


  const handleUpload = async (ocrText) => {
    setOCRResults(ocrText);
  };

  console.log(ocrResults);

  return (
    <div className="App">
      <div class="project-heading-container">
  <h2 class="project-heading">Extract ID Details</h2>
</div>
      <FileUpload onUpload={handleUpload} />
      <RecordsTable/>

    </div>
  );
}

export default App;
