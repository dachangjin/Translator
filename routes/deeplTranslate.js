const express = require('express');
const router = express.Router();
const axios = require('axios').default;

let baseURL = "https://api.deeplx.org"
let separator = "\r\n\r\n"

router.post('/', function(req, resp, next) {
    const body = req.body
    let text = req.body.contents.join(separator)
    const contents = body.contents.map(text => {return {text}})
    let count = body.contents.count
    axios({
        baseURL: baseURL,
        url: '/translate',
        method: 'post',
        headers: {
            'Content-type': 'application/json',
        },
        data: {
            "source_lang": body.sourceLanguageCode,
            "target_lang": body.targetLanguageCode,
            "text": text
        },
        responseType: 'json'
    }).then(function(response){
        const body = response.data
        if (body.code == 200) {
            let data = body.data
            let texts = data.split(separator)
            if (texts.count != count) {
                resp.status(500).json({ error: 'result sentence count is not equal to source sentence count' });
                return
            }
            const result = texts.map((text) => { return {translatedText: text} })
            resp.json({
                translations: result
            })
        } else {
            console.error("error", data);
            resp.status(500).json({ error: 'An error occurred during translation' });
        }
    }).catch(err => {
        console.error("error", err);
        resp.status(500).json({ error: 'An error occurred during translation' });
    })
});
  
module.exports = router;