'use strict'

const FormData = require('form-data');
const { URL, URLSearchParams } = require('url');
const fetch = require('node-fetch');
const Headers = fetch.Headers;

const deviceUrl = 'https://api.nature.global/1/devices';
const applianceUrl = 'https://api.nature.global/1/appliances';

const getData = async (url, param) => {
    const resp = await fetch(url, param);
    const data = await resp.json();

    return data;
}

(async () => {
    const param = {
        method: 'GET',
        headers: {
            'Authorization': process.env.RTOKEN
        }
    };

    const deviceData = await getData(deviceUrl, param);
    const applianceData = await getData(applianceUrl, param);
    
    const body = {
        'app': process.env.APPID,
        'record': {
            'temp': {
                'value': deviceData[0].newest_events.te.val 
            },
            'target_temp': {
                'value': applianceData[0].settings.temp
            },
            'mode': {
                'value': applianceData[0].settings.mode 
            },
            'vol': {
                'value': applianceData[0].settings.vol 
            },
            'dir': {
                'value': applianceData[0].settings.dir 
            }
        }
    };
  
    const resp = await fetch(process.env.KINTONEURL, {
        method: 'POST',
        headers: {
            'X-Cybozu-API-Token': process.env.KTOKEN,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });

    if(resp.ok) {
        const result = await resp.json();
        console.log(result);
    } else {
        const error = await resp.json();
        console.log(error);
    }
})();