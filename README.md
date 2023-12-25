# OCR Scanning Project

This project is a web application for OCR (Optical Character Recognition) scanning of Thai identification cards.

## Hoisting

Server/ Backend created using Node.js is hoisted on Render.
Client/ Frontend created using React.js is hoisted using Vercel.

[Live Website](https://thai-id-cxpg6fl3u-muskansingla18.vercel.app/)


## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Technical Overview](#technical-overview)
  -[OCR Processing](#ocr-processing)
  -[Data Extraction and Structuring](#data-extraction)
  -[User interface](#user-interface)
  -[Database and REST API Endpoints](api-endpoints)
- [Usage](#usage)
  - [File Upload](#file-upload)
  - [Scanned Records](#scanned-records)
- [Server API](#server-api)
  - [GET /data](#get-data)
    - [Query Parameters](#query-parameters)
  - [GET /events](#get-events)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

Before running the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/ocr-scanning-project.git
   
2. Navigate to the project folder

   ```bash
   cd ocr-scanning-project
   
3. Install dependencies

   ```bash
   npm install

4. Start the development server

   ```bash
   npm start

## Technical Processes

### OCR Processing

The Thai ID Card Object Character Recognition (OCR) System is integrated with the Google Vision API, which facilitates the extraction of OCR text in string format.

How OCR Processing Works:

1. **File Upload:**
   - Users can upload images of Thai ID cards through the application interface.
   - The uploaded image is processed by the Google Vision API for OCR.

2. **Google Vision API Integration:**
   - The application requests the Google Vision API, including the uploaded image.
   - The API processes the image and extracts text information using OCR techniques.

3. **Text Output:**
   - The OCR text from the Google Vision API is returned to the application in string format.
   - This text contains relevant information on the Thai ID card, such as identification number, name, date of birth, and other details.

## Data Extraction and Structuring

The Thai ID Card Object Character Recognition System leverages the OpenAI API for parsing the OCR text into a structured data format, which is then returned in JSON.

How Data Extraction Works:
   - The application sends the OCR text to the OpenAI API for further processing.
   - OpenAI's advanced natural language processing capabilities are utilized to understand and structure the unformatted text.
   - The OpenAI API returns the parsed information in a structured JSON format.
   - This structured data includes key details such as identification number, name, date of birth, and other relevant information on the Thai ID card.

## UI Interface

The Thai ID Card Object Character Recognition (OCR) System offers a user-friendly interface for uploading Thai ID card images, processing OCR, and displaying results. The UI provides functionality to view OCR outputs, filter results, and maintain a history of successful and failed OCR operations.

   - Users can upload Thai ID card images in PNG, JPEG, and JPG formats.
   - The UI is designed for ease of use, allowing users to navigate and interact seamlessly.
   - The JSON output of the OCR process is displayed on the UI.
   - Use the filter options to view specific sets of OCR results (All, Success, or Failed).
   - The system keeps a history of OCR operations for reference and analysis.

## Database and Server REST API

MongoDB is the database for storing and retrieving OCR Text and extracted information.

  ###Create a New OCR Record
    -API endpoint is created to add a new record in the database.
    -The record reflects the success or failure status of an OCR process.
    -The data structure includes  OCR result, timestamp, and status (success/failure).

  
  ###Update Existing OCR Data
    - An API endpoint that provides edit functionality.
    - Matches records using ID to update a particular record.
    
  ### Retrieve Exciting data
    - API endpoint to fetch and display OCR data.
    - This endpoint supports filtering options to retrieve specific records based on criteria such as status

  ###Delete OCR Records
    - An API endpoint to delete OCR records from the database based on object ID.


## Usage

### File Upload

The application allows users to upload ID card images for OCR scanning.

### Records List

The "Scanned Records" section displays a table of scanned records. You can view, edit, and delete records. The records are updated in real-time using Server-Sent Events (SSE).

##  Server API

### GET/ data

Get records from the server.

#### Query Parameters

status (optional): Filter records based on status ('All', 'Valid', 'Invalid').
Example:
    ```bash
    GET http://localhost:5000/data?status=Valid


### GET /events

Subscribe to real-time updates using Server-Sent Events (SSE).

## Contributions
  Contributions are welcome!
