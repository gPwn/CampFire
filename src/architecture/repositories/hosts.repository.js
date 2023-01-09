const { Op } = require('sequelize');
const { sequelize } = require('../../models');

class HostsRepository {
    #hostModel;
    constructor(HostModel) {
        this.#hostModel = HostModel;
    }

    createHost = async (
        email,
        hostName,
        password,
        brandName,
        companyNumber,
        phoneNumber,
        profileImg
    ) => {
        const createHost = await this.#hostModel.create({
            email,
            hostName,
            password,
            brandName,
            companyNumber,
            phoneNumber,
            profileImg,
        });
        return createHost;
    };

    findOneHostByEmail = async (email) => {
        return await this.#hostModel.findOne({
            where: { email },
            attributes: { exclude: ['password'] },
        });
    };
    findOneHostByHostName = async (hostName) => {
        return await this.#hostModel.findOne({
            where: { hostName },
            attributes: { exclude: ['password'] },
        });
    };
    findHostByAuth = async (email, password) => {
        const findHost = await this.#hostModel.findOne({
            where: { [Op.and]: [{ email }, { password }] },
            attributes: { exclude: ['password'] },
        });
        return findHost;
    };

    updateRefreshToken = async (token, email) => {
        await this.#hostModel.update({ token }, { where: { email: email } });
    };

    findOneHost = async (hostId) => {
        return this.#hostModel.findOne({
            where: { hostId },
        });
    };

    updateHost = async (hostId, hostName, phoneNumber, profileImg) => {
        return this.#hostModel.update(
            { hostName, phoneNumber, profileImg },
            { where: { hostId } }
        );
    };

    deleteHost = async (hostId) => {
        /* await this.#userModel.delete({
            where: { hostId },
        }); */

        const query = `DELETE FROM Hosts WHERE hostId=$hostId`;
        await sequelize.query(query, {
            bind: { hostId },
            type: sequelize.QueryTypes.DELETE,
        });
    };

    findCampsListByHost = async (hostId) => {
        const query = `SELECT * FROM Camps WHERE hostId= :hostId`;
        console.log(typeof hostId);
        const campList = await sequelize.query(query, {
            replacements: { hostId: hostId },
            type: sequelize.QueryTypes.SELECT,
        });
        /* const campList = await this.#CampsModel.findAll({
            where: { hostId },
        }); */

        return campList;
    };
}

module.exports = HostsRepository;
