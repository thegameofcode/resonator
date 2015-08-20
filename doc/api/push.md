# Group Push Notifications

## Push [/api/notification/push]

+ Attributes (push Base)

### Send a email [POST]
Send a new email to a given array of emails

#### Attributes for the json body parameter

Name | Type | Required | Description
--- | --- | --- | ---
__to__ | String | Required | Array which contains identities ids.
__message__ | String | Required | Push Text Message to be sent.
__optionals__ | String | Optional | Object containing all send options (onlyGcm || onlyApn).

+ Request (application/json; charset=utf-8)

    + Body

            {
                "identities": [
                    "01f0000000000000003f0002",
                    "01f0000000000000003f0003"
                ],
                "content": {
                    "apn": {
                        "alert": "You have a new message",
                        "payload": {
                            "someKey": "someValue"
                        }
                    }
                }
            }

+ Response 204

+ Response 400 (application/json; charset=utf-8)

            {
              "code": "BadRequestError",
              "message": "Missing 'to' property in parameters"
            }


+ Response 400 (application/json; charset=utf-8)

            {
              "code": "BadRequestError",
              "message": "Missing 'message' property in parameters"
            }

