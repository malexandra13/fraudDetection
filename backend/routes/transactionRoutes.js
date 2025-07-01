const express = require('express');
const router = express.Router();
const { Transaction, BankAccount, ClientProfile, User } = require('../models');
const { Op } = require('sequelize');

router.route('/').get(async (req, res) => {
    try {
        const query = {
            include: [
                {
                    model: BankAccount,
                attributes: ['currency'] 
                },
                {
                    model: User,
                    as: 'User',
                    include: [
                        {
                            model: ClientProfile,
                        }
                    ]
                }
            ]
        };

        const allowedFilters = Object.keys(Transaction.rawAttributes);
        const filterKeys = Object.keys(req.query).filter(e => allowedFilters.includes(e));

        if (filterKeys.length > 0) {
            query.where = {};
            for (const key of filterKeys) {
                query.where[key] = { [Op.eq]: req.query[key] };
            }
            query.where["date"] = { [Op.ne]: null };
        }

        const records = await Transaction.findAll(query);
        res.status(200).send(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.route('/:id').get(async (req, res) => {
    try {
        const record = await Transaction.findByPk(req.params.id);
        if (!record) return res.status(404).json({ error: 'Transaction not found.' });
        res.send(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.route('/').post(async (req, res) => {
    try {
        const BankAccountId = req.body.BankAccountId;
        const amount = req.body.amount;
        if (!BankAccountId) {
            return res.status(404).json({ message: 'Nu există acest cont.' });
        }
        const bankAcc = await BankAccount.findByPk(BankAccountId);
        if (req.body.date == null) {
            const [updated] = await BankAccount.update({ balance: bankAcc.balance + amount }, {
                where: { id: BankAccountId }
            });
        } else {
            if (bankAcc.balance < amount) {
                return res.status(403).json({ message: "Sold insuficient!" });
            }
            const [updated] = await BankAccount.update({ balance: bankAcc.balance - amount }, {
                where: { id: BankAccountId }
            });
        }

        const newRecord = await Transaction.create(req.body);
        const io = req.app.get('io');
        io.emit('transaction_update', { action: 'created', transaction: newRecord });
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.route('/:id').put(async (req, res) => {
    try {
        const [updated] = await Transaction.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedRecord = await Transaction.findByPk(req.params.id);
            const io = req.app.get('io');
            io.emit('transaction_update', { action: 'updated', transaction: updatedRecord });
            return res.json(updatedRecord);
        }
        return res.status(404).json({ error: 'Transaction not found.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.route('/:id').delete(async (req, res) => {
    try {
        const deleted = await Transaction.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ error: 'Transaction not found.' });
        }
        return res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// GET /transactions/stats?userId=123 (opțional)
router.route('/stats/general').get(async (req, res) => {
  try {
    const where = {};
    if (req.query.userId) {
      where.UserId = req.query.userId;
    }

    const total = await Transaction.count({ where });
    const fraud = await Transaction.count({ where: { ...where, isFraud: true } });
    const legit = total - fraud;

    res.json({ total, fraud, legit });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Pentru lista de clienți cu profil
router.route('/stats/clients').get( async (req, res) => {
  try {
    const clients = await User.findAll({
      where: { role: 'client' },
      include: [{ model: ClientProfile }]
    });

    res.json(clients.map(u => ({
      id: u.id,
      email: u.email,
      fullName: `${u.ClientProfile?.firstName || ''} ${u.ClientProfile?.lastName || ''}`.trim()
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
