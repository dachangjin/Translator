const express = require('express');
const router = express.Router();
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');
const { msKey } = require('./../const');

let key = msKey;
let endpoint = "https://api.cognitive.microsofttranslator.com";

let location = "eastus";

router.post('/', function(req, resp, next) {
    const body = req.body
    const contents = body.contents.map(text => {return {text}})
    axios({
        baseURL: endpoint,
        url: '/translate',
        method: 'post',
        headers: {
            'Ocp-Apim-Subscription-Key': key,
             // location required if you're using a multi-service or regional (not global) resource.
            'Ocp-Apim-Subscription-Region': location,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        params: {
            'api-version': '3.0',
            'from': body.sourceLanguageCode,
            'to': body.targetLanguageCode
        },
        data: contents,
        responseType: 'json'
    }).then(function(response){
        const result = response.data.map(item => {return {translatedText :item["translations"][0].text}})
        resp.json({
            translations: result
        })
    }).catch(err => {
        console.error("error", err);
        resp.status(500).json({ error: 'An error occurred during translation' });
    })
});
  
module.exports = router;