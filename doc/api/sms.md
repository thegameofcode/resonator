# Group SMS

## SMS [/api/notification/sms]

+ Attributes (sms)

### Send a sms [POST]
Send a new sms to a given phone number

+ Attributes (Game Base)

+ Request (application/json)

    + Body
    
		{
			"phone" : "+11231231234",
			"text": "this is the body of the sms"
		}

+ Response 201 (application/json)

        + Attributes (sms)
