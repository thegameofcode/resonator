Feature: Notifications component sends a 204 to confirm it is running

  Scenario Outline: get the status of the notifications server
    Given an authenticated identity in the app with <identity_id>
    When a user makes a GET to /heartbeat
    Then the backend responds with 204

  Examples:
    | identity_id               |
    | 01f0000000000000003f0001  |
    | 01f0000000000000003f0002  |
    | 01f0000000000000003f0003  |
