Feature: A requester wants to obtain the data for a given identity

  Scenario Outline: get the profile data associated to the requester identity object
    Given an authenticated identity in the app with <identity_id>
    When a user makes a GET to <endpoint>
    Then the backend responds with <status>
    And the returned identity object with identifier <identity_id> has a valid format

  Examples:
    | identity_id              | endpoint       | status |
    | 01f0000000000000003f0001 | /api/identity  |  200   |
    | 01f0000000000000003f0002 | /api/identity  |  200   |
    | 01f0000000000000003f0003 | /api/identity  |  200   |

  Scenario Outline: get the profile data associated to the requester identity object
    Given an authenticated identity in the app with <identity_id>
    When a user makes a GET to <endpoint>
    Then the backend responds with <status>

  Examples:
    | identity_id              | endpoint       | status |
    | 01f0000000000000003f0001 | /api/identity  |  200   |
    | 01f0000000000000003f0002 | /api/identity  |  200   |
    | 01f0000000000000003f0003 | /api/identity  |  200   |
    | 01f0000000000000003f0020 | /api/identity  |  401   |


  Scenario Outline: get the profile data associated to some identity object
    Given an authenticated identity in the app with <identity_id>
    When a user asks for profile data to <endpoint> with id <requested_identity_id>
    Then the backend responds with <status>
    And the returned identity object with identifier <requested_identity_id> has a valid format

  Examples:
    | identity_id              | endpoint                   | requested_identity_id    | status |
    | 01f0000000000000003f0001 | /api/identity/:identityId  | 01f0000000000000003f0001 |  200   |
    | 01f0000000000000003f0001 | /api/identity/:identityId  | 01f0000000000000003f0002 |  200   |
    | 01f0000000000000003f0001 | /api/identity/:identityId  | 01f0000000000000003f0003 |  200   |
    | 01f0000000000000003f0002 | /api/identity/:identityId  | 01f0000000000000003f0001 |  200   |
    | 01f0000000000000003f0002 | /api/identity/:identityId  | 01f0000000000000003f0002 |  200   |
    | 01f0000000000000003f0002 | /api/identity/:identityId  | 01f0000000000000003f0003 |  200   |
    | 01f0000000000000003f0003 | /api/identity/:identityId  | 01f0000000000000003f0001 |  200   |
    | 01f0000000000000003f0003 | /api/identity/:identityId  | 01f0000000000000003f0002 |  200   |
    | 01f0000000000000003f0003 | /api/identity/:identityId  | 01f0000000000000003f0003 |  200   |