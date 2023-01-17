const SearchRepository = require('../repositories/search.repository.js');
const LikesRepository = require('../repositories/likes.repository.js');
const { Op } = require('sequelize');
const { Camps, Users, Likes, Reviews, Types } = require('../../models');
const { CampAmenities, Envs, Themes } = require('../../models');
const types = require('../../models/types.js');

class SearchService {
    constructor() {
        this.searchRepository = new SearchRepository(
            Camps,
            Types,
            Reviews,
            CampAmenities,
            Envs,
            Themes
        );
        this.likesRepository = new LikesRepository(Camps, Users, Likes);
    }

    getCampLists = async (search, userId) => {
        const searchLists = await this.searchRepository.getCampLists({
            where: {
                [Op.or]: [
                    {
                        campName: { [Op.like]: '%' + search + '%' },
                    },
                    {
                        campAddress: { [Op.like]: '%' + search + '%' },
                    },
                ],
            },
        });

        return await Promise.all(
            searchLists.map(async (searchList) => {
                const findLike = await this.likesRepository.isExistLike(
                    searchList.campId,
                    userId
                );
                let likeStatus = false;
                if (findLike) {
                    likeStatus = true;
                } else {
                    likeStatus = false;
                }
                return {
                    campId: searchList.campId,
                    hostId: searchList.hostId,
                    campName: searchList.campName,
                    campAddress: searchList.campAddress,
                    campMainImage: searchList.campMainImage,
                    campDesc: searchList.campDesc,
                    typeLists:
                        searchList.Types[0].typeLists === null
                            ? null
                            : searchList.Types[0].typeLists.split(','),
                    likes: searchList.likes,
                    likeStatus: likeStatus,
                    countReviews: searchList.Reviews.length,
                    createdAt: searchList.createdAt,
                    updatedAt: searchList.updatedAt,
                };
            })
        );
    };

    getCampListsByHash = async (search) => {
        for (let a of search) {
            const types = await this.searchRepository.getEnvs(a);
            console.log(types);
        }

        // const getCampListsByHash = await this.searchRepository.getCampLists({
        //     where: {
        //         [Op.or]: [
        //             {
        //                 campName: { [Op.like]: '%' + search + '%' },
        //             },
        //             {
        //                 campAddress: { [Op.like]: '%' + search + '%' },
        //             },
        //         ],
        //     },
        // });
    };
}

module.exports = SearchService;
