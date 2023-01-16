const SearchRepository = require('../repositories/search.repository.js');
const LikesRepository = require('../repositories/likes.repository.js');
const { Op } = require('sequelize');
const { Camps, Users, Likes } = require('../../models');

class SearchService {
    constructor() {
        this.searchRepository = new SearchRepository();
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
                    campSubImages: searchList.campSubImages.split(','),
                    campDesc: searchList.campDesc,
                    typeLists:
                        searchList.Types[0].typeLists === null
                            ? null
                            : searchList.Types[0].typeLists.split(','),
                    checkIn: searchList.checkIn,
                    checkOut: searchList.checkOut,
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
