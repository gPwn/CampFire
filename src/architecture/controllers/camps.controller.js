const CampsService = require('../services/camps.service.js');

class CampsController {
    constructor() {
        this.campsService = new CampsService();
    }
}

module.exports = CampsController;
