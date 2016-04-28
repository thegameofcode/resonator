# Group Templates

## Create email template [/api/notification/template]

### Create an HTML email template [POST]
Generates a new HTML email template from a non-HTML input.

**Currently supported formats are .mjml files, using the format specified by [MJML](https://mjml.io/)**

#### Attributes for the json body parameter

Name | Type | Required | Description
--- | --- | --- | ---
__filename__ | String | Required | Name of the email template to be generated
__content__ | String | Required | Input text that will be transformed into HTML
__type__ | String | Required | The input type. Currently can be ´mjml´ **only**

+ Request (application/json; charset=utf-8)

    + Body

            {
              "filename": "custom-template",
              "content": "<mj-body><mj-section><mj-column><mj-text font-size="20px" color="#F45E43" font-family="helvetica">Hello World!</mj-text></mj-column></mj-section></mj-body>",
              "type": "mjml"
            }

+ Response 200

            {
              "output": "done"
            }

+ Response 400 (application/json; charset=utf-8)

            {
              "code": "BadRequestError",
              "message": "Missing or invalid parameters: content, filename, type"
            }

## Email template listing [/api/notification/template/list]

### Fetch list of email templates [GET]
Returns a list of the email template filenames currently available

+ Request (application/json; charset=utf-8)

    + Body

            {}

+ Response 200

            [
              {
                "name": "my-template-1",
                "type": "html",
              },
              {
                "name": "my-template-2",
                "type": "html"
              }
            ]

## Email template details [/api/notification/template/details/:templateName.:type]

### Fetch email template details [GET]
Returns a the content of an email template (either HTML or other) and the placeholders it has in its content.

+ Request (application/json; charset=utf-8)

+ Response 200

            {
              "html": "<mj-body><mj-section><mj-column><mj-text font-size="20px" color="#F45E43" font-family="helvetica">Hello World!</mj-text></mj-column></mj-section></mj-body>",
              "placeholders": ["USER"]
            }

+ Response 404

            {
              "code": "NotFoundError",
              "message": "Template not found"
            }