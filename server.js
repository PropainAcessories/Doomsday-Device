// Port
const PORT = process.env.PORT || 3001;
// Dependencies
const fs = require('fs');
const path = require('path');
// Express app
const express = require('express');
const app = express();
//Notes (database).
const notes = require('./db/db.json');
// Parsing data
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', (request, response) => {
    response.json(notes.slice(1));
});

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (request, response) => {
    response.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, './public/index.html'))
});

function createNote(body, noteArray) {
    const newNote = body;
    if(!Array.isArray(noteArray))
        noteArray = [];

    if(noteArray.length === 0)
        noteArray.push(0);

    body.id = noteArray[0];
    noteArray[0]++;

    noteArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(noteArray, null, 2)
    );
    return newNote;
};

app.post('/api/notes', (request, response) => {
    const newNote = createNote(request.body, notes);
    response.json(newNote);
});

function deleteNote(id, noteArray) {
    for(let i = 0; i < noteArray.length; i++) {
        let note = noteArray[i];

        if (note.id === id) {
            noteArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(noteArray, null, 2)
            );

            break;
        }
    }
};

app.delete('/api/notes/:id', (request, response) => {
    deleteNote(request.params.id, notes);
    response.json(true);
});

app.listen(PORT, () =>
    console.log(`App running at http://localhost:${PORT}`)
);
