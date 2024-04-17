var express = require('express');
var router = express.Router();
const { TranslationServiceClient } = require('@google-cloud/translate')

const translationClient = new TranslationServiceClient();


router.post('/', function(req, resp, next) {
  
    req.body.parent = "projects/windy-ripsaw-397406"
    req.body.mimeType = "text/plain"
    translationClient.translateText(req.body)
    .then((res) => {
        const [response] = res
        resp.json(response)
    })
    .catch((err) => {
      console.error('Translation error:', err);
      resp.status(500).json({ error: 'An error occurred during translation' });
    })
});
  
module.exports = router;