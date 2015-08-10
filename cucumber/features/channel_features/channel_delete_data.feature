Feature: A requester attempts to delete some Channel object's data

  Scenario Outline: delete a Channel object from the database
    Given an authenticated identity in the app with <identity_id>
    When a user makes a DELETE to <endpoint> for channel <channel_id>
    Then the backend responds with <status>

  Examples:
    | identity_id              | endpoint                 | channel_id               | status |
    | 01f0000000000000003f0001 | /api/channel/:channelId  | 01f0000000000000006f0001 | 204    |
    | 01f0000000000000003f0002 | /api/channel/:channelId  | 01f0000000000000006f0002 | 204    |
    | 01f0000000000000003f0002 | /api/channel/:channelId  | 01f0000000000000006fasdf | 400    |
    | 01f0000000000000003fasdf | /api/channel/:channelId  | 01f0000000000000006f0002 | 400    |
    | 01f0000000000000003f0002 | /api/channel/:channelId  | 01f0000000000000006f0004 | 400    |
    | 01f0000000000000003f0004 | /api/channel/:channelId  | 01f0000000000000006f0001 | 401    |



  Scenario Outline: delete an Identity object from a Channel object
    Given an authenticated identity in the app with <identity_id>
    When a user performs a DELETE to <endpoint> to delete identity <identity_to_delete> from channel <channel_id>
    Then the backend responds with <status>

  Examples:
    | identity_id              | endpoint                                        | identity_to_delete       | channel_id               | status |
    | 01f0000000000000003f0003 | /api/channel/:channelId/identities/:identityId  | 01f0000000000000003f0002 | 01f0000000000000006f0002 | 204    |
    | 01f0000000000000003f0002 | /api/channel/:channelId/identities/:identityId  | 01f0000000000000003f0001 | 01f0000000000000006f0001 | 204    |
    | 01f0000000000000003f0001 | /api/channel/:channelId/identities/:identityId  | 01f0000000000000003f0003 | 01f0000000000000006f0001 | 204    |
    | 01f0000000000000003fasdf | /api/channel/:channelId/identities/:identityId  | 01f0000000000000003f0001 | 01f0000000000000006f0002 | 400    |
    | 01f0000000000000003f0001 | /api/channel/:channelId/identities/:identityId  | 01f0000000000000003f0001 | 01f0000000000000006fasdf | 400    |
    | 01f0000000000000003f0001 | /api/channel/:channelId/identities/:identityId  | 01f0000000000000003fasdf | 01f0000000000000006f0002 | 500    |
    | 01f0000000000000003f0002 | /api/channel/:channelId/identities/:identityId  | 01f0000000000000003f0001 | 01f0000000000000006f0004 | 500    |
    | 01f0000000000000003f0002 | /api/channel/:channelId/identities/:identityId  | 01f0000000000000003f0004 | 01f0000000000000006f0001 | 500    |
    | 01f0000000000000003f0001 | /api/channel/:channelId/identities/:identityId  | 01f0000000000000003f0002 | 01f0000000000000006f0001 | 500    |
