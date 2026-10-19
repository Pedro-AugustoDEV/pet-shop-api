const express = require('express');
const router = express.Router();
const pool = require('../config/database');

function isValidId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0;
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validatePetBody(body) {
  if (!body) return false;
  const { nome, especie, tutor } = body;
  return isNonEmptyString(nome) && isNonEmptyString(especie) && isNonEmptyString(tutor);
}

router.get('/', (req, res) => {
  pool.query('SELECT * FROM pet', (err, results) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao consultar os pets.' });
    }
    res.status(200).json(results);
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ erro: 'ID inválido. Deve ser um número inteiro positivo.' });
  }

  pool.query('SELECT * FROM pet WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao consultar o pet.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ erro: 'Pet não encontrado.' });
    }
    res.status(200).json(results[0]);
  });
});

router.post('/', (req, res) => {
  if (!validatePetBody(req.body)) {
    return res.status(400).json({ erro: 'Campos nome, especie e tutor são obrigatórios e devem ser strings não vazias.' });
  }

  const { nome, especie, tutor } = req.body;

  pool.query(
    'INSERT INTO pet (nome, especie, tutor) VALUES (?, ?, ?)',
    [nome.trim(), especie.trim(), tutor.trim()],
    (err, result) => {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao criar o pet.' });
      }
      res.status(201).json({ id: result.insertId, nome: nome.trim(), especie: especie.trim(), tutor: tutor.trim() });
    }
  );
});

router.put('/:id', (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ erro: 'ID inválido. Deve ser um número inteiro positivo.' });
  }

  if (!validatePetBody(req.body)) {
    return res.status(400).json({ erro: 'Campos nome, especie e tutor são obrigatórios e devem ser strings não vazias.' });
  }

  const { nome, especie, tutor } = req.body;

  pool.query('SELECT id FROM pet WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao consultar o pet.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ erro: 'Pet não encontrado.' });
    }

    pool.query(
      'UPDATE pet SET nome = ?, especie = ?, tutor = ? WHERE id = ?',
      [nome.trim(), especie.trim(), tutor.trim(), id],
      (updateErr) => {
        if (updateErr) {
          return res.status(500).json({ erro: 'Erro ao atualizar o pet.' });
        }
        res.status(200).json({ id: Number(id), nome: nome.trim(), especie: especie.trim(), tutor: tutor.trim() });
      }
    );
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ erro: 'ID inválido. Deve ser um número inteiro positivo.' });
  }

  pool.query('SELECT id FROM pet WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao consultar o pet.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ erro: 'Pet não encontrado.' });
    }

    pool.query('DELETE FROM pet WHERE id = ?', [id], (deleteErr) => {
      if (deleteErr) {
        return res.status(500).json({ erro: 'Erro ao excluir o pet.' });
      }
      res.status(200).json({ mensagem: 'Pet excluído com sucesso.' });
    });
  });
});

module.exports = router;
