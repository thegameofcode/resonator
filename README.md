Resonator
=========

[![Circle CI](https://circleci.com/gh/thegameofcode/resonator/tree/master.svg?style=svg)](https://circleci.com/gh/thegameofcode/resonator/tree/master)
[![Coverage Status](https://coveralls.io/repos/thegameofcode/resonator/badge.svg?branch=master&service=github)](https://coveralls.io/github/thegameofcode/resonator?branch=master)

Resonator is a NodeJS microservice with built-in logic to send email, SMS and push notifications in an easy manner.

# Install

1. Open a terminal window in your local machine
2. Clone the repository onto your directory of choice: `git clone https://github.com/nick13jaremek/resonator.git`
3. Enter the *resonator* directory
4. Install the *npm* modules: `npm install`
5. Run the CucumberJS and Mocha tests to verify everything is OK: `npm test`
6. Start using Resonator!

# Involved data models

There exist two main data models that Resonator uses to send notifications.

## Identity

The Identity schema models a user object which stores the relevant data for Resonator to be able to send the desired notifications.

The schema includes the following fields:
- **id**: a Mongoose *ObjectId* item to reference uniquely the Identity object in the *MongoDB* datastore.
- **devices**: a container built of several arrays, each one containing data associated to a unique transport mode. Arrays are:
  - **email**: an *Array* of email addresses.
  - **sms**: an *Array* of [Twilio](www.twilio.com) phone numbers.
  - **gcm**: an *Array* of GCM identifiers to send push notifications to Google Android devices.
  - **apn**: an *Array* of APN identifiers to send push notifications to Apple devices.
- **channels**: an *Array* of Mongoose *ObjectId* items referencing the Channel objects this Identity is subscribed to.

## Channel

The Channel schema models a channel object that can be used to create filtered groups of target Identities.
Instead of specifying an array of Identities, Resonator can specify a Channel object that the Identities belong to,
and send notifications to the channel members.

The Channel schema includes the following fields:
- **id**: a Mongoose *ObjectId* item to reference the Channel object uniquely in the *MongoDB* datastore.
- **name**: the Channel object human-friendly identifier. It is used to specify the target channel for a notifications batch.
- **identityRef**: an *Array* of Mongoose *ObjectId* items referencing zero or more Identity objects. Each Identity is a member subscribed to this channel.


# Available transport modules

Transport modules allow Resonator to send different notification types.

## Email

Email notifications are sent on top of the `mailgun` npm module. In order to use it, two items need to be set in the Resonator configuration file:
- *apiKey*
- *domain*

You may obtain valid `apiKey` and `domain` items by creating an account in the [Mailgun website](www.mailgun.com).
Alternatively, instead of hard-coding the credentials in the Resonator configuration file, you can export them as environmental variables in your local
machines by using the names specified in the `custom-env-variables` configuration file.


## SMS

SMS notifications are sent on top of the `twilio` npm module. Before using it, some credential items need to be added to the Resonator configuration file, namely:
- *account_sid*
- *auth_token*

You may obtain valid *account_sid* and *auth_token* values by creating an account in the [Twilio website](www.twilio.com).
Alternatively, you may export these items as environmental variables in your local machine by using the names specified in the `custom-env-variables` configuration file.


## Push notifications

Push notifications are powered via the `apn` and `node-gcm` npm modules. Both modules require a set of credentials to be set in the Resonator configuration.
- In the case of the `apn` module, a *private key, certificate and CA certs in PFX or PKCS12 format, or a Buffer containing the PFX data* is needed.
See the [apn](https://www.npmjs.com/package/apn) documentation for reference.
- In the case of the `node-gcm` module, a Google api key is needed in order to send push notifications to Android devices. You may export the `GOOGLE_API_KEY` environment
variable on your local machine. Check the *Resonator* configuration files for more information.

# Connecting Resonator to other modules

Resonator has been developed with the intention of reusing its services in different projects, each one requiring some of the available notification transports.
Depending on the project, the complexity associated to integrating Resonator may be lower or higher.
Here is a brief description of the steps to set up Resonator with some project of your own:

1. Communicate your project with Resonator: whenever a new user-like object is created in your project database, create an *Identity* object with **the same id** in the *Resonator* database by using the *identity* endpoint.
2. Optionally, create Channel objects in the Resonator database beforehand to filter notifications, and associate Users/Identities to a channel.
3. Send push notifications by calling the appropriate Resonator endpoints specifying the ids of the target Identities/Users and/or the names of the target channels, as well as the notifications' content in the request body.

# Documentation

Please, check the [ Resonator Apiary file](https://github.com/nick13jaremek/resonator/blob/master/apiary.apib) to check the available endpoints, request body formats and response cases.

# Testing

Resonator includes integration tests via *CucumberJS* and unit tests via *Mocha*. You may run each set of tests by using the `npm test-cucumber` and `npm test-mocha` respectively.
In order to run all tests, use the `npm test` command.

# Contributing

If you spot any bug or missing functionality, feel free to open a new issue or a pull request.

New logic **should include the corresponding tests** to ensure the consistency of the project's code.

The Apiary documentation should reflect the changes performed on the existing endpoints or on the new ones.
