const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'banking_app.db',
    define: {
        timestamps: false
    }
});

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'client'), allowNull: false }
});

const ClientProfile = sequelize.define('ClientProfile', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING }
});

const BankAccount = sequelize.define('BankAccount', {
    id: { type: DataTypes.STRING, primaryKey: true },
    balance: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    currency: { type: DataTypes.STRING, allowNull: false, defaultValue: 'RON' }
});

BankAccount.beforeCreate(async (account, options) => {
    const generateId = () => {
      const letters = [...Array(3)].map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
      const numbers = [...Array(20)].map(() => Math.floor(Math.random() * 10)).join('');
      return `RO${letters}${numbers}`;
    };
  
    let unique = false;
    let generatedId;
  
    while (!unique) {
      generatedId = generateId();
      const existing = await BankAccount.findByPk(generatedId);
      if (!existing) {
        unique = true;
      }
    }
  
    account.id = generatedId;
  });

const Transaction = sequelize.define('Transaction', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    description: { type: DataTypes.STRING },
    date: { type: DataTypes.DATE, allowNull: true},
    status: {
        type: DataTypes.ENUM('Waiting', 'Approved', 'Rejected'),
        defaultValue: 'Waiting'
    },
    isFraud: { type: DataTypes.BOOLEAN, defaultValue: false },
    motivation: { type: DataTypes.STRING, allowNull: true}
});

User.hasOne(ClientProfile);
ClientProfile.belongsTo(User);

User.hasOne(BankAccount);
BankAccount.belongsTo(User);

BankAccount.hasOne(Transaction);
Transaction.belongsTo(BankAccount);

User.hasMany(Transaction, { as: 'transactions' });
Transaction.belongsTo(User);

sequelize.sync({ force: false, alter: false }).then(() => {
    console.log('Model sincronizat cu baza de date.');
}).catch(err => {
    console.error('Eroare la sincronizare:', err);
});

module.exports = {
    sequelize,
    User,
    ClientProfile,
    BankAccount,
    Transaction
};
