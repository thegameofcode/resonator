Feature: the server receives a request to send an apn push notification

  Scenario Outline: send apn push notification to an identity objects
    Given an authenticated identity in the app with <identity_id>
    Then a request is sent to <endpoint> to send an apn push notification <notification> and returns <response>

    Examples:
      | identity_id              | endpoint                | notification              | response                        |
      | 01f0000000000000003f0001 | /api/notification/push  | apn/valid_apn.json        | apn/valid_apn_response.json     |
      | 01f0000000000000003f0001 | /api/notification/push  | apn/invalid_apn.json      | apn/invalid_apn_response.json   |