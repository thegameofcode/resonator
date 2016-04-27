Feature: the server receives a request to create a new email template

  Scenario Outline: generate an HTML email template based on the request item
    Given an authenticated identity in the app with <identity_id>
    Then a template object <body> is sent to <endpoint> and creates template successfully with <response>

    Examples:
      | identity_id              | endpoint                         | body                                          | response                                           |
      | 01f0000000000000003f0001 | /api/notification/template | template/valid_template_creation_body.json    | template/valid_template_creation_response.js     |

  Scenario Outline: fail to generate email template based on the request item
    Given an authenticated identity in the app with <identity_id>
    Then a template object <body> is sent to <endpoint> and returns error with <response>

    Examples:
      | identity_id              | endpoint                         | body                                          | response                                           |
      | 01f0000000000000003f0001 | /api/notification/template | template/invalid_template_creation_body.json  | template/invalid_template_creation_response.js   |