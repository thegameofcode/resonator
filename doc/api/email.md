# Group Email

## Email [/api/notification/email]

+ Attributes (email Base)

### Send a email [POST]
Send a new email to a given array of emails

#### Attributes for the json body parameter

Name | Type | Required | Description
--- | --- | --- | ---
__to__ | String | Required | Array which contains identity ids to send the message.
__from__ | String | Required | Email sender.
__message__ | String | Required | Email Text Message to be sent.

+ Request (application/json; charset=utf-8)

    + Body

            {
              "identities": ["01f0000000000000003f0001", "01f0000000000000003f0002", "01f0000000000000003f0003"],
              "channels": ["buddies"],
              "content": {
                "from": "noreply@email.com",
                "message": "This is the body of the email"
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
              "message": "Missing 'from' property in parameters"
            }

+ Response 400 (application/json; charset=utf-8)

            {
              "code": "BadRequestError",
              "message": "Missing 'message' property in parameters"
            }

