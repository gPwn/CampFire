const CampsRepository = require('../repositories/camps.repository.js');

class CampsService {
    constructor() {
        this.campsRepository = new CampsRepository();
    }
}

module.exports = CampsService;
