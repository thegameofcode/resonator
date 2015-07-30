Feature: A requester attempts to modify the data for a given identity

  Scenario Outline: edit the profile data associated to the requester's identity object
    Given an authenticated identity in the app with <identity_id>
    When a user makes a PUT to <endpoint> to change his <name> field with value <value>
    Then the backend responds with <status>
    And the next GET request to <endpoint> returns the identity with <name> field with value <value>

  Examples:
    | identity_id              | endpoint       | status | name          | value                       |
    | 01f0000000000000003f0001 | /api/identity  |  204   | devices.apn   | identity/changed_apn_identity.json   |
    | 01f0000000000000003f0002 | /api/identity  |  204   | devices.gcm   | identity/changed_gcm_identity.json   |
    | 01f0000000000000003f0003 | /api/identity  |  204   | devices.email | identity/changed_email_identity.json |
    | 01f0000000000000003f0003 | /api/identity  |  204   | devices.phone | identity/changed_phone_identity.json |
    | 01f0000000000000003f0003 | /api/identity  |  204   | devices.sms   | identity/changed_sms_identity.json   |


  Scenario Outline: edit the profile data associated to the requester's identity object
    Given an authenticated identity in the app with <identity_id>
    When a user makes a PUT to <endpoint> to change his <name> field with value <value>
    Then the backend responds with <status>

  Examples:
    | identity_id              | endpoint       | status | name          | value                       |
    | 01f0000000000000003f0001 | /api/identity  |  204   | devices.apn   | identity/changed_apn_identity.json   |
    | 01f0000000000000003fasdf | /api/identity  |  400   | devices.sms   | identity/changed_sms_identity.json   |
