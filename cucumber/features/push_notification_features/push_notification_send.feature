Feature: the server receives a request to send a push notification
@apn @gcm
  Scenario Outline: send push notification to an identity objects
    Given an authenticated identity in the app with <identity_id>
    Then a request is sent to <endpoint> to send a push notification <notification> and returns <response>

    Examples:
      | identity_id              | endpoint                | notification                  | response                               |
      | 01f0000000000000003f0003 | /api/notification/push  | push/valid_push.json          | push/valid_push_response.json          |
      | 01f0000000000000003f0002 | /api/notification/push  | push/empty_content_push.json  | push/empty_content_push_response.json  |
      | 01f0000000000000003f0001 | /api/notification/push  | push/empty_to_push.json       | push/empty_to_push_response.json       |