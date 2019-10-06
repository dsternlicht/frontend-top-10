const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const engine = require('ejs-locals');
const fs = require('fs');
const moment = require('moment');

function chunk(str, n) {
  var ret = [];
  var i;
  var len;

  for(i = 0, len = str.length; i < len; i += n) {
     ret.push(str.substr(i, n))
  }

  return ret
};

// Set the view engine to ejs
app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const listings = [];

  fs.readdirSync('./toptens/').forEach(file => {
    const dateName = file.replace('.json', '');
    const momentDate = moment(dateName, 'DDMMYY');
    if (file.indexOf('json') < 0) {
      return;
    }

    listings.push({
      title: momentDate.format('DD.MM.YY'),
      path: dateName,
      date: momentDate.format('X')
    });
  });

  listings.sort((a, b) => {
    return b.date - a.date;
  });

  res.render('home', { title: 'Homepage', listings });
});

app.get('/ninja', (req, res) => {
  res.render('ninja');
});

app.get('/:dateFolder', (req, res) => {
  const { dateFolder } = req.params;
  const filePath = `./toptens/${dateFolder}.json`;

  if (!fs.existsSync(filePath)) {
    res.sendStatus(404);
    return;
  }

  const data = JSON.parse(fs.readFileSync(filePath));
  
  res.render('single', { 
    title: data.title, 
    recs: data.recs, 
    baseImagePath: `/public/images/${dateFolder}` 
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`)
});