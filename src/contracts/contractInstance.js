
import web3 from './web3';

//Chriss
//const address = "0xc8da2acdd2d85f4ce9fe77a066bf024b4126e40d";

//Aleesha
const address = "0x9be14d8f39a4e5d61230040c9f975b3d13cc5eba";
const abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_img",
				"type": "string"
			},
			{
				"name": "_text",
				"type": "string"
			}
		],
		"name": "sendHash",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "NewPost",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getCounter",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "getHash",
		"outputs": [
			{
				"name": "img",
				"type": "string"
			},
			{
				"name": "text",
				"type": "string"
			},
			{
				"name": "owner",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

export default new web3.eth.Contract(abi, address);