var log = require('./logger');
var apn = require('apn');
var path = require('path');
var config = require('config');

//
// APN npm module doc:
//  https://github.com/argon/node-apn/blob/master/doc
//
// Configuration:
//	"apn" : {
//		"pfx" : "com.igz.eagle_p12_distribution.p12", // PKCS12 certificate filename within /apn folder
//			"passphrase" : "82Kf_25d-hnW.5199", // The passphrase for the connection key, if required
//			"production" : true, // Specifies which environment to connect to: Production (if true) or Sandbox
//			"notificationExpiry" : 3600, // When the notification should expire in seconds
//			"feedbackInterval" : 3600 // How often to automatically poll the feedback service. Set to 0 to disable
//	}
//


//
// APN Connection
//
var pfxPath = path.join( __dirname, '../apn/' + config.apn.pfx );

var apnConnection = new apn.Connection({
	production : config.apn.production,
	passphrase : config.apn.passphrase,
	pfx : pfxPath
});

apnConnection.on('connected', function (openSockets) {
	log.info('APN connected openSockets[' + openSockets + ']');
});
apnConnection.on('timeout', function () {
	log.info('APN timeout');
});
apnConnection.on('transmitted', function (notification, device) {
	log.info('APN transmitted device[' + device + '] compiledPayload[' + notification.compiledPayload + ']');
});
apnConnection.on('completed', function () {
	log.info('APN completed');

	// If notifications are pushed after the connection has completely shutdown a new connection will be established
	// and, if applicable, shutdown will need to be called again.
	//
	// https://github.com/argon/node-apn/blob/master/doc/connection.markdown#connectionshutdown
	apnConnection.shutdown();
});
apnConnection.on('transmissionError', function (errorCode, notification, device) {
	console.error('[' + new Date() + '] APN transmissionError errorCode[' + errorCode + '] device[' + device + '] compiledPayload[' + notification.compiledPayload + ']');
});


//
// Sends a PUSH notification to deviceTokens
//
function pushNotification (deviceTokens, alert, data, callback) {

	var devices = [];
	try {
		if ( Array.isArray(deviceTokens) ) {
			deviceTokens.forEach(function (device) {
				devices.push( new apn.Device(device) ); // Throws an error if the deviceToken supplied is invalid
			});
		}

	} catch (e) {
		console.error(e);
	}

	// If there are valid device tokens
	if ( devices.length > 0 ) {

		var note = new apn.Notification();
		note.expiry = Math.floor(Date.now() / 1000) + config.apn.notificationExpiry;
		note.alert = alert; // Text shown
		note.payload = data; // 256 byte payload size limit
		// note.badge = 1; // A number to badge the app icon with
		// note.sound = "ping.aiff";

		// Send to all devices
		devices.forEach(function (device) {
			apnConnection.pushNotification(note, device);
		});
	}

	if ( callback ) {
		callback(null);
	}
}


//
// APN Feedback Service
//  https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/CommunicatingWIthAPS.html#//apple_ref/doc/uid/TP40008194-CH101-SW3
//
// Apple recommends checking the feedback service periodically for a list of devices for which there were
// failed delivery attempts.
//
function startFeedbackService () {

	var feedbackConnection = new apn.Feedback({
		production : config.apn.production,
		passphrase : config.apn.passphrase,
		pfx : pfxPath,
		interval : config.apn.feedbackInterval
	});

	// Emitted when data has been received from the feedback service
	feedbackConnection.on('feedback', function (feedbackData) {

		// Query the feedback service daily to get the list of device tokens. Use the timestamp to verify that the device
		// tokens haven’t been reregistered since the feedback entry was generated. For each device that has not been
		// reregistered, stop sending notifications. APNs monitors providers for their diligence in checking the
		// feedback service and refraining from sending push notifications to nonexistent applications on devices.

		var devices = [];
		feedbackData.forEach(function (feedbackItem) {
			devices.push( feedbackItem.device.token.toString('hex') );
		});

		if ( devices.length > 0 ) {
			log.info('Remove ' + devices.length + ' devices');
			M.manager.user.removeAllDeviceTokens(devices, function (err, result) {
				if ( err ) {
					console.error('[' + new Date() + '] Feedback error: ', err);
				} else {
					log.info('Updated ' + result + ' users');
				}
			});
		}
	});

	// Emitted when an error occurs initialising the module. Usually caused by failing to load the certificates.
	feedbackConnection.on('error', function (error) {
		console.error('[' + new Date() + '] Feedback conn error:', error);
	});

	// Emitted when an error occurs receiving or processing the feedback and in the case of a socket error occurring.
	// These errors are usually informational and node-apn will automatically recover.
	feedbackConnection.on('feedbackError', function (error) {
		console.error('[' + new Date() + '] Feedback error:', error);
	});
}

module.exports = {
	pushNotification : pushNotification,
	startFeedbackService : startFeedbackService
};
