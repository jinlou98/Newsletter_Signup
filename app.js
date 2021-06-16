const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();
const port = process.env.PORT || 3000;

const apiKey = "0f391543d53c2883bf69c5a918c713b1-us6";
const audienceID = "526ba95e64";

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req, res){
  res.sendFile(__dirname+'/signup.html');
})

app.post('/', function(req,res){
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us6.api.mailchimp.com/3.0/lists/" + audienceID;

  const options = {
    method: "POST",
    auth: "jinlou98:"+apiKey
  }

  const request = https.request(url, options, function(response){

      if (response.statusCode === 200) {
        res.sendFile(__dirname + '/success.html');
      } else {
        res.sendFile(__dirname + '/failure.html');
      }

      response.on("data", function(data){
        console.log(JSON.parse(data));
      })
    })

  request.write(jsonData);
  request.end();

})

app.post('/failure.html', function(req,res){
  res.redirect('/');
})

app.listen(port, function(){
  console.log('Server is running on port ' + port);
})
