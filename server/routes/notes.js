import express from 'express';
import db from '../db.js';
import { schemas, validate } from '../middleware/validation.js';

const router = express.Router();

// GET /api/notes/:componentName - Get all notes for a component
router.get('/:componentName', async (req, res, next) => {
  try {
    const { componentName } = req.params;

    const result = await db.query(
      `SELECT id, component_name, note_text, author_name, created_at, updated_at
       FROM component_notes
       WHERE component_name = $1
       ORDER BY created_at DESC`,
      [componentName]
    );

    res.json({
      componentName,
      count: result.rows.length,
      notes: result.rows
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/notes - Create a new note
router.post('/', validate(schemas.createNote), async (req, res, next) => {
  try {
    const { componentName, noteText, authorName } = req.body;

    const result = await db.query(
      `INSERT INTO component_notes (component_name, note_text, author_name)
       VALUES ($1, $2, $3)
       RETURNING id, component_name, note_text, author_name, created_at, updated_at`,
      [componentName, noteText, authorName || null]
    );

    res.status(201).json({
      message: 'Note created successfully',
      note: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/notes/:id - Update a note
router.put('/:id', validate(schemas.updateNote), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { noteText, authorName } = req.body;

    const result = await db.query(
      `UPDATE component_notes
       SET note_text = $1, author_name = $2
       WHERE id = $3
       RETURNING id, component_name, note_text, author_name, created_at, updated_at`,
      [noteText, authorName || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Note not found',
        message: `No note found with id ${id}`
      });
    }

    res.json({
      message: 'Note updated successfully',
      note: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/notes/:id - Delete a note
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `DELETE FROM component_notes
       WHERE id = $1
       RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Note not found',
        message: `No note found with id ${id}`
      });
    }

    res.json({
      message: 'Note deleted successfully',
      id: result.rows[0].id
    });
  } catch (err) {
    next(err);
  }
});

export default router;
