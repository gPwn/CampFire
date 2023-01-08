'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Hosts', {
            hostId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.DataTypes.INTEGER,
            },
            email: {
                type: Sequelize.DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            hostName: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            brandName: {
                type: Sequelize.DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            companyNumber: {
                type: Sequelize.DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            password: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            phoneNumber: {
                type: Sequelize.DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            profileImg: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            token: {
                type: Sequelize.DataTypes.STRING,
                allowNull: true,
                unique: true,
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
        await queryInterface.dropTable('Hosts');
    },
};
