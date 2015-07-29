Feature: A requester asks for the creation of an identity object

  Scenario Outline: create and check a new identity object based on the request body contents
    When someone makes a POST to <endpoint> with content <request_contents>
    Then the backend responds with <status>
    And the response includes a Mongoose ObjectId identifier

    Examples:
      | endpoint      | request_contents              | status |
      | /api/identity | identity/valid_identity_email | 201    |
      | /api/identity | identity/valid_identity_phone | 201    |
      | /api/identity | identity/valid_identity_gcm   | 201    |

  Scenario Outline: create a new identity object based on the request body contents
    When someone makes a POST to <endpoint> with content <request_contents>
    Then the backend responds with <status>

  Examples:
    | endpoint      | request_contents               | status |
    | /api/identity | identity/valid_identity_sms    | 201    |
    | /api/identity | identity/valid_identity_apn    | 201    |
    | /api/identity | identity/duplicated_identity   | 500    |