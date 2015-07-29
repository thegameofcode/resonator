Feature: A requester asks for the creation of a Channel object

  Scenario Outline: check the creation of a new channel object based on the request body contents
    Given an authenticated identity in the app with <identity_id>
    When someone makes a POST to <endpoint> with content <request_contents>
    Then the backend responds with <status>
    And the response includes a Mongoose ObjectId identifier

  Examples:
    | identity_id              | endpoint      | request_contents                | status |
    | 01f0000000000000003f0001 | /api/channel  | channel/valid_channel_name_one  | 201    |
    | 01f0000000000000003f0002 | /api/channel  | channel/valid_channel_name_two  | 201    |

  Scenario Outline: create a new channel object based on different request body contents
    Given an authenticated identity in the app with <identity_id>
    When someone makes a POST to <endpoint> with content <request_contents>
    Then the backend responds with <status>

  Examples:
    | identity_id              | endpoint      | request_contents                 | status |
    | 01f0000000000000003f0001 | /api/channel  | channel/valid_channel_name_one   | 201    |
    | 01f0000000000000003f0002 | /api/channel  | channel/valid_channel_name_two   | 201    |
    | 01f0000000000000003f0003 | /api/channel  | channel/duplicated_channel_name  | 500    |
    | 01f0000000000000003f0001 | /api/channel  | channel/empty_channel_object     | 400    |
    | 01f0000000000000003fasdf | /api/channel  | channel/valid_channel_name_one   | 400    |