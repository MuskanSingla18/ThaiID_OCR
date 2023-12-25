# OCR Scanning Project

This project is a web application for OCR (Optical Character Recognition) scanning of Thai identification cards.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
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
