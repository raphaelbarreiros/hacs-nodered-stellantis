[
    {
      "id": "675d1d6529f55254",
      "type": "tab",
      "label": "Stellantis",
      "disabled": false,
      "info": "",
      "env": []
    },
    {
      "id": "8839bd965a217633",
      "type": "http request",
      "z": "675d1d6529f55254",
      "name": "Send Code Request",
      "method": "POST",
      "ret": "obj",
      "paytoqs": "ignore",
      "url": "http://homeassistant.local:3000/function?token={{browserless_token}}",
      "tls": "",
      "persist": false,
      "proxy": "",
      "insecureHTTPParser": false,
      "authType": "",
      "senderr": false,
      "headers": [],
      "x": 1360,
      "y": 160,
      "wires": [
        [
          "92de1c90e324dabe"
        ]
      ]
    },
    {
      "id": "bd539d0e5bb91bcb",
      "type": "inject",
      "z": "675d1d6529f55254",
      "name": "Inject Parameters",
      "props": [
        {
          "p": "browserless_token",
          "v": "6R0W53R135510",
          "vt": "str"
        },
        {
          "p": "Brand",
          "v": "Peugeot",
          "vt": "str"
        },
        {
          "p": "client_id",
          "v": "1eebc2d5-5df3-459b-a624-20abfcf82530",
          "vt": "str"
        },
        {
          "p": "client_secret",
          "v": "T5tP7iS0cO8sC0lA2iE2aR7gK6uE5rF3lJ8pC3nO1pR7tL8vU1",
          "vt": "str"
        },
        {
          "p": "country_code",
          "v": "",
          "vt": "str"
        },
        {
          "p": "username",
          "v": "",
          "vt": "str"
        },
        {
          "p": "password",
          "v": "",
          "vt": "str"
        }
      ],
      "repeat": "",
      "crontab": "",
      "once": false,
      "onceDelay": 0.1,
      "topic": "",
      "x": 160,
      "y": 120,
      "wires": [
        [
          "ba4b2c543f8849db"
        ]
      ]
    },
    {
      "id": "ba4b2c543f8849db",
      "type": "function",
      "z": "675d1d6529f55254",
      "name": "Set Brand Variables",
      "func": "const brand = msg.Brand.toLowerCase();\nlet base_url;\nlet realm;\n\nswitch (brand) {\n    case 'peugeot':\n        base_url = 'https://idpcvs.peugeot.com/am/oauth2';\n        realm = 'clientsB2CPeugeot';\n        break;\n    case 'citroen':\n        base_url = 'https://idpcvs.citroen.com/am/oauth2';\n        realm = 'clientsB2CCitroen';\n        break;\n    case 'opel':\n        base_url = 'https://idpcvs.opel.com/am/oauth2';\n        realm = 'clientsB2COpel';\n        break;\n    case 'ds':\n        base_url = 'https://idpcvs.driveds.com/am/oauth2';\n        realm = 'clientsB2CDS';\n        break;\n    case 'vauxhall':\n        base_url = 'https://idpcvs.vauxhall.com/am/oauth2';\n        realm = 'clientsB2CVauxhall';\n        break;\n    default:\n        throw new Error('Invalid Brand');\n}\n\nmsg.base_url = base_url;\nmsg.realm = realm;\n\nreturn msg;",
      "outputs": 1,
      "timeout": "",
      "noerr": 0,
      "initialize": "",
      "finalize": "",
      "libs": [],
      "x": 380,
      "y": 160,
      "wires": [
        [
          "dea963778ea91a07"
        ]
      ]
    },
    {
      "id": "708a9c84520f6576",
      "type": "function",
      "z": "675d1d6529f55254",
      "name": "Build Code Payload",
      "func": "msg.payload = {\n    \"code\": \"export default async function({ page, context }) {\\n  const { base_url, client_id, client_secret, country_code, username, password } = context;\\n  let capturedCode = null;\\n  const oauth2Url = `${base_url}/authorize?response_type=code&client_id=${client_id}&redirect_uri=mymap://oauth2redirect/${country_code}&scope=openid&client_secret=${client_secret}`;\\n  try {\\n    await page.goto(oauth2Url, { waitUntil: 'networkidle2', timeout: 120000 });\\n    const usernameSelector = '#gigya-login-form > div.gigya-layout-row.with-divider > div.gigya-layout-cell.responsive.with-social-login > div.gigya-composite-control.gigya-composite-control-textbox > input';\\n    const passwordSelector = '#gigya-login-form > div.gigya-layout-row.with-divider > div.gigya-layout-cell.responsive.with-site-login > div.gigya-composite-control.gigya-composite-control-password > input';\\n    const submitButtonSelector = '#gigya-login-form input[type=\\\\\\\"submit\\\\\\\"].gigya-input-submit';\\n    await page.waitForSelector(usernameSelector, { visible: true, timeout: 60000 });\\n    await page.type(usernameSelector, username, { delay: 100 });\\n    await page.waitForSelector(passwordSelector, { visible: true, timeout: 60000 });\\n    await page.type(passwordSelector, password, { delay: 100 });\\n    await page.waitForFunction(selector => { const button = document.querySelector(selector); return button && !button.disabled; }, {}, submitButtonSelector);\\n    await page.evaluate(selector => { document.querySelector(selector).click(); }, submitButtonSelector);\\n    const consentButtonSelector = '#consentbutton';\\n    await page.waitForSelector(consentButtonSelector, { visible: true, timeout: 60000 });\\n    page.on('request', request => {\\n      const url = request.url();\\n      if (url.includes(`${country_code}?code=`)) {\\n        const codeMatch = url.match(/code=([a-zA-Z0-9-]+)/);\\n        if (codeMatch && codeMatch[1]) {\\n          capturedCode = codeMatch[1];\\n        }\\n      }\\n    });\\n    await page.evaluate(() => { document.querySelector('#cvs_from').submit(); });\\n    await new Promise(r => setTimeout(r, 5000));\\n    if (capturedCode) {\\n      return {\\n        data: { message: 'Consent clicked and code captured successfully.', code: capturedCode },\\n        type: 'application/json'\\n      };\\n    } else {\\n      throw new Error('No code captured.');\\n    }\\n  } catch (error) {\\n    return {\\n      data: { error: error.message },\\n      type: 'application/json'\\n    };\\n  }\\n}\",\n    \"context\": {\n        \"base_url\": msg.base_url,\n        \"client_id\": msg.client_id,\n        \"client_secret\": msg.client_secret,\n        \"country_code\": msg.country_code,\n        \"username\": msg.username,\n        \"password\": msg.password\n    }\n};\nreturn msg;",
      "outputs": 1,
      "timeout": "",
      "noerr": 0,
      "initialize": "",
      "finalize": "",
      "libs": [],
      "x": 1080,
      "y": 160,
      "wires": [
        [
          "8839bd965a217633"
        ]
      ]
    },
    {
      "id": "92de1c90e324dabe",
      "type": "function",
      "z": "675d1d6529f55254",
      "name": "Store Code",
      "func": "flow.set(\"capturedCode\", msg.payload.data.code);\nnode.warn(\"Code stored: \" + flow.get(\"capturedCode\"));\nreturn msg;",
      "outputs": 1,
      "timeout": "",
      "noerr": 0,
      "initialize": "",
      "finalize": "",
      "libs": [],
      "x": 1590,
      "y": 160,
      "wires": [
        [
          "4b642c430de07629"
        ]
      ]
    },
    {
      "id": "4b642c430de07629",
      "type": "function",
      "z": "675d1d6529f55254",
      "name": "Prepare Token Exchange",
      "func": "let client_id = msg.client_id;\nlet client_secret = msg.client_secret;\nlet credentials = Buffer.from(client_id + \":\" + client_secret).toString('base64');\nlet country_code = msg.country_code;\n\nmsg.headers = {\n    \"Content-Type\": \"application/x-www-form-urlencoded\",\n    \"Authorization\": \"Basic \" + credentials\n};\n\n// Check if we are using an authorization code or refresh token\nif (flow.get(\"capturedCode\")) {\n    // Use Authorization code\n    msg.payload = `grant_type=authorization_code&code=${flow.get(\"capturedCode\")}&redirect_uri=mymap://oauth2redirect/${country_code}`;\n} else if (flow.get(\"refresh_token\")) {\n    // Use the refresh token\n    let refresh_token = flow.get(\"refresh_token\");\n    msg.payload = `grant_type=refresh_token&refresh_token=${refresh_token}&redirect_uri=mymap://oauth2redirect/${country_code}`;\n} else {\n    // No valid token, clear stored tokens and trigger reauthorization\n    flow.set(\"access_token\", null);\n    flow.set(\"refresh_token\", null);\n    flow.set(\"id_token\", null);\n    node.warn(\"No valid refresh token, need reauthorization.\");\n    return msg;  // Exit early to trigger reauthorization\n}\n\nmsg.url = `${msg.base_url}/access_token`;\n\nreturn msg;",
      "outputs": 1,
      "timeout": "",
      "noerr": 0,
      "initialize": "",
      "finalize": "",
      "libs": [],
      "x": 1090,
      "y": 260,
      "wires": [
        [
          "a561c1229544a1c4"
        ]
      ]
    },
    {
      "id": "a561c1229544a1c4",
      "type": "http request",
      "z": "675d1d6529f55254",
      "name": "Token Exchange",
      "method": "POST",
      "ret": "obj",
      "paytoqs": "ignore",
      "url": "",
      "tls": "",
      "persist": false,
      "proxy": "",
      "insecureHTTPParser": false,
      "authType": "",
      "senderr": false,
      "headers": [],
      "x": 1360,
      "y": 260,
      "wires": [
        [
          "1d8c4de8e07fdb10"
        ]
      ]
    },
    {
      "id": "1d8c4de8e07fdb10",
      "type": "function",
      "z": "675d1d6529f55254",
      "name": "Store Tokens",
      "func": "if (msg.payload.error) {\n    node.warn(\"Token exchange error: \" + msg.payload.error);\n    if (msg.payload.error === \"invalid_grant\") {\n        // Invalid refresh token, clear tokens and reset the flow\n        flow.set(\"access_token\", null);\n        flow.set(\"refresh_token\", null);\n        flow.set(\"id_token\", null);\n        node.warn(\"Refresh token invalidated. Tokens cleared, reauthorization required.\");\n    }\n    return msg;  // Exit early to avoid further processing\n}\n\n// If no error, store the new tokens\nflow.set(\"access_token\", msg.payload.access_token);\nflow.set(\"refresh_token\", msg.payload.refresh_token);\nflow.set(\"id_token\", msg.payload.id_token);\n\nnode.warn(\"Tokens stored! \\n Access Token: \" + msg.payload.access_token + \"\\n Refresh Token: \" + msg.payload.refresh_token);\nreturn msg;",
      "outputs": 1,
      "timeout": 0,
      "noerr": 0,
      "initialize": "",
      "finalize": "",
      "libs": [],
      "x": 1590,
      "y": 260,
      "wires": [
        [
          "dea963778ea91a07"
        ]
      ]
    },
    {
      "id": "cafdaf496a51f61d",
      "type": "switch",
      "z": "675d1d6529f55254",
      "name": "Tokens Stored?",
      "property": "payload.tokenExists",
      "propertyType": "msg",
      "rules": [
        {
          "t": "false"
        },
        {
          "t": "true"
        }
      ],
      "checkall": "true",
      "repair": false,
      "outputs": 2,
      "x": 620,
      "y": 260,
      "wires": [
        [
          "708a9c84520f6576"
        ],
        [
          "02c00249b4dbdacf"
        ]
      ]
    },
    {
      "id": "c457588a216999da",
      "type": "http request",
      "z": "675d1d6529f55254",
      "name": "Vehicles",
      "method": "GET",
      "ret": "txt",
      "paytoqs": "ignore",
      "url": "",
      "tls": "",
      "persist": false,
      "proxy": "",
      "insecureHTTPParser": false,
      "authType": "",
      "senderr": false,
      "headers": [],
      "x": 420,
      "y": 500,
      "wires": [
        [
          "dd4cd04cf3513dbd"
        ]
      ]
    },
    {
      "id": "02c00249b4dbdacf",
      "type": "function",
      "z": "675d1d6529f55254",
      "name": "Prepare Vehicles",
      "func": "msg.headers = {\n    \"Authorization\": \"Bearer \" + flow.get(\"access_token\"),\n    \"x-introspect-realm\": msg.realm\n};\nmsg.url = `https://api.groupe-psa.com/connectedcar/v4/user/vehicles?client_id=${msg.client_id}&realm=${msg.realm}`;\nreturn msg;",
      "outputs": 1,
      "timeout": "",
      "noerr": 0,
      "initialize": "",
      "finalize": "",
      "libs": [],
      "x": 210,
      "y": 500,
      "wires": [
        [
          "c457588a216999da"
        ]
      ]
    },
    {
      "id": "dd4cd04cf3513dbd",
      "type": "switch",
      "z": "675d1d6529f55254",
      "name": "Token Expired?",
      "property": "payload.httpCode",
      "propertyType": "msg",
      "rules": [
        {
          "t": "eq",
          "v": "401",
          "vt": "str"
        },
        {
          "t": "else"
        }
      ],
      "checkall": "false",
      "repair": false,
      "outputs": 2,
      "x": 620,
      "y": 500,
      "wires": [
        [
          "4b642c430de07629"
        ],
        [
          "0a6709a1d2bb0468"
        ]
      ]
    },
    {
      "id": "0a6709a1d2bb0468",
      "type": "function",
      "z": "675d1d6529f55254",
      "name": "Save Vehicle Information",
      "func": "// Parse the payload if it's a string\nif (typeof msg.payload === \"string\") {\n    try {\n        msg.payload = JSON.parse(msg.payload);\n    } catch (e) {\n        node.warn(\"Failed to parse payload: \" + e.message);\n        return msg;  // Exit early if parsing fails\n    }\n}\n\n// Check if the payload has the expected structure\nif (msg.payload && msg.payload._embedded && msg.payload._embedded.vehicles && msg.payload._embedded.vehicles.length > 0) {\n    // Access the first vehicle in the list\n    let vehicle = msg.payload._embedded.vehicles[0];\n\n    // Extract the required details\n    let vehicleDetails = {\n        vin: vehicle.vin,\n        motorization: vehicle.motorization,\n        brand: vehicle.brand,\n        id: vehicle.id,\n        pictures: vehicle.pictures\n    };\n\n    // Store the vehicle details in the flow context\n    flow.set(\"vehicleDetails\", vehicleDetails);\n\n    // Debug output to confirm details were stored\n    node.warn(\"Vehicle details stored!\");\n} else {\n    // Handle cases where no vehicles are found or the structure is different\n    node.warn(\"No vehicles found or unexpected API response structure.\");\n}\n\nreturn msg;",
      "outputs": 1,
      "timeout": 0,
      "noerr": 0,
      "initialize": "",
      "finalize": "",
      "libs": [],
      "x": 1090,
      "y": 500,
      "wires": [
        [
          "f04db46c9866154c"
        ]
      ]
    },
    {
      "id": "f04db46c9866154c",
      "type": "debug",
      "z": "675d1d6529f55254",
      "name": "Vehicle Debug",
      "active": true,
      "tosidebar": true,
      "console": false,
      "tostatus": false,
      "complete": "payload",
      "targetType": "msg",
      "statusVal": "",
      "statusType": "auto",
      "x": 1340,
      "y": 500,
      "wires": []
    },
    {
      "id": "dea963778ea91a07",
      "type": "function",
      "z": "675d1d6529f55254",
      "name": "Set Token Evaluation",
      "func": "let refresh_token = flow.get(\"refresh_token\");\n\nif (refresh_token) {\n    msg.payload = { tokenExists: true };\n} else {\n    msg.payload = { tokenExists: false };\n}\n\nreturn msg;",
      "outputs": 1,
      "timeout": 0,
      "noerr": 0,
      "initialize": "",
      "finalize": "",
      "libs": [],
      "x": 380,
      "y": 260,
      "wires": [
        [
          "cafdaf496a51f61d"
        ]
      ]
    }
  ]