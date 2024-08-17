const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Claim = sequelize.define('Claim', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

Claim.belongsTo(User);
User.hasMany(Claim);

User.hasMany(Claim, { foreignKey: 'userId', onDelete: 'CASCADE' });
Claim.belongsTo(User, { foreignKey: 'userId' });

module.exports = Claim;
