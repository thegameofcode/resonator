Feature: Notifications component sends a 204 to confirm it is running

  Scenario: get the status of the notifications server
    When a user makes a GET to /heartbeat
    Then the backend responds with 204
