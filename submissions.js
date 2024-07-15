const db = require('./firebaseadmin');

module.exports = async (req, res) => {
    console.log(`Received ${req.method} request at ${req.url}`);

    if (req.method === 'GET') {
        try {
            const snapshot = await db.collection('submissions').get();
            const submissions = snapshot.docs.map(doc => doc.data());
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(submissions));
        } catch (error) {
            console.error('Error getting submissions:', error);
            res.status(500).json({ error: 'Failed to get data' });
        }
    } else if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                console.log('Received body:', body);
                const newSubmission = JSON.parse(body);
                console.log('Parsed new submission:', newSubmission);
                await db.collection('submissions').add(newSubmission);
                res.status(201).json({ message: 'Submission added successfully' });
            } catch (error) {
                console.error('Error parsing or adding submission:', error);
                res.status(400).json({ error: 'Invalid JSON' });
            }
        });
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
