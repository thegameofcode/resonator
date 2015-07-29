# Group Email

## Email [/api/notification/email]

+ Attributes (email Base)

### Send a email [POST]
Send a new email to a given array of emails

#### Attributes for the json body parameter

Name | Type | Required | Description
--- | --- | --- | --- 
__to__ | String | Required | Array which contains email addresses to send the message.
__from__ | String | Required | Email sender.
__message__ | String | Required | Email Text Message to be sent.

+ Request (application/json; charset=utf-8)

    + Body

            {
              "to": ["email1@email.com"],
              "from": "noreply@email.com",
              "message": "This is the body of the email"
            }

+ Response 201 (application/json; charset=utf-8)

            {
              "id": "<20150729090542.29416.27304@sandboxd41385ca8b5f40eda0c863e41dc6e997.mailgun.org>",
              "message": "Queued. Thank you."
            }

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
            