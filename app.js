require('dotenv').config();

const ethers = require('ethers');

const abi = require('./utils/abi');
const { address } = require('./address');
const { Token } = require('./utils/token');
const { calcGasPrice, runInfo, beforeBuyInfo, isTokenTarget, sleep, decodeInputData, getSlippageFilling } = require('./helpers');


const init = async function () {
    const customWsProvider = new ethers.providers.WebSocketProvider(process.env.PROVIDER)

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY)
    const account = wallet.connect(customWsProvider)

    runInfo(account, process.env)

    const uniswapInterface = new ethers.utils.Interface(abi.uniswap)
    const uniswapContract = new ethers.Contract(address.pancakeRouter, abi.uniswap, account)

    customWsProvider.on('pending', tx => {
        customWsProvider.getTransaction(tx).then(async transaction => {
            if (transaction && transaction.to === address.pancakeRouter) {

                const inputData = decodeInputData(uniswapInterface, transaction.data)
                const amountIn = parseFloat(transaction.value) === 0 ? inputData.amountIn : transaction.value

                if (typeof amountIn === 'undefined' || ethers.utils.formatEther(amountIn.toString()) < 0.01) return;

                if (inputData.length > 0 && inputData[1].length > 0 && typeof inputData.amountOutMin === 'object') {

                    let tokenAddress = inputData.path.at(-1)
                    let tokenTarget = isTokenTarget(tokenAddress)

                    if (Object.keys(tokenTarget).length === 0) return

                    if (ethers.utils.formatEther(amountIn.toString()) >= tokenTarget.amountFilling) {
                        beforeBuyInfo(transaction, inputData)

                        const gasLimit = transaction.gasLimit
                        const token = new Token(account, uniswapContract, tokenAddress)

                        try {
                            const slippageFilling = await getSlippageFilling(uniswapContract, amountIn, inputData.amountOutMin, inputData.path)
                            console.log('slippage:', slippageFilling)

                            console.log('BEFORE BUY')

                            const buyGasPrice = calcGasPrice('buy', transaction.gasPrice)

                            if (!process.env.npm_config_test)
                                await token.buy(gasLimit, buyGasPrice, tokenTarget.amountBuy)

                        } catch (error) {
                            console.error('buy error')
                            console.error(error)
                            return
                        }


                        try {
                            console.log('BEFORE SELL')
                            if (!process.env.npm_config_test)
                                await token.sell(gasLimit, transaction.gasPrice)
                        } catch (error) {
                            console.error('sell error')
                            console.error(error, '\n')
                            console.warn('For manual sell:', `https://pancakeswap.finance/swap?inputCurrency=${tokenAddress}&outputCurrency=BNB`)
                            return
                        }

                        sleep(30)
                    }
                }
            }
        })
    })
}

init()
