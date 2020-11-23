const express = require('express');
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const app = express();

app.get('/', function (req, res) {
    res.json({ message: 'welcome' })
});

const storage = multer.diskStorage({
    // path folder hasil upload kita
    destination: (_req, _file, cb) => {
        cb(null, 'images/')
    },
    // rename file kita
    filename: (_req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})
const fileFilter = (req, file, cb) => {
    // validasi hanya boleh jpeg atau png
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('allowed type jpeg or png'));
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter })

app.post('/', upload.single('gambar'), function (req, res) {
    if(req.file) res.json({ message: req.file })
    res.json({ message: 'no file selected' })
});

app.delete('/:id', function (req, res) {
    // check apakah file ada atau tidak
    if(fs.existsSync(`images/${req.params.id}`)){
        fs.unlink(`images/${req.params.id}`,() => {
            res.json({ message: 'file deleted' })
        })
    }else {

        res.json({ message: 'file not exists' })
    } 
});

app.use(function (req, res) {
    res.json({ message: 'not found' })
});

app.listen(3000, () => {
    console.log(`app running in port 3000`)
})

module.exports = app;