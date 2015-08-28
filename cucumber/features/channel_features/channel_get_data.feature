Feature: A requester attempts to retrieve the data for a Channel object

  Scenario Outline: get the channel data associated to the requester identity object
    Given an authenticated identity in the app with <identity_id>
    When a user makes a GET to <endpoint>
    Then the backend responds with <status>

  Examples:
    | identity_id              | endpoint      | status |
    | 01f0000000000000003f0001 | /api/channel  |  200   |
    | 01f0000000000000003f0002 | /api/channel  |  200   |
    | 01f0000000000000003f0003 | /api/channel  |  200   |
    |                          | /api/channel  |  401   |


  Scenario Outline: check the channel data associated to the requester identity object
    Given an authenticated identity in the app with <identity_id>
    When a user makes a GET to <endpoint>
    Then the backend responds with <status>
    And the response includes an Array with <num_items> items

  Examples:
    | identity_id              | endpoint      | status | num_items |
    | 01f0000000000000003f0001 | /api/channel  |  200   |    2      |
    | 01f0000000000000003f0002 | /api/channel  |  200   |    1      |
    | 01f0000000000000003f0003 | /api/channel  |  200   |    1      |


  Scenario Outline: get the channel data associated to some other identity object
    Given an authenticated identity in the app with <identity_id>
    When a user performs a GET to <endpoint> for channel <channel_id>
    Then the backend responds with <status>

  Examples:
    | identity_id              | endpoint                            | channel_id               | status |
    | 01f0000000000000003f0001 | /api/channel/:channelId/identities  | 01f0000000000000006f0001 |  200   |
    | 01f0000000000000003f0002 | /api/channel/:channelId/identities  | 01f0000000000000006f0002 |  200   |
    | 01f0000000000000003f0003 | /api/channel/:channelId/identities  | 01f0000000000000006f0003 |  200   |
    | 01f0000000000000003f0003 | /api/channel/:channelId/identities  | 01f0000000000000006f0005 |  400   |
    | 01f0000000000000003f0003 | /api/channel/:channelId/identities  |                          |  404   |
    | 01f0000000000000003f0003 | /api/channel/:channelId/identities  | aaaaaa                   |  400   |


  Scenario Outline: check the channel data associated to some other identity object
    Given an authenticated identity in the app with <identity_id>
    When a user performs a GET to <endpoint> for channel <channel_id>
    Then the backend responds with <status>
    And the response includes an Array with <num_items> items

  Examples:
    | identity_id              | endpoint                            | channel_id               | status | num_items |
    | 01f0000000000000003f0001 | /api/channel/:channelId/identities  | 01f0000000000000006f0001 |  200   |    2      |
    | 01f0000000000000003f0002 | /api/channel/:channelId/identities  | 01f0000000000000006f0002 |  200   |    1      |
    | 01f0000000000000003f0003 | /api/channel/:channelId/identities  | 01f0000000000000006f0003 |  200   |    0      |