Feature: Notifications component sends a 204 to confirm it is running

  Scenario: get the status of the notifications server
    When a call is done to the hearbeat endpoint
    Then the response status code is 204
