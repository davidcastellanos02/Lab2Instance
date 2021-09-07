const express = require('express')
const app = express()
const multer  = require('multer')
const upload = multer({ storage: multer.memoryStorage() })
const Jimp = require('jimp')
import fetch from 'node-fetch'

app.get('/', (req, res) =>{
    res.sendFile(__dirname+'/src/index.html')
})

app.post('/stats', upload.single('uploaded_file'), function (req, res, next) {
    process(req.file.buffer)
    res.sendFile(__dirname+'/uploads/result.jpg')
})

async function getText(){
    const apiURL = 'https://goquotes-api.herokuapp.com/api/v1/random?count=1'
    const response = await fetch(apiURL)
    const json = await response.json()
    console.log(json)
}

async function process(buffer){
    Jimp.read(buffer)
    .then(image => {
        Jimp.loadFont(Jimp.FONT_SANS_16_BLACK).then(font => {
            const x = image.bitmap.width - (image.bitmap.width*0.85)
            const y = image.bitmap.height - (image.bitmap.height*0.2)
            image.print(font, x, y,"Hello world!")
            image.write(__dirname+'/uploads/result.jpg')
        })
    })
    getText()
}

app.listen(3021)