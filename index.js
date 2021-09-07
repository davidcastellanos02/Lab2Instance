//const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
import fetch from 'node-fetch'
const express = require('express')
const app = express()
const multer  = require('multer')
const upload = multer({ storage: multer.memoryStorage() })
const Jimp = require('jimp');

app.get('/', (req, res) =>{
    res.sendFile(__dirname+'/src/index.html')
})

app.post('/process', upload.single('uploaded_file'), function (req, res, next) {
    try{
    process(req.file.buffer)
    res.sendFile(__dirname+'/uploads/result.jpg')
    }catch(err){

    }
})

async function process(buffer){
    const apiURL = 'https://goquotes-api.herokuapp.com/api/v1/random?count=1'
    const response = await fetch(apiURL)
    const json = await response.json()
    const text = json.quotes[0].text
    const author = json.quotes[0].author
    Jimp.read(buffer)
    .then(image => {
        Jimp.loadFont(Jimp.FONT_SANS_16_BLACK).then(font => {
            const x = image.bitmap.width - (image.bitmap.width*0.99)
            const yt = image.bitmap.height - (image.bitmap.height*0.30)
            const ya = image.bitmap.height - (image.bitmap.height*0.20)
            image.print(font, x, yt, text, (image.bitmap.width - (image.bitmap.width*0.10)))
            image.print(font, x, ya, author, (image.bitmap.width - (image.bitmap.width*0.10)))
            image.write(__dirname+'/uploads/result.jpg')
        })
    })
}

app.listen(3021)