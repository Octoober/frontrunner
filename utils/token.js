const ethers = require('ethers');
const { address } = require('../address');
const { erc20Abi } = require('./abi');

class Token {
    constructor(account, routerContract, tokenAddress) {
        this._account = account
        this._routerContract = routerContract
        this._tokenAddress = tokenAddress
    }


    async buy(gasLimit, gasPrice, buyAmount, slippage = 0) {
        // if (isNaN(this._routerContract)) throw 'Router is NaN';

        console.warn('>>> BUY <<<')

        const amountIn = ethers.utils.parseEther(buyAmount.toString())

        let amountOutMin = 0
        if (slippage !== 0) {
            const amounts = await this._routerContract.getAmountsOut(amountIn, [address.bnb, this._tokenAddress])
            amountOutMin = amounts[1].sub(amounts[1].div(100).mul(`${slippage}`))
        }



        const tx_build = await this._routerContract.swapExactETHForTokensSupportingFeeOnTransferTokens(
            amountOutMin,
            [address.bnb, this._tokenAddress],
            this._account.address,
            (Date.now() + 1000 * 50 * 10),
            {
                'value': amountIn.toString(),
                'gasLimit': gasLimit,
                'gasPrice': gasPrice
            }
        )

        const receipt = await tx_build.wait()

        if (receipt.status === 1) {
            console.log('Buy: https://bscscan.com/tx/' + receipt.transactionHash)
        } else {
            console.error('Buy transaction error')
        }
    }

    async sell(gasLimit, gasPrice) {
        console.warn('>>> SELL <<<')

        const erc20TokenContract = new ethers.Contract(this._tokenAddress, erc20Abi, this._account)

        const tokenBalance = await erc20TokenContract.balanceOf(this._account.address)
        const approve = await erc20TokenContract.approve(address.pancakeRouter, tokenBalance)

        const receipt_approve = await approve.wait()

        if (receipt_approve && receipt_approve.blockNumber && receipt_approve.status === 1) {
            console.log('Success approved')

            const tx_build = await this._routerContract.swapExactTokensForETHSupportingFeeOnTransferTokens(
                tokenBalance, 0,
                [this._tokenAddress, address.bnb],
                this._account.address,
                (Date.now() + 1000 * 60 * 10),
                {
                    'gasLimit': gasLimit,
                    'gasPrice': gasPrice
                }
            )

            const receipt = await tx_build.wait()

            if (receipt.status === 1) {
                console.log('Sell: https://bscscan.com/tx/' + receipt.transactionHash)
            } else {
                console.error('Sell transaction error')
            }
        }
    }
}




module.exports = {
    Token
}