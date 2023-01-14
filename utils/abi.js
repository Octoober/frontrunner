
// ABI for PancakeSwap Router V2 (https://bscscan.com/address/0x10ed43c718714eb63d5aa57b78b54704e256024e)
const uniswap = [
    'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
    'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
    'function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external',
    'function swapExactTokensForETH(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable',
    
    'function swapETHForExactTokens(uint256 amountOut, address[] path, address to, uint256 deadline)',
    'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)',
    'function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)',
    'function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable',
]

const erc20Abi = [
    'function balanceOf(address _owner) external view returns (uint)',
    'function approve(address spender, uint value) external returns (bool)'
]

module.exports = {
    uniswap,
    erc20Abi,
}