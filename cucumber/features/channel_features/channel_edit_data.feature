Feature: A requester attempts to update the data of a Channel object

Scenario Outline: update the data of a Channel object based on the request body contents
Given an authenticated identity in the app with <identity_id>
  When a user makes a PUT to <endpoint> to change channel <channel_id> with content <content>
  Then the backend responds with <status>

Examples:
  | identity_id              | endpoint                | channel_id                | status | content                        |
  | 01f0000000000000003f0001 | /api/channel/:channelId | 01f0000000000000006f0001  |  204   | channel/valid_channel_name_one |
  | 01f0000000000000003f0002 | /api/channel/:channelId | 01f0000000000000006f0003  |  204   | channel/valid_channel_name_two |
  | 01f0000000000000003f0004 | /api/channel/:channelId | 01f0000000000000006f0001  |  401   | channel/valid_channel_name_one |
  | 01f0000000000000003f0002 | /api/channel/:channelId | 01f0000000000000006f0004  |  400   | channel/valid_channel_name_two |

  Scenario Outline: check the update attempt of a Channel object based on the request body contents
    Given an authenticated identity in the app with <identity_id>
    When a user makes a PUT to <put_endpoint> to change channel <channel_id> with content <content>
    Then the backend responds with <status>
    And the next GET request to <get_endpoint> returns the channel <channel_id> with <name> field with value <content>

  Examples:
    | identity_id              | put_endpoint            | channel_id                | get_endpoint | name | status | content                        |
    | 01f0000000000000003f0001 | /api/channel/:channelId | 01f0000000000000006f0001  | /api/channel | name |  204   | channel/valid_channel_name_one |
    | 01f0000000000000003f0002 | /api/channel/:channelId | 01f0000000000000006f0002  | /api/channel | name |  204   | channel/valid_channel_name_two |
