const express = require('express');
const router = express.Router();
const { BankAccount } = require('../models');
const { Op } = require('sequelize');

// Standard CRUD routes for BankAccount
router.route('/').get(async (req, res) => {
    try {
        const query = {};
        const allowedFilters = Object.keys(BankAccount.rawAttributes);
        const filterKeys = Object.keys(req.query).filter(e => allowedFilters.includes(e));
        if (filterKeys.length > 0) {
            query.where = {};
            for (const key of filterKeys) {
                query.where[key] = { [Op.eq]: req.query[key] };
            }
        }
        const records = await BankAccount.findAll(query);
        res.status(200).send(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.route('/:id').get(async (req, res) => {
    try {
        const record = await BankAccount.findByPk(req.params.id);
        if (!record) return res.status(404).json({ error: 'BankAccount not found.' });
        res.send(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.route('/').post(async (req, res) => {
    try {
        const newRecord = await BankAccount.create(req.body);
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.route('/:id').put(async (req, res) => {
    try {
        const [updated] = await BankAccount.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedRecord = await BankAccount.findByPk(req.params.id);
            return res.json(updatedRecord);
        }
        return res.status(404).json({ error: 'BankAccount not found.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.route('/:id').delete(async (req, res) => {
    try {
        const deleted = await BankAccount.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ error: 'BankAccount not found.' });
        }
        return res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
