const SearchRepository = require('../repositories/search.repository.js');
const LikesRepository = require('../repositories/likes.repository.js');
const { Camps, Users, Likes, Reviews, Types } = require('../../models');
const { CampAmenities, Envs, Themes } = require('../../models');

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

    getCampLists = async (userId, search, types, themes, envs, amenities) => {
        const searchLists = await this.searchRepository.getCampLists(
            search,
            types,
            themes,
            envs,
            amenities
        );
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
