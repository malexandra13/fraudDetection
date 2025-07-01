const express = require('express');
const router = express.Router();
const { User, ClientProfile } = require('../models');
const { Op } = require('sequelize');

// Standard CRUD routes for User
router.route('/').get(async (req, res) => {
    try {
        const query = {
            include: [
                {
                    model: ClientProfile,
                    attributes: ['firstName', 'lastName', 'address', 'phone']
                }
            ]
        };
        const allowedFilters = Object.keys(User.rawAttributes);
        const filterKeys = Object.keys(req.query).filter(e => allowedFilters.includes(e));
        if (filterKeys.length > 0) {
            query.where = {};
            for (const key of filterKeys) {
                query.where[key] = { [Op.eq]: req.query[key] };
            }
        }
        const records = await User.findAll(query);
        res.status(200).send(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.route('/:id').get(async (req, res) => {
    try {
        const record = await User.findByPk(req.params.id);
        if (!record) return res.status(404).json({ error: 'User not found.' });
        res.send(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.route('/').post(async (req, res) => {
  const { firstName, lastName, address, phone, ...userData } = req.body;

  try {
    const user = await User.create(userData);

    if (user.role === 'client') {
      await ClientProfile.create({
        firstName,
        lastName,
        address,
        phone,
        UserId: user.id
      });
    }

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.route('/:id').put(async (req, res) => {
    try {
        const [updated] = await User.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedRecord = await User.findByPk(req.params.id);
            return res.json(updatedRecord);
        }
        return res.status(404).json({ error: 'User not found.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.route('/:id').delete(async (req, res) => {
    try {
        const deleted = await User.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ error: 'User not found.' });
        }
        return res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
