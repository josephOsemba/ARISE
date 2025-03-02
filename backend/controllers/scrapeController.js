const { PythonShell } = require('python-shell');

exports.scrapeWebsite = async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    let options = {
        mode: 'text',
        pythonPath: 'python', // Ensure this points to the correct Python version
        scriptPath: './scripts',
        args: [url] // Pass the URL to the Python script
    };

    PythonShell.run('scraper.py', options, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        try {
            res.json(JSON.parse(results[0])); // Parse JSON from Python
        } catch (parseError) {
            res.status(500).json({ error: "Invalid JSON response from Python" });
        }
    });
};
