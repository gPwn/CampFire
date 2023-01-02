'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Camps extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.Books, {
                as: 'Books',
                foreignKey: 'campId',
            });
            this.belongsTo(models.Hosts, { foreignKey: 'hostId' });
        }
    }
    Camps.init(
        {
            campId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            hostId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Hosts',
                    key: 'hostId',
                },
                onDelete: 'cascade',
            },
            campName: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            campAddress: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            campPrice: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            campMainImage: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            campSubImages: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            campDesc: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            campAmenity: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            checkIn: {
                type: DataTypes.TIME,
                allowNull: false,
            },
            checkOut: {
                type: DataTypes.TIME,
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
            modelName: 'Camps',
        }
    );
    return Camps;
};
