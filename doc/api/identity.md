# Group Identity

## /api/identity

+ Attributes(identity Base)

### Get requester's identity data [GET]

Retrieves the Identity data associated to the requester

+ Request

    + Headers

            Authorization: Bearer BEWkwDA0bTTw_4dSPNI8lDPWF


+ Response 200 (application/json; charset=utf-8)

    + Body

            {
                "id": "01f0000000000000003f0001",
                "channels": [],
                "devices": {
                    "email": [
                        "john@doe.com"
                    ],
                    "sms": [
                        "+9988776655"
                    ],
                    "phone": [
                        "+111222333",
                        "+333222111"
                    ],
                    "apn": [],
                    "gcm": [
                        "654C4DB3-3F68-4969-8ED2-80EA16B46EB0"
                    ]
                }
            }

+ Response 401 (application/json; charset=utf-8)

    + Body

            {
                "code": "UnauthorizedError",
                "message": "Missing authorization header"
            }


### Create a new Identity object [POST]

Creates a new Identity object with the provided data, if any

+ Request

    + Body

            {
                "devices": {
                    "sms": [],
                    "email": ["john@appleseed.com"],
                    "phone": [],
                    "apn": [],
                    "gcm": []
                },
                "channels": []
            }

+ Response 201 (application/json; charset=utf-8)

    + Body

            {
                "id": "55af67b553f14ff72a0f5e19"
            }

+ Response 500 (application/json; charset=utf-8)

    + Body

            {
                "code": "InternalError",
                "message": "Could not create requested Identity object"
            }

### Modify the Identity data associated to the requester [PUT]

Replaces the data of the Identity object associated to the requester with the provided contents

+ Request

    + Headers

            Authorization: Bearer BEWkwDA0bTTw_4dSPNI8lDPWF

    + Body

            {
                "devices": {
                "email": ["changed@doe.com"]
                },
                "channels": []
            }

+ Response 204

## /api/identity/{id}

### Retrieve the Identity data associated to an Identity identifier [GET]

+ Parameters
    + id (required, string, `12345`)

        The ID of the desired Identity object


+ Request

    + Headers

            Authorization: Bearer BEWkwDA0bTTw_4dSPNI8lDPWF

+ Response 200 (application/json; charset=utf-8)

    + Body

            {
                "id": "01f0000000000000003f0001",
                "channels": [],
                "devices": {
                    "email": [
                        "john@doe.com"
                        ],
                    "sms": [
                        "+9988776655"
                        ],
                        "phone": [
                            "+111222333",
                            "+333222111"
                        ],
                    "apn": [],
                    "gcm": [
                        "654C4DB3-3F68-4969-8ED2-80EA16B46EB0"
                    ]
                }
            }

+ Response 401 (application/json; charset=utf-8)

    + Body

            {
                "code": "UnauthorizedError",
                "message": "Identity not found"
            }


