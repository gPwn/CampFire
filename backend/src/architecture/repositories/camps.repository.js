const { Op } = require('sequelize');
const { sequelize } = require('../../models');

class CampsRepository {
    #BooksModel;
    #CampsModel;
    #HostsModel;
    #UsersModel;
    #SitesModel;
    #CampAmenitiesModel;
    #EnvsModel;
    #TypesModel;
    #ThemesModel;
    #LikesModel;
    #ReviewsModel;
    constructor(
        BooksModel,
        CampsModel,
        HostsModel,
        UsersModel,
        SitesModel,
        CampAmenitiesModel,
        EnvsModel,
        TypesModel,
        ThemesModel,
        LikesModel,
        ReviewsModel
    ) {
        this.#BooksModel = BooksModel;
        this.#CampsModel = CampsModel;
        this.#HostsModel = HostsModel;
        this.#UsersModel = UsersModel;
        this.#SitesModel = SitesModel;
        this.#CampAmenitiesModel = CampAmenitiesModel;
        this.#EnvsModel = EnvsModel;
        this.#TypesModel = TypesModel;
        this.#ThemesModel = ThemesModel;
        this.#LikesModel = LikesModel;
        this.#ReviewsModel = ReviewsModel;
    }

    // 캠핑장 업로드
    createCamp = async (
        hostId,
        campMainImage,
        campSubImages,
        campName,
        campAddress,
        campDesc,
        checkIn,
        checkOut,
        mapX,
        mapY
    ) => {
        const createdCamp = await this.#CampsModel.create({
            hostId,
            campMainImage,
            campSubImages,
            campName,
            campAddress,
            campDesc,
            checkIn,
            checkOut,
            mapX,
            mapY,
        });
        const { campId } = createdCamp;
        await this.#CampAmenitiesModel.create({
            campId,
            campAmenities: null,
        });
        await this.#EnvsModel.create({
            campId,
            envLists: null,
        });
        await this.#TypesModel.create({
            campId,
            typeLists: null,
        });
        await this.#ThemesModel.create({
            campId,
            themeLists: null,
        });
        return createdCamp;
    };

    // 캠핑장 중복값 조회
    getIsExistValue = async (campName, campAddress) => {
        const camp = await this.#CampsModel.findOne({
            where: { [Op.or]: [{ campName }, { campAddress }] },
        });
        return camp;
    };

    // 캠핑장 수정하기
    updateCamps = async (
        campId,
        hostId,
        campName,
        campAddress,
        campMainImage,
        campSubImages,
        campDesc,
        checkIn,
        checkOut,
        mapX,
        mapY
    ) => {
        return await this.#CampsModel.update(
            {
                campId,
                hostId,
                campName,
                campAddress,
                campMainImage,
                campSubImages,
                campDesc,
                checkIn,
                checkOut,
                mapX,
                mapY,
            },
            {
                where: {
                    [Op.and]: [{ campId, hostId }],
                },
            }
        );
    };

    // 캠핑장 삭제하기
    deletecamps = async (campId, hostId) => {
        await this.#CampsModel.destroy({
            where: {
                [Op.and]: [{ campId, hostId }],
            },
        });
    };

    // 캠핑장 키워드 체크박스 수정
    updateKeyword = async (
        campId,
        campAmenities,
        envLists,
        typeLists,
        themeLists
    ) => {
        if (campAmenities !== null) {
            await this.#CampAmenitiesModel.update(
                {
                    campAmenities,
                },
                { where: { campId } }
            );
        }
        if (envLists !== null) {
            await this.#EnvsModel.update(
                {
                    envLists,
                },
                { where: { campId } }
            );
        }
        if (typeLists !== null) {
            await this.#TypesModel.update(
                {
                    typeLists,
                },
                { where: { campId } }
            );
        }
        if (themeLists !== null) {
            await this.#ThemesModel.update(
                {
                    themeLists,
                },
                { where: { campId } }
            );
        }
    };

    // 캠핑장 페이지 조회
    getCampsByPage = async (pageNo, userId) => {
        const camps = await this.#CampsModel.findAll({
            offset: pageNo,
            limit: 16,
            include: [
                {
                    model: this.#TypesModel,
                    as: 'Types',
                    attributes: ['typeLists'],
                },
                {
                    model: this.#ReviewsModel,
                    as: 'Reviews',
                    attributes: ['reviewId'],
                },
            ],
            order: [
                ['hostId', 'DESC'],
                ['likes', 'DESC'],
            ],
        });
        if (camps.length === 0) {
            return false;
        } else {
            return camps;
        }
    };

    // 캠핑장 상세 조회
    findCampById = async (campId) => {
        return await this.#CampsModel.findOne({
            where: { campId },
            include: [{ model: this.#HostsModel, attributes: ['phoneNumber'] }],
        });
    };

    findAmenities = async (campId) => {
        return await this.#CampAmenitiesModel.findOne({
            where: { campId },
        });
    };

    findEnvLists = async (campId) => {
        return await this.#EnvsModel.findOne({
            where: { campId },
        });
    };

    findtypeList = async (campId) => {
        return await this.#TypesModel.findOne({
            where: { campId },
        });
    };

    findThemeLists = async (campId) => {
        return await this.#ThemesModel.findOne({
            where: { campId },
        });
    };
}

const scheduler = require('node-schedule');
const request = require('request');
const env = process.env;
const compServiceKey = env.CAMPSERVISEKEY;
const { Camps, CampAmenities, Envs, Types, Themes } = require('../../models');

let url = 'https://apis.data.go.kr/B551011/GoCamping/basedList?'; /*URL*/
let queryParams = encodeURIComponent('numOfRows') + '=' + 350;

queryParams += '&' + encodeURIComponent('pageNo') + '=' + 1;
queryParams += '&' + encodeURIComponent('MobileOS') + '=' + 'WIN';
queryParams += '&' + encodeURIComponent('MobileApp') + '=' + 'campfire';
queryParams +=
    '&' +
    'serviceKey' +
    '=' +
    encodeURIComponent(compServiceKey); /*Service Key*/
queryParams += '&' + encodeURIComponent('_type') + '=' + 'json';

const rule = new scheduler.RecurrenceRule();
rule.dayOfWeek = [1, 5];
rule.hour = 1;
rule.minute = 00;
rule.tz = 'Asia/Seoul';

scheduler.scheduleJob(rule, function () {
    console.log(new Date());
    request(
        {
            url: url + queryParams,
            method: 'GET',
            rejectUnauthorized: false,
        },
        async function (error, response, body) {
            const obj = JSON.parse(body);
            const data = obj.response.body.items.item;

            for (let i = 0; i < data.length; i++) {
                if (typeof data[i] === undefined) continue;

                const isExistCampName = await Camps.findOne({
                    where: { campName: data[i].facltNm },
                });

                if (isExistCampName) {
                    const { campId } = isExistCampName;
                    await Camps.update(
                        {
                            campMainImage: data[i].firstImageUrl,
                            campSubImages: null,
                            campName: data[i].facltNm,
                            campAddress: data[i].addr1,
                            campDesc: data[i].intro,
                            checkIn: '15:00:00',
                            checkOut: '11:00:00',
                            mapX: data[i].mapX,
                            mapY: data[i].mapY,
                        },
                        { where: { campId } }
                    );
                    await CampAmenities.update(
                        {
                            campAmenities: data[i].sbrsCl,
                        },
                        { where: { campId } }
                    );
                    await Envs.update(
                        {
                            envLists: data[i].posblFcltyCl,
                        },
                        { where: { campId } }
                    );
                    await Types.update(
                        {
                            typeLists: data[i].induty,
                        },
                        { where: { campId } }
                    );
                    await Themes.update(
                        {
                            themeLists: data[i].themaEnvrnCl,
                        },
                        { where: { campId } }
                    );
                } else {
                    const createdCamp = await Camps.create({
                        hostId: 0,
                        campMainImage: data[i].firstImageUrl,
                        campSubImages: null,
                        campName: data[i].facltNm,
                        campAddress: data[i].addr1,
                        campDesc: data[i].intro,
                        checkIn: '15:00:00',
                        checkOut: '11:00:00',
                        mapX: data[i].mapX,
                        mapY: data[i].mapY,
                        homepage: data[i].homepage,
                    });
                    const { campId } = createdCamp;
                    await CampAmenities.create({
                        campId,
                        campAmenities: data[i].sbrsCl,
                    });
                    await Envs.create({
                        campId,
                        envLists: data[i].posblFcltyCl,
                    });
                    await Types.create({
                        campId,
                        typeLists: data[i].induty,
                    });
                    await Themes.create({
                        campId,
                        themeLists: data[i].themaEnvrnCl,
                    });
                }
            }
            console.log(new Date());
            console.log('저장 완료');
        }
    );
});

module.exports = CampsRepository;
