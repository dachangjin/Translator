var express = require('express');
var router = express.Router();
const tencentcloud = require("tencentcloud-sdk-nodejs-tmt");
const { txSecretId, txSecretKey } = require("./../const");

const TmtClient = tencentcloud.tmt.v20180321.Client;

const clientConfig = {
    credential: {
        secretId: txSecretId,
        secretKey: txSecretKey,
    },
    region: "ap-chongqing",
    profile: {
        httpProfile: {
        endpoint: "tmt.tencentcloudapi.com",
        },
    },
};

const client = new TmtClient(clientConfig);



router.post('/', function(req, resp, next) {
    const body = req.body
    const params = {
        "Source": body.sourceLanguageCode,
        "Target": body.targetLanguageCode,
        "ProjectId": 1298851,
        "SourceTextList": body.contents
    };
    client.TextTranslateBatch(params).then(
      (data) => {
        if (data.TargetTextList) {
            const results = []
            data.TargetTextList.forEach(text => {
                results.push({
                    "translatedText": text
                })
            });
            resp.json({
                translations: results
            })
        } else {
            resp.status(500).json(data.Error)
            console.error("error", data.Error);
        }
      },
      (err) => {
        console.error("error", err);
        resp.status(500).json({ error: 'An error occurred during translation' });
      }
    );
});

/*

{
    "RequestId": "55f89d5d-584a-498f-bf36-e0bf7b764069",
    "Source": "en",
    "Target": "zh",
    "TargetTextList": [
        "华生医生，过来！",
        "给我拿点咖啡来！"
    ]
}
{
  "Response": {
    "Error": {
      "Code": "MissingParameter",
      "Message": "请求缺少必传参数 `ProjectId` 。"
    },
    "RequestId": "cc115504-99a6-4d46-b5b9-fa328efe0df3"
  }
}
*/
  
module.exports = router;