var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  const url = "mongodb+srv://Ryan:database@chickencluster-ygphw.mongodb.net/test?retryWrites=true"
  var MongoClient = require('mongodb').MongoClient;
  var myDBO;

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if(err) throw err
    console.log("Database opened!");
    myDBO = db.db("ChickenBase");
    console.log("Databse obj is " + myDBO);

    console.log(req.body);

    const name = req.body.name;
    const score = req.body.score;

    const record = {
      name: name,
      score: score
    };
    myDBO.collection("scores").insertOne(record);
  });

    const resp = {
      success: true
    };
    res.json(resp);
});

module.exports = router;
