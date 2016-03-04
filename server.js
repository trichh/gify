var express = require('express');

var app = express();

app.use(express.static('public'))

app.get('*', function(req, res) {
  res.send('./public/index.html')
})

var server = app.listen(process.env.PORT || 3000, function(){
  console.log('######## Server live on PORT: ', server.address().port);
})