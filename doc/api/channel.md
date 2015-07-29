# Group Channel

## /api/channel

+ Attributes(channel Base)

### Get the requester's channel list [GET]

Retrieves the list of Channel objects associated to the requester's Identity object

+ Request

    + Headers

            Authorization: Bearer BEWkwDA0bTTw_4dSPNI8lDPWF


+ Response 200 (application/json; charset=utf-8)

    + Body

            {
                [
                    {
                        "id": "01f0000000000000006f0001",
                        "name": "buddies"
                    },
                    {
                        "id": "01f0000000000000006f0002",
                        "name": "friends"
                    }
                ]
            }

+ Response 401 (application/json; charset=utf-8)

    + Body

            {
                "code": "UnauthorizedError",
                "message": "Missing authorization header"
            }

### Create a new Channel object [POST]

Creates a new Channel object with the provided name in the data store

+ Request

    + Body

            {
                "name": "some_name"
            }

+ Response 201 (application/json; charset=utf-8)

    + Body

            {
                "id": "54af67b322f14ff72a0f5e20"
            }

+ Response 500 (application/json; charset=utf-8)

    + Body

            {
                "code": "ConflictError",
                "message": "Missing 'name' property in channel object"
            }

## /api/channel/{id}

### Modify the data associated to a Channel object [PUT]

Replaces the data of the Channel object identified by the provided channel Id.

+ Parameters
    + id (required, string) ... The ID of the Channel object to update

+ Request

    + Headers

            Authorization: Bearer BEWkwDA0bTTw_4dSPNI8lDPWF

    + Body

            {
                "name": "new_name"
            }

+ Response 204

+ Response 409 (application/json; charset=utf-8)

    + Body

            {
                "code": "ConflictError",
                "message": "Missing 'name' property in channel object"
            }

### Delete a Channel object [DELETE]

Delete the Channel object identified by the provided channel Id.

+ Parameters
    + id (string) ... The ID of the Channel object to delete

+ Request

    + Headers

            Authorization: Bearer BEWkwDA0bTTw_4dSPNI8lDPWF

+ Response 204

+ Response 500 (application/json; charset=utf-8)

    + Body

            {
                "code": "InternalError",
                "message": "Could not delete provided channeld object"
            }

## /api/channel/{id}/identities

### Get a channel's identities list [GET]

Retrieves the list of Identity objects associated to the specified Channel object

+ Parameters
    + id (string) ... The ID of the Channel object to retrieve data from

+ Request

    + Headers

            Authorization: Bearer BEWkwDA0bTTw_4dSPNI8lDPWF

+ Response 200

    + Body

                [
                    {
                        "id": "01f0000000000000003f0002",
                        "channels": [
                            "01f0000000000000006f0002"
                        ],
                        "devices": {
                            "email": [
                                "michael@hamming.com"
                            ],
                            "sms": [
                                "444555666"
                            ],
                            "phone": [
                                "000222444",
                                "888666222"
                            ],
                            "apn": [],
                            "gcm": [
                                "654C4DB3-3F68-4969-8ED2-40FF45A33DC1"
                            ]
                        }
                    }
                ]

+ Response 500 (application/json; charset=utf-8)

    + Body

                {
                    "code": "BadRequestError",
                    "message": "Unknown provided channel identifier"
                }

## /api/channel/{channelId}/identities/{identityId}

### Remove an Identity from channel [DELETE]

Delete an Identity identifier from a Channel object

+ Parameters
    + channelId (string) ... The Channel identifier from which the Identity shall be removed
    + identityId (string) ... The Identity identifier that shall be removed from the Channel object

+ Request

     + Headers

            Authorization: Bearer BEWkwDA0bTTw_4dSPNI8lDPWF

+ Response 204

+ Response 500 (application/json; charset=utf-8)

    + Body

                {
                    "code": "InternalError",
                    "message": "Could not delete provided Identity object from channel 01f0000000000000006f0002"
                }
