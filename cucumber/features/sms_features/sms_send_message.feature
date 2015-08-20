Feature: the server receives a request to send SMS messages

  Scenario Outline: send SMS messages to a set of Identity objects
    Given an authenticated identity in the app with <identity_id>
    Then a mock request is sent to <endpoint> to send an SMS message <sms> and returns <response>

    Examples:
      | identity_id              | endpoint              | sms                            | response                                |
      | 01f0000000000000003f0001 | /api/notification/sms | sms/valid_sms.json             | sms/valid_sms_response.json             |
      | 01f0000000000000003f0001 | /api/notification/sms | sms/empty_sms.json             | sms/empty_sms_response.json             |
      | 01f0000000000000003f0001 | /api/notification/sms | sms/invalid_to_sms.json        | sms/invalid_to_sms_response.json        |
      | 01f0000000000000003f0001 | /api/notification/sms | sms/over_length_limit_sms.json | sms/over_length_limit_sms_response.json |
      | 01f0000000000000003f0002 | /api/notification/sms | sms/missing_to_phone.json      | sms/missing_to_phone_response.json      |
      | 01f0000000000000003f0003 | /api/notification/sms | sms/missing_from_phone.json    | sms/missing_from_phone_response.json    |
      | 01f0000000000000003f0003 | /api/notification/sms | sms/missing_message_sms.json   | sms/missing_message_sms_response.json   |
      | 01f0000000000000003f0003 | /api/notification/sms | sms/empty_message_sms.json     | sms/missing_message_sms_response.json   |
      | 01f0000000000000003f0003 | /api/notification/sms | sms/empty_to_phone.json        | sms/missing_to_phone_response.json      |
      | 01f0000000000000003f0003 | /api/notification/sms | sms/empty_from_phone.json      | sms/missing_from_phone_response.json    |
