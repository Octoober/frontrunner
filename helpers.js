const { ethers } = require("ethers");
const whitelist = require('./whitelist');

const calcGasPrice = (action, amount) => {
    const data = ethers.utils.formatUnits(action === 'buy' ? amount.add(1000000000) : amount.sub(1000000000), 'wei')
    return ethers.BigNumber.from(data.toString())
}


const runInfo = (account, env_config) => {
    console.log('\n')
    console.log('************')
    if (process.env.npm_config_test) console.warn('TEST MODE')
    console.log('address:', account.address)
    console.log('provider url:', account.provider.connection.url)
    if (typeof (env_config.MIN_PRICE_TARGET) !== 'undefined') {
        const msg = 'amount target:'
        const min_amount = parseFloat(env_config.MIN_PRICE_TARGET)
        if (min_amount < 1) {
            console.warn(msg, min_amount)
            console.warn('small value for the minimum target purchase!')
        } else {
            console.log(msg, min_amount)
        }
    }
    console.log('************', '\n\n')
}

const beforeBuyInfo = (tx, txData) => {
    console.log('\n')
    console.log('************')
    console.log('target amount:', ethers.utils.formatEther(tx.value))
    console.log('from address:', tx.from)
    console.log('to address:', tx.to)
    console.log('token address:', txData.path.at(-1))
    console.log('hash:', tx.hash)
    console.log('************', '\n\n')
}


const getSlippageFilling = async (routerContract, amountIn, amountOutMin, path) => {
    let amountsOut = await routerContract.getAmountsOut(amountIn, path)

    return (amountsOut.at(-1) - amountOutMin) / amountOutMin * 100
}

const isTokenTarget = (tokenAddress) => {
    for (const value of whitelist) {
        if (value.address.toUpperCase() == tokenAddress.toUpperCase()) {
            return value
        }
        return {}
    }
}

const sleep = (seconds) => {
    console.log('sleep start')
    let start = new Date().getTime();
    while (new Date().getTime() < start + (seconds * 1000)) {
        // sleep
    }
    console.log('sleep end')
}

const decodeInputData = (interface, data) => {
    /**
     * Yes, this is a very bad snippet, but how to make it better?
     */
    let inputData = []
    
    try {
        inputData = interface.decodeFunctionData('swapExactETHForTokens', data)
    } catch (error) {
        try {
            inputData = interface.decodeFunctionData('swapETHForExactTokens', data)
        } catch (error) {
            try {
                inputData = interface.decodeFunctionData('swapExactETHForTokensSupportingFeeOnTransferTokens', data)
            } catch (error) {
                try {
                    inputData = interface.decodeFunctionData('swapExactTokensForTokens', data)
                } catch (error) {
                    return inputData
                }
            }
        }
    }

    return inputData
}

module.exports = {
    isTokenTarget,
    calcGasPrice,
    runInfo,
    beforeBuyInfo,
    getSlippageFilling,
    sleep,
    decodeInputData,
}