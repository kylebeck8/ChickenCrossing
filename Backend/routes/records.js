var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  const url = "mongodb+srv://Ryan:database@chickencluster-ygphw.mongodb.net/test?retryWrites=true"
  var MongoClient = require('mongodb').MongoClient;
  var myDBO;

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if(err) throw err
    console.log("Database opened!");
    myDBO = db.db("ChickenBase");
    console.log("Databse obj is " + myDBO);

    let result = myDBO.collection("scores").find();

    result.toArray(function(err, result) {
      if (err)
        throw err;

      var swapped;
      do {
        swapped = false;
        for (var i=0; i < result.length-1; i++) {
            if (result[i].score > result[i+1].score) {
                var temp = result[i];
                result[i] = result[i+1];
                result[i+1] = temp;
                swapped = true;
            }
        }
      } while (swapped);

      res.json(result);
    });
  });
});

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
