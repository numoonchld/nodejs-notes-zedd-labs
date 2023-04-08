const express = require('express');
const router = express.Router();
const fs = require('fs')
const dbFile = 'data/db.json'
const { v4: uuidv4 } = require('uuid');

/* return list of all notes */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

/* new note with the given title and body */
router.post('/', function (req, res, next) {

    const { title, body } = req.body

    const newNote = { id: uuidv4(), title, body }


    fs.readFile(dbFile, 'utf-8', (err, data) => {
        if (err) throw err;

        const existingNotes = JSON.parse(data).notes
        console.log({ existingNotes });

        const newNotes = { notes: [newNote, ...existingNotes] }

        const newJSONFile = JSON.stringify(newNotes, null, 4)

        fs.writeFile(dbFile, newJSONFile, 'utf-8', () => {
            res.json({
                status: 'ok',
                newNote
            });
        })

    });


});

module.exports = router;
