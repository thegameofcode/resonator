# Group Push Notifications

## Email [/api/notification/push]

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
              "to": ["01f0000000000000003f0002", "01f0000000000000003f0003"],
              "message": "This is the Apn notification"
              "options": {
                "onlyApn": true,
                "onlyGcm": false
              }
            }

+ Response 200 (application/json; charset=utf-8)

            {
                "GCM":[],
                "APN":
                [ "<0123 4567 89AB CDEF>",
                  "<0123 4567 89AB CDFF>" ]
            }

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