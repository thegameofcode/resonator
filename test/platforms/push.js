require('./../global_conf');

var assert = require('assert');

var pushPlatform = require('./../../lib/platforms/push');
var identityPlatform = require('./../../lib/platforms/identity');
var loadFixtures = require('./../../scripts/load_fixtures');
var log = require('./../../lib/util/logger');

describe('Apn Feedback Service', function() {


    beforeEach(function(done) {
        log.debug('Loading fixtures');
        loadFixtures(done);
    });

    it('Delete device returned from FeedBack Service', function(done) {

        var devices = ["<0123 4567 89AB CDEF>"];
        var identityId = '01f0000000000000003f0002';


        pushPlatform.deleteApnDevices(devices, function(err){
            assert.equal(err, null);

            identityPlatform.get(identityId, function(err, result){
                assert.equal(err, null);

                assert.strictEqual(result.devices.apn.indexOf(devices[0]), -1);
                done();
            });
        });
    });
});
