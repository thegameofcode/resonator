## identity Base (object)
- devices: {} (devices Base, required) - object containing a set notification receivers grouped by type
- channels: [] (array, required) - list of Channel object identifiers that can listen to notifications and forward them to the corresponding identites


## devices Base (object)
- sms: ['+11231231234', '+99887766543'] (array, optional) - a list of sms receivers associated to the identity
- phone: ['111222333', '333222111'] (array, optional) - a list of phone numbers to receive notifications
- email: ['john@doe.com'] (array, optional) - a list of email addresses to receive notifications
- apn: [] (array, optional) - a list of APN identifiers for iOS devices to receive push notifications
- gcm: [] (array, optional) - a list of GCM identifies for Android devices to receive push notifications

