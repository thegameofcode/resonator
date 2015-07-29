# Group SMS

## SMS [/api/push/sms]

+ Attributes (sms Base)

### Send a sms [POST]
Send a new sms to a given set of E.164-formatted phone numbers

| SMS Field   | Description                                                          |
|-------------|----------------------------------------------------------------------|
| to          | List of E.164 phone numbers which shall receive the provided message |
| from        | E.164 phone number from which the SMS message comes from             |
| message     | Body content of the SMS message                                      |

+ Request

    + Headers

            Authorization: Bearer BEWkwDA0bTTw_4dSPNI8lDPWF
    + Body

            {
                "to": ["+16512223344"],
                "from": "+34518888780",
                "message": "Hello Resonator!"
            }

+ Response 200 (application/json)

            {
                "messages": 2,
                "targets": [
                    "+15005550010",
                    "+15005550011"
                ],
                "source": "+15005550006",
                "text": "Hello there!"
            }

+ Response 500 (application/json)

            {
                "code": "InternalError",
                "message": "Could not send SMS to destination"
            }
