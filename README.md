Node-RED Flow to connect with Stellantis API to read car sensors then save those sensors information on Home Assistant.

## **Pre-requisites:**

* Home Assistant (obviously)
* [HACS](https://www.hacs.xyz/)
* [Node-Red](https://addons.community/#node-red)
* [Browserless Chromium](https://github.com/alexbelgium/hassio-addons)

## Setting it up

#### Import Flow

1. Save Stellantis.js file on your local machine
2. Open Node-RED
3. Click on the menu (top-right hand corner)
4. Click 'Import'
5. Click 'select file to import' and select Stellantis.js you just saved
6. Click 'Import'

#### Set your variables

1. Double click on 'Inject Parameters' node
2. Set the following variables with your own information:

* browserless_token (default is already set, ignore if it works for you)
* country_code (fr = France, de = Germany, us = United States etc)
* username (your Peugeot email address)
* password (your Peugeot password)

#### Updating data automatically

1. Double click on 'Inject Parameters' node
2. Mark 'Inject once after  [ ]  seconds, then'
3. Repeat: interval
4. Every 30 minutes (recommended)

## TODO

* [x] Support Peugeot, Citroen, DS, Opel and Vauxhall
* [ ] Get data from more endpoints
* [ ] Add [Monitors](https://developer.groupe-psa.io/webapi/b2c/monitor/about/#article)
* [ ] Add [Remotes](https://developer.groupe-psa.io/webapi/b2c/remote/about/#article)
* [ ] Create entities to store info fetched on multiple enpoints
* [ ] Make *client_id* and *client_secret* dynamic - Custom webservice to be developed

Inspired by [https://github.com/flobz/psa_car_controller](https://github.com/flobz/psa_car_controller)

