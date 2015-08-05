Feature: the server receives a request to send a gcm push notification

  Scenario Outline: send gcm push notification to an identity objects
    Given an authenticated identity in the app with <identity_id>
    Then a request is sent to <endpoint> to send an gcm push notification <notification> and returns <response>

    Examples:
      | identity_id              | endpoint                | notification              | response                        |
      | 01f0000000000000003f0001 | /api/notification/push  | gcm/valid_gcm.json        | gcm/valid_gcm_response.json     |
      | 01f0000000000000003f0001 | /api/notification/push  | gcm/invalid_gcm.json      | gcm/invalid_gcm_response.json   |