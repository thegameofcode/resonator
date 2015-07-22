# Group SMS

## SMS [/api/notification/sms]

+ Attributes (sms Base)

### Send a sms [POST]
Send a new sms to a given phone number

+ Attributes (sms Base)

+ Request (application/json)

            "phone" : "+11231231234",
    + Body

            {
                "text": "this is the body of the sms"
            }

+ Response 201 (application/json)

        + Attributes (sms)
