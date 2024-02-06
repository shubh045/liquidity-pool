// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ERC20.sol";

contract LiquidityPool{
    ERC_20 public RBNT;
    ERC_20 public SHUBH;

    uint public reserveRBNT;
    uint public  reserveSHUBH;

    constructor(ERC_20 _rbnt, ERC_20 _shubh) {
        RBNT = _rbnt;
        SHUBH = _shubh;
        // RBNT.mint(address(this), reserveRBNT);
        // SHUBH.mint(address(this), reserveSHUBH);
    }

    function exchange(uint _amount) external returns(uint amountOut){
        require(_amount <= RBNT.balanceOf(msg.sender), "Insufficient balance");
        RBNT.transferFrom(msg.sender, address(this), _amount);

        uint amountInWithFee = (_amount * 997) / 1000;
        amountOut = (reserveSHUBH * amountInWithFee) / (reserveRBNT + amountInWithFee);

        SHUBH.transfer(msg.sender, amountOut);
        _updateReserve(RBNT.balanceOf(address(this)), SHUBH.balanceOf(address(this)));
    }

    function _updateReserve(uint256 _reserve0, uint256 _reserve1) private {
        reserveRBNT = _reserve0;
        reserveSHUBH = _reserve1;
    }

    function addLiquidity(uint _amount0, uint _amount1) external {
        RBNT.transferFrom(msg.sender, address(this), _amount0);
        SHUBH.transferFrom(msg.sender, address(this), _amount1);
        _updateReserve(RBNT.balanceOf(address(this)), SHUBH.balanceOf(address(this)));
    }

    function checkBalance(address _address) external view returns(uint _rbnt, uint _shubh) {
        _rbnt = RBNT.balanceOf(_address);
        _shubh = SHUBH.balanceOf(_address);
    }

    function getBalance() external view returns(uint){
        return RBNT.balanceOf(msg.sender);
    }
}