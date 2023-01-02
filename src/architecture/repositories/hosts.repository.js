const { Op } = require('sequelize');

class HostsRepository {
    #hostModel;
    constructor(HostModel) {
        this.#hostModel = HostModel;
    }

    createHost = async (email, hostName, password, phoneNumber, profileImg) => {
        const createHost = await this.#hostModel.create({
            email,
            hostName,
            password,
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
}

module.exports = HostsRepository;
