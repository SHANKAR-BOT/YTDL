const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// 🔹 Function to shorten the URL using TinyURL API
const shortenURL = async (longURL) => {
    try {
        let { data } = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longURL)}`);
        return data; // Returns short URL
    } catch (error) {
        console.error("Error shortening URL:", error);
        return null; // Returns null if failed
    }
};

// 🔹 API Endpoint to Generate Short Download Link
app.get("/getShortDownloadLink", async (req, res) => {
    let { url, format } = req.query;
    if (!url) return res.status(400).json({ error: "URL नहीं हो सकता खाली!" });

    try {
        // 🔸 Get the actual download link (replace with your actual function)
        let result = format === "mp3" ? await ymp3(url) : await ytmp4(url);
        
        // 🔸 Shorten the download link using TinyURL
        let shortLink = await shortenURL(result.dlink);

        // 🔸 Send response with short link
        res.json({
            title: result.title,
            short_download_link: shortLink || result.dlink, // If shortening fails, send original link
            format: format
        });

    } catch (err) {
        console.error("Error fetching short download link:", err);
        res.status(500).json({ error: "शॉर्ट डाउनलोड लिंक प्राप्त करने में विफल" });
    }
});

// Start the server
app.listen(3000, () => console.log("🚀 Server चल रहा है port 3000 पर!"));
