'use strict';

angular.module('matkotApp')
    .service('stateService', function () {
        // admin orderOverview state
        this.orderOverviewQ = {};
        this.orderOverviewTab = undefined;
    });
