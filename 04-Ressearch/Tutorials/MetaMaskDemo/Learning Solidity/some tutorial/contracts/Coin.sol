pragma solidity ^0.4.2;

contract Coin {
    // The keyword "public" makes those variables
    // readable from outside.
    address public minter;
    mapping (address => uint) public balances;

    // Events allow light clients to react on
    // changes efficiently.
    event Sent(address from, address to, uint amount);

    // This is the constructor whose code is
    // run only when the contract is created.
    function Coin() {
        minter = msg.sender;
    }

    function mint(address receiver, uint amount) {
        if (msg.sender != minter) return;
        balances[receiver] += amount;
    }

    function send(address sender, address receiver, uint amount) {
        if (balances[sender] < amount) return;
        balances[sender] -= amount;
        balances[receiver] += amount;
        Sent(sender, receiver, amount);
    }
}
