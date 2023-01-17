const SearchRepository = require('../repositories/search.repository.js');
const LikesRepository = require('../repositories/likes.repository.js');
const { Op } = require('sequelize');
const { Camps, Users, Likes, Reviews, Types } = require('../../models');

class SearchService {
    constructor() {
        this.searchRepository = new SearchRepository(Camps, Types, Reviews);
        this.likesRepository = new LikesRepository(Camps, Users, Likes);
    }

    getCampLists = async (search, pageNo, userId) => {
        let start = 0;
        if (pageNo <= 0) {
            pageNo = 1;
        } else {
            start = (pageNo - 1) * 16;
        }
        const searchLists = await this.searchRepository.getCampLists({
            offset: start,
            limit: 16,
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
}

module.exports = SearchService;
