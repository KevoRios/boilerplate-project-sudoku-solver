'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  const solver = new SudokuSolver();

  // POST /api/solve
  app.route('/api/solve')
    .post(function (req, res) {
      const { puzzle } = req.body;

      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      const validationError = solver.validate(puzzle);
      if (validationError) {
        return res.json({ error: validationError });
      }

      const result = solver.solve(puzzle);
      if (result.error) {
        return res.json({ error: result.error });
      }

      return res.json({ solution: result.solution });
    });

  // POST /api/check
  app.route('/api/check')
    .post(function (req, res) {
      const { puzzle, coordinate, value } = req.body;

      // Campos requeridos
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      const validationError = solver.validate(puzzle);
      if (validationError) {
        return res.json({ error: validationError });
      }

      // Coordenada válida: A-I,1-9
      const coordRegex = /^[A-Ia-i][1-9]$/;
      if (!coordRegex.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      // Valor válido: 1–9
      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      const rowLetter = coordinate[0].toUpperCase();
      const colNumber = parseInt(coordinate[1], 10);

      const row = rowLetter.charCodeAt(0) - 'A'.charCodeAt(0); // 0–8
      const column = colNumber - 1; // 0–8

      const conflicts = [];

      if (!solver.checkRowPlacement(puzzle, row, column, value)) {
        conflicts.push('row');
      }
      if (!solver.checkColPlacement(puzzle, row, column, value)) {
        conflicts.push('column');
      }
      if (!solver.checkRegionPlacement(puzzle, row, column, value)) {
        conflicts.push('region');
      }

      if (conflicts.length > 0) {
        return res.json({ valid: false, conflict: conflicts });
      }

      return res.json({ valid: true });
    });

};
