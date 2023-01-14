# FrontRunner for Binance `(beta)`

## Important. Before starting, you need to create configuration files.

`$ touch .env whitelist.js`

**.env file:**

```text
PROVIDER = ---WSS_PROVIDER---
PRIVATE_KEY = ---WALLET_PRIVATE_KEY---
```

**whitelist.js file:**

```code
module.exports = [
    // just an example
    {
        "amountFilling": 1,
        "amountBuy": 0.01,
        "address": "0x0173295183685f27c84db046b5f0bea3e683c24b"
    },
    ...
]
```

## Run with test mode

`$ npm run serve --test`
The bot is working normally, but buying and selling are disabled

## Run

`$ npm run serve`
