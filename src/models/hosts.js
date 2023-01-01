'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Hosts extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.Books, {
                as: 'Books',
                foreignKey: 'hostId',
            });
            this.hasMany(models.Camps, {
                as: 'Camps',
                foreignKey: 'hostId',
            });
        }
    }
    Hosts.init(
        {
            hostId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            userName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phoneNumber: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            profileImg: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
        },
        {
            sequelize,
            modelName: 'Hosts',
        }
    );
    return Hosts;
};
