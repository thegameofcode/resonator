# Group Email

## Single target email [/api/notification/singleEmail]

+ Attributes (email Base)

### Send single target email [POST]
Send a new email to a single email address

#### Attributes for the json body parameter

Name | Type | Required | Description
--- | --- | --- | ---
__to__ | String | Required | Array which contains identity ids to send the message.
__from__ | String | Optional | Email sender.
__subject__ | String | Optional | Email subject.
__html__ | String | Required | Email Text Message to be sent.

+ Request (application/json; charset=utf-8)

    + Body

            {
              "to": "john@doe.com",
              "from": "mac@into.sh",
              "html": "Hello RESONATOR!",
              "subject": "Testing"
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
              "message": "Missing 'html' String property in request body"
            }

## Multiple target email [/api/notification/email]

+ Attributes (email Base)

### Send batch email [POST]
Send a new email to one or more Identities and/or Channels

#### Attributes for the json body parameter

Name | Type | Required | Description
--- | --- | --- | ---
__identities__ | Array | Optional | Array of target Identity object IDs to send the email to.
__channels__ | Array | Optional | Array of target Channel object IDs to send the email to.
__content__ | Object | Required | Email fields container.

#### Attributes for the CONTENT object of the request body

Name | Type | Required | Description
--- | --- | --- | ---
__from__ | String | Optional | Email sender.
__subject__ | String | Optional | Email subject.
__message__ | String | Required | Email text Message to be sent.

+ Request (application/json; charset=utf-8)

    + Body

            {
              "identities": ["01f0000000000000003f0001", "01f0000000000000003f0002", "01f0000000000000003f0003"],
              "channels": ["buddies"],
              "content": {
                "from": "noreply@email.com",
                "subject": "Testing",
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
              "message": "Missing 'message' String property in request body 'content' object"
            }


