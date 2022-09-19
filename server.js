// Port
const PORT = process.env.PORT || 3001;
// Dependencies
const fs = require('fs');
const path = require('path');
// Express app
const express = require('express');
const app = express();
//Notes (database).
// Parsing data
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(express.json());

app.post('/api/notes', (request, response) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if(err) throw err;
        let notes = JSON.parse(data);
        let noteInput = request.body;
        noteInput.id = Math.floor(Math.random() * 3000);
        notes.push(noteInput);
    fs.writeFile('./db/db.json', JSON.stringify(notes), (err, data) => {
        response.json(noteInput);
    });
    });
});

app.delete('/api/notes/:id', (request, response) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        const newInput = notes.filter(note => note.id !== parseInt(request.params.id));

        fs.writeFile('./db/db.json', JSON.stringify(newInput), (err, data) => {
            response.json({msg: 'success'});
        });
    });
});

app.get('api/notes/:id', (request, response) => {
    response.json(notes[request.params.id]);
});

app.get('/api/notes', (request, response) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        response.json(notes);
    });
});

app.get('/notes', (request, response) => {
    response.sendFile(path.join(__dirname, '/public/notes.html'))
})

app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, './public/index.html'))
});

app.listen(PORT, () =>
    console.log(`App running at port ${PORT}!`)
);
