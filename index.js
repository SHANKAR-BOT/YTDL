const express = require("express");
const axios = require("axios");
const qs = require("qs");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const searchVideo = async (url) => {
    let { data } = await axios.post("https://ssvid.net/api/ajax/search", qs.stringify({ query: url, vt: "home" }), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://ssvid.net",
            "Referer": "https://ssvid.net/",
            "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
            "X-Requested-With": "XMLHttpRequest"
        }
    });
    return data;
};

const ymp3 = async (url) => {
    let res = await searchVideo(url);
    let { data } = await axios.post("https://ssvid.net/api/ajax/convert", qs.stringify({ vid: res.vid, k: res.links.mp3.mp3128.k }), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://ssvid.net",
            "Referer": "https://ssvid.net/",
            "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
            "X-Requested-With": "XMLHttpRequest"
        }
    });
    return data;
};

const ytmp4 = async (url) => {
    let res = await searchVideo(url);
    let { data } = await axios.post("https://ssvid.net/api/ajax/convert", qs.stringify({ vid: res.vid, k: res.links.mp4.auto.k }), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://ssvid.net",
            "Referer": "https://ssvid.net/",
            "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
            "X-Requested-With": "XMLHttpRequest"
        }
    });
    return data;
};

app.get("/", (req, res) => {
    res.send("YouTube Downloader API is running!");
});

// ✅ **New API to Get Download Link Instead of Direct Download**
app.get("/getDownloadLink", async (req, res) => {
    let { url, format } = req.query;
    if (!url) return res.status(400).json({ error: "URL नहीं हो सकता खाली!" });

    try {
        let result = format === "mp3" ? await ymp3(url) : await ytmp4(url);
        res.json({
            title: result.title,
            download_link: result.dlink,
            format: format
        });
    } catch (err) {
        console.error("Error fetching download link:", err);
        res.status(500).json({ error: "डाउनलोड लिंक प्राप्त करने में विफल" });
    }
});

app.listen(3000, () => console.log("Server चल रहा है port 3000 पर 🚀"));
