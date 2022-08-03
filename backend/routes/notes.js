const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const fetchUser = require("../middleware/fetchUser");
const { body, validationResult } = require("express-validator");

//ROUTE 1 : Get all the notes using: GET "/api/note/fetchallnotes".login required.

router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error occured");
  }
});

//ROUTE 2 : Add a new Note using: POST "/api/notes/addnote".login required.

router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "enter a valid name").isLength({ min: 3 }),
    body("description", "description must be atleast 5 character").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      // Destructuring
      const { title, description, tag } = req.body;

      //if error occurs, return bad request and the err.
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });

      const saveNote = await note.save();

      res.json(saveNote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);

//ROUTE 3 :updating a existing Note using: PUT "/api/notes/updatenote".login required.

router.put("/updatenote/:id", fetchUser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    // create a newNote object.
    const newNote = {};

    if (title) {
      newNote.title = title;
    }

    if (description) {
      newNote.description = description;
    }

    if (tag) {
      newNote.tag = tag;
    }

    //find a note to be updated and update it.

    let note = await Note.findById(req.params.id);
    console.log(note.user.toString());
    console.log(req.user.id);

    //if note is not found corresponding to the id given.
    if (!note) {
      return res.status(404).send("not found");
    }

    //checking that user only update there notes
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("not Allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error occured");
  }
});

//ROUTE 4 :deleting a existing Note using: DELETE "/api/notes/deletenote".login required.

router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    //find a note and delete it.

    let note = await Note.findById(req.params.id);

    //if note is not found corresponding to the id given.
    if (!note) {
      return res.status(404).send("not found");
    }

    //allow deletion only if user own this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ success: "note has been deleted!!", note });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error occured");
  }
});

module.exports = router;
