Feature: the server receives a request to send a push notification
@ignore
  Scenario Outline: send push notification to an identity objects
    Given an authenticated identity in the app with <identity_id>
    Then a request is sent to <endpoint> to send a push notification <notification> and returns <response>

    Examples:
      | identity_id              | endpoint                | notification                                          | response                                                    |
      | 01f0000000000000003f0001 | /api/notification/push  | push_notification/valid_push_notification.json        | push_notification/valid_push_notification_response.json     |
      | 01f0000000000000003f0001 | /api/notification/push  | push_notification/invalid_push_notification.json      | push_notification/invalid_push_notification_response.json   |