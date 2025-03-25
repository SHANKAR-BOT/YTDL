const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// 🔹 Function to shorten URL (TinyURL + Backup is.gd)
const shortenURL = async (longURL) => {
    try {
        let { data } = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longURL)}`);
        if (data.includes("Error")) throw new Error("TinyURL failed");
        return data;
    } catch (error) {
        console.warn("⚠️ TinyURL failed, trying is.gd...");

        // Backup Shortener (is.gd)
        try {
            let { data } = await axios.get(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(longURL)}`);
            return data;
        } catch (backupError) {
            console.error("❌ is.gd failed too!");
            return null;
        }
    }
};

// 🔹 API Endpoint to Generate Short Download Link
app.get("/getShortDownloadLink", async (req, res) => {
    let { url, format } = req.query;
    if (!url) return res.status(400).json({ error: "URL नहीं हो सकता खाली!" });

    try {
        // 🔸 Get actual download link (Replace with your own function)
        let result = format === "mp3" ? await ymp3(url) : await ytmp4(url);
        
        // 🔸 Shorten the download link
        let shortLink = await shortenURL(result.dlink);

        // 🔸 Send response
        res.json({
            title: result.title,
            short_download_link: shortLink || result.dlink, // अगर शॉर्ट लिंक fail हो जाए, तो original भेजेगा
            format: format
        });

    } catch (err) {
        console.error("Error fetching short download link:", err);
        res.status(500).json({ error: "शॉर्ट डाउनलोड लिंक प्राप्त करने में विफल" });
    }
});

// Start server
app.listen(3000, () => console.log("🚀 Server चल रहा है port 3000 पर!"));
