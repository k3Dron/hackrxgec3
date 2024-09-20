const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());

// Set up multer to handle image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to handle GET requests at root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Image Diagnosis API! Please upload an image via the frontend.');
});

// Route to handle image upload and diagnosis
app.post('/diagnose', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ diagnosis: 'No image uploaded!' });
    }

    try {
        const base64Image = req.file.buffer.toString('base64');
        const response = await axios.post('http://localhost:5001/predict', { image: base64Image });
        const diagnosis = response.data.diagnosis;
        res.json({ diagnosis });

    } catch (error) {
        console.error('Error during diagnosis:', error);
        res.status(500).json({ diagnosis: 'Error during diagnosis' });
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
