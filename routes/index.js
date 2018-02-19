const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');

const client = new pg.Client({
  user: 'pieremy',
  host: 'rds-postgresql-pieremy.cwtv6vhory11.eu-west-3.rds.amazonaws.com',
  database: 'pieremyDB',
  password: 'B4n4n3$!',
  port: 5432
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/api/medias', (req, res, next) => {
  client.connect().then(() => {
    client.query(`
      INSERT INTO media(url, creatorId, eventId, creationDate) values($1, $2, $3, $4;
    `, 
    [req.body.url, req.body.creatorId, req.body.eventId, new Date()],
    (err, response) => {
      if (err) throw err;
      client.query(`
        SELECT * FROM media WHERE eventId = $1;
      `,
      [req.body.eventId],
      (err, response) => {
        if (err) throw err;
        console.log(response);
        res.send(response);
      });
    })
  }).catch(e => {
    console.error('Connection to PostgreSQL database error : ', e);
    res.status(500).json({success: false, data: e});
  })
});

router.get('/api/medias', (req, res, next) => {
  client.connect().then(() => {
    client.query(`
      SELECT * FROM media WHERE eventId = $1;
    `,
    [req.body.eventId],
    (err, response) => {
      if (err) throw err;
      console.log(response);
      res.send(response);
    });
  }).catch(e => {
    console.error('Connection to PostgreSQL database error : ', e);
    res.status(500).json({success: false, data: e});
  })
});



module.exports = router;
