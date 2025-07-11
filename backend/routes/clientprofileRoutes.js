const express = require('express');
const router = express.Router();
const { ClientProfile } = require('../models');
const { Op } = require('sequelize');

// Standard CRUD routes for ClientProfile
router.route('/').get(async (req, res) => {
    try {
        const query = {};
        const allowedFilters = Object.keys(ClientProfile.getAttributes());
        const filterKeys = Object.keys(req.query).filter(e => allowedFilters.includes(e));
        if (filterKeys.length > 0) {
            query.where = {};
            for (const key of filterKeys) {
                query.where[key] = { [Op.eq]: req.query[key] };
            }
        }
        const records = await ClientProfile.findOne(query);
        res.status(200).send(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.route('/:id').get(async (req, res) => {
    try {
        const record = await ClientProfile.findByPk(req.params.id);
        if (!record) return res.status(404).json({ error: 'ClientProfile not found.' });
        res.send(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.route('/').post(async (req, res) => {
    try {
        const UserId = req.body.UserId;
        const [updated] = await ClientProfile.update(req.body, {
            where: { UserId }
        });
        if (updated) {
            const updatedRecord = await ClientProfile.findOne({
                where: { UserId }
            });
            return res.status(201).json(updatedRecord);
        }
        const newRecord = await ClientProfile.create(req.body);
        return res.status(201).json(newRecord);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.route('/:id').put(async (req, res) => {
    try {
        const [updated] = await ClientProfile.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedRecord = await ClientProfile.findByPk(req.params.id);
            return res.json(updatedRecord);
        }
        return res.status(404).json({ error: 'ClientProfile not found.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.route('/:id').delete(async (req, res) => {
    try {
        const deleted = await ClientProfile.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ error: 'ClientProfile not found.' });
        }
        return res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
