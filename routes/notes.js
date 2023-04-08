const express = require('express');
const router = express.Router();
const fs = require('fs')
const dbFile = 'data/db.json'
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');

/* return list of all notes */
router.get('/', function (req, res, next) {

    fs.readFile(dbFile, 'utf-8', (err, data) => {
        if (err) throw err;

        const existingNotes = JSON.parse(data).notes

        res.json({
            allNotes: existingNotes
        })

    });

});

/* return note by id */
router.get('/:id', function (req, res, next) {

    const { id } = req.params

    fs.readFile(dbFile, 'utf-8', (err, data) => {
        if (err) throw err;

        const extractedNote = JSON.parse(data).notes.filter(note => note.id === id)

        res.json({
            note: extractedNote
        })

    });

});

/* new note with the given title and body */
router.post(
    '/',
    body('title').isLength({ min: 15 }),
    body('body').isLength({ min: 140 }),
    function (req, res, next) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, body } = req.body

        const newNote = { id: uuidv4(), title, body }


        fs.readFile(dbFile, 'utf-8', (err, data) => {
            if (err) throw err;

            const existingNotes = JSON.parse(data).notes

            const newNotes = { notes: [newNote, ...existingNotes] }

            const newJSONFile = JSON.stringify(newNotes, null, 4)

            fs.writeFile(dbFile, newJSONFile, 'utf-8', () => {
                res.json({
                    newNote
                });
            })

        });


    });

/* new note with the given title and body */
router.put(
    '/:id',
    body('title').isLength({ min: 15 }),
    body('body').isLength({ min: 140 }),
    function (req, res, next) {

        const { id } = req.params

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, body } = req.body

        const newNote = { id, title, body }


        fs.readFile(dbFile, 'utf-8', (err, data) => {
            if (err) throw err;

            const existingNotes = JSON.parse(data).notes.filter(note => note.id !== id)

            const newNotes = { notes: [newNote, ...existingNotes] }

            const newJSONFile = JSON.stringify(newNotes, null, 4)

            fs.writeFile(dbFile, newJSONFile, 'utf-8', () => {
                res.json({
                    newNote
                });
            })

        });


    });

/* deletes the note with the specified ID */
router.delete('/:id', function (req, res, next) {

    const { id } = req.params

    fs.readFile(dbFile, 'utf-8', (err, data) => {
        if (err) throw err;

        const allNotes = JSON.parse(data).notes

        const newNotes = { notes: allNotes.filter(note => note.id !== id) }

        const newJSONFile = JSON.stringify(newNotes, null, 4)

        fs.writeFile(dbFile, newJSONFile, 'utf-8', () => {
            res.json({
                deleted: true
            })
        })

    });
})

module.exports = router;
