'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Camps', {
            campId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.DataTypes.INTEGER,
            },
            hostId: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Hosts',
                    key: 'hostId',
                },
                onDelete: 'cascade',
            },
            campName: {
                type: Sequelize.DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            campAddress: {
                type: Sequelize.DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            campPrice: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
            },
            campMainImage: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            campSubImages: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            campDesc: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            campAmenity: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            checkIn: {
                type: Sequelize.DataTypes.TIME,
                allowNull: false,
            },
            checkOut: {
                type: Sequelize.DataTypes.TIME,
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DataTypes.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Camps');
    },
};
