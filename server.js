const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to get submissions
app.get('/submissions', (req, res) => {
    fs.readFile('submissions.json', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data' });
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint to add a new submission
app.post('/submissions', (req, res) => {
    const newSubmission = req.body;
    fs.readFile('submissions.json', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data' });
        }
        const submissions = JSON.parse(data);
        submissions.push(newSubmission);
        fs.writeFile('submissions.json', JSON.stringify(submissions), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to save data' });
            }
            res.status(201).json({ message: 'Submission added successfully' });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
