const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/notes.json');

const PORT = 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pages', 'notes.html')));

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

const readAndAppend = (content, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { noteTitle, noteText } = req.body;

  if (req.body) {
    const newNote = {
      noteTitle,
      noteText,
      id: Date.now(),
    };

    readAndAppend(newNote, './db/notes.json');
    res.json(`Note added successfully 🚀`);
  } else {
    res.status(400).send('Error in adding note');
  }
});

app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`));
