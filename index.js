const express = require("express")
const axios = require("axios")
const qs = require("qs")
const fs = require('fs')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const searchVideo = async (url) => {
let { data } = await axios.post("https://ssvid.net/api/ajax/search", qs.stringify({ query: url, vt: "home" }), {
headers: {
"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
"Origin": "https://ssvid.net",
"Referer": "https://ssvid.net/",
"User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
"X-Requested-With": "XMLHttpRequest"
}
})
return data
}

const ymp3 = async (url) => {
let res = await searchVideo(url)
let { data } = await axios.post("https://ssvid.net/api/ajax/convert", qs.stringify({ vid: res.vid, k: res.links.mp3.mp3128.k }), {
headers: {
"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
"Origin": "https://ssvid.net",
"Referer": "https://ssvid.net/",
"User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
"X-Requested-With": "XMLHttpRequest"
}
})
return data
}

const ytmp4 = async (url) => {
let res = await searchVideo(url)
let { data } = await axios.post("https://ssvid.net/api/ajax/convert", qs.stringify({ vid: res.vid, k: res.links.mp4.auto.k }), {
headers: {
"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
"Origin": "https://ssvid.net",
"Referer": "https://ssvid.net/",
"User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
"X-Requested-With": "XMLHttpRequest"
}
})
return data
}

app.get("/", (req, res) => {
res.sendFile('index.html', { root: __dirname + '/public' })
})

app.get("/download", async (req, res) => {
let { url, format } = req.query
if (!url) return res.status(400).json("URL tidak boleh kosong")
try {
let result = format === "mp3" ? await ymp3(url) : await ytmp4(url)
let filename = `SatzzDev - ${result.title}.${format}`
let file = fs.createWriteStream(filename)
axios.get(result.dlink, { responseType: "stream" }).then(response => {
response.data.pipe(file)
file.on("finish", () => {
res.download(filename, err => {
if (!err) fs.unlinkSync(filename)
})
})
}).catch(err => {
console.error("Gagal download:", err)
res.status(500).json("Gagal mengunduh file")
})
} catch (err) {
res.status(500).json("Gagal mengambil data")
}
})

app.listen(3000, () => console.log("Server berjalan di port 3000"))
