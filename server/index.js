
// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://Muskan:muskansingla@atlascluster.oqhfer1.mongodb.net/thaiapp?retryWrites=true&w=majority');

const clients = [];
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Add the new client to the clients array
  clients.push(res);

  // Remove the client when the connection is closed
  req.on('close', () => {
    const index = clients.indexOf(res);
    clients.splice(index, 1);
  });
});

function sendSSEMessage(data) {
    const message = JSON.stringify(data);
    clients.forEach((client) => {
      client.res.write(`data: ${message}\n\n`);
    });
  }

const openai = new OpenAI({ apiKey: "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"});
const runPrompt = async (ocrText) => {
    const prompt = `
        Here is the ocr generated text of a Thai ID Card. Hence it contains both English and Thai characters.
        ${ocrText}. Extract the relevant information and convert this OCR text into JSON Parseable format:
  
        {
            "IdentificationNumber": "4 7363 39613 02 7",
            "Name": "Mr. Rotngern",
            "LastName": "Yoopm",
            "DateOfBirth": "31/03/2006",
            "DateOfIssue": "15/09/2020",
            "DateOfExpiry": "05/02/2026"
        }
  
        Make sure you keep the format of the date in date of birth, date of issue, and date of expiry the same as mentioned above.
        Focus while extracting the values , It should not contain any thai letters , Identification number should be all digits.
        Name , LastName should be all english letters. Date of birth , date of expiry and date of issue should be dates in this format DD/MM/YYYY.
        Also if values are not available in english try translating them from Thai and resply it in english after conversion.
        Also make sure to remove \n characters as this just indicates next line in string.
        Also, make sure to keep the format of the identification number the same along with spaces. Return JSON object as an output.
    `;
  
    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: prompt }],
            model: "gpt-3.5-turbo",
        });
        return completion.choices[0];
    }   catch (error) {
            console.error('Error from OpenAI API:', error);
        }
  };

  const recordSchema = new mongoose.Schema({
    ocrText: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: "Valid", // You can set the default status as needed
    },
    identification_number: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    date_of_birth: {
        type: String,
        required: true,
    },
    date_of_issue: {
        type: String,
        required: true,
    },
    date_of_expiry: {
        type: String,
        required: true,
    },
});

const Record = mongoose.model('Records', recordSchema);
// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send("Hello Muskan");
  });
  
  // Endpoint to post data
  app.post('/data', async (req, res) => {
    try {
      const { ocrText } = req.body;
      const apiresult = await runPrompt(ocrText);
      const jsonData = JSON.parse(apiresult.message.content);
      //console.log(jsonData);
      const newRecordData = {
        ocrText: ocrText,
        identification_number: jsonData.IdentificationNumber,
        name: jsonData.Name,
        last_name: jsonData.LastName,
        date_of_birth: jsonData.DateOfBirth,
        date_of_issue: jsonData.DateOfIssue,
        date_of_expiry: jsonData.DateOfExpiry,
        status: "Valid"
        }

        Record.create(newRecordData)
    .then(record => {
        console.log('Record inserted successfully:', record);

        clients.forEach((client) => {
            client.write(`data: ${JSON.stringify(record)}\n\n`);
        });

        res.status(201).json({ message: 'Record has been successfully added', record });
    })
    .catch(error => {
        console.error('Error inserting record:', error.message);
        res.status(500).json({ error: 'Record could not be added' });
    });
    
      //res.status(201).json(newRecordData);

    } catch (error) {
        res.status(500).json({ error: 'Record could not be added' });
    }
  });
  
  // Endpoint to update data by ID
  app.put('/data/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedFields = req.body; // Fields to be updated
    
        // Use $set to update only the specified fields
        const result = await Record.findByIdAndUpdate(id, { $set: updatedFields }, { new: true });
    
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  });
  
  // Endpoint to delete data by ID
  app.delete('/data/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Record.findByIdAndUpdate(id, { status: 'Invalid' }, { new: true });
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  });
  
  // Endpoint to retrieve all data
  app.get('/data', async (req, res) => {
    try {
      const result = await Record.find();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Endpoint to retrieve data by status (assuming name is a field in your data)
  app.get('/data/:status', async (req, res) => {
    try {
      const { status } = req.params;
      const result = await Record.find({ status });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
