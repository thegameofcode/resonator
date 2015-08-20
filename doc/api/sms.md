# Group SMS

## SMS [/api/notification/sms]

+ Attributes (sms Base)

### Send a sms [POST]
Send a new sms to a given phone number

#### Attributes for the json body parameter

Name | Type | Required | Description
--- | --- | --- | ---
__to__ | String | Required | Array which contains identity ids to send the message.
__from__ | String | Required | Phone Number sender.
__message__ | String | Required | Sms Text Message to be sent.

+ Request (application/json)

    + Body

            {
                "identities": [],
                "channels": ["buddies"],
                "content": {
                    "from": "+15005550010",
                    "message": "Hola holita RESONATOR"
                }
            }

+ Response 204


