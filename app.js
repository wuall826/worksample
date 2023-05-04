const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const csvParser = require('csv-parser');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html', 'css'] }));

let assets = [];

fs.createReadStream('sampledata.csv')
  .pipe(csvParser())
  .on('data', (data) => assets.push(data))
  .on('end', () => {
    console.log('CSV file successfully processed');
  });

app.get('/', async (req, res) => {
  res.render('main', { assets: JSON.stringify(assets) });
});

app.get('/data/:year', (req, res) => {
  const year = req.params.year;
  const results = [];

  fs.createReadStream('sampledata.csv')
    .pipe(csvParser())
    .on('data', (row) => {
      if (row.Year === year) {
        results.push(row);
      }
    })
    .on('end', () => {
      res.json(results);
    });
});

app.get('/linegraph', (req, res) => {
  res.render('linegraph');
});

app.get('/data', (req, res) => {
  const results = [];

  fs.createReadStream('sampledata.csv')
    .pipe(csvParser())
    .on('data', (row) => {
      results.push(row);
    })
    .on('end', () => {
      res.json(results);
    });
});

// Add routes for each problem
app.get('/problem1', async (req, res) => {
  res.render('problem1', { assets: JSON.stringify(assets) });
});
  
app.get('/problem2', (req, res) => {
  res.render('problem2');
});

app.get('/problem3', (req, res) => {
  res.render('problem3');
});

app.get('/problem4', async (req, res) => {
  res.render('problem4', { assets: JSON.stringify(assets) });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
