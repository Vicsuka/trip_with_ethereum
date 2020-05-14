var ContractEvents = {
	TripCreation: "0x828026569d4562b993e3bda939865cd0714b0ddf9187318ad325b14373751fcd",
	TripEnd: "0x1d033528c6b622bb941493045e6398bc215361b423d54781a60ab3537be11658",
	NewApplication: "0x92e70116f1ce69cb42c91edcef0e80db59fdcb1023277187f2e1a11bb31710c0",
	Unsubscription: "0xbe5350b21dbb02956b3e44ab8231102efc12e5f79318c4491ab541dd9566cc5b",
	TransactionCreation: "0xb9e8e09a20205c1db5270a076f7962852d668d1e8d65e67bd55d7042fbeeae01",
	TransactionComplete: "0x968ec7f1ca4686bd94f0b5980ed4309cb31cf47c4d528bdbbdc0204671a6652f",
	TransactionCanceled: "0x71b73eee5c68a375c1b3696e01580e2c7e653c20fce237719ef8ff94efb7a70f",
	VoteMade: "0xd7bd583010cfc30d8ff1b01becb2313742132793a8c4c29553e8e0ffe148062a"
};

var ContractAddress = "0x53f8336672e5193da17204542bda6590fe7affac";

var ContractABI =[
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "uuid",
				"type": "string"
			}
		],
		"name": "applyToTrip",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "uuid",
				"type": "string"
			}
		],
		"name": "cancelTransaction",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "uuid",
				"type": "string"
			}
		],
		"name": "checkVoteAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "uuid",
				"type": "string"
			}
		],
		"name": "checkVoteMajority",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "uuid",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "maxPeople",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "trustMode",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "deadlineDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "endingDate",
				"type": "uint256"
			}
		],
		"name": "createTrip",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "uuid",
				"type": "string"
			}
		],
		"name": "endTrip",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "uuid",
				"type": "string"
			}
		],
		"name": "makeVote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "_uuid",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "_applicant",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_currentApplicants",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_creationDate",
				"type": "uint256"
			}
		],
		"name": "NewApplication",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "uuid",
				"type": "string"
			},
			{
				"internalType": "address payable",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			}
		],
		"name": "newTransaction",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "_uuid",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_txNumber",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "_desc",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_creationDate",
				"type": "uint256"
			}
		],
		"name": "TransactionCanceled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "_uuid",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_txNumber",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "_desc",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_creationDate",
				"type": "uint256"
			}
		],
		"name": "TransactionComplete",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "_uuid",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_txNumber",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "_desc",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_creationDate",
				"type": "uint256"
			}
		],
		"name": "TransactionCreation",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "_uuid",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_maxPeople",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_trustMode",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_deadlineDate",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_endingDate",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_creationDate",
				"type": "uint256"
			}
		],
		"name": "TripCreation",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "_uuid",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_endingTime",
				"type": "uint256"
			}
		],
		"name": "TripEnd",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "uuid",
				"type": "string"
			}
		],
		"name": "unsubscribeFromTrip",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "_uuid",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "_applicant",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_currentApplicants",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_creationDate",
				"type": "uint256"
			}
		],
		"name": "Unsubscription",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "_uuid",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "_who",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_txNumber",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_creationDate",
				"type": "uint256"
			}
		],
		"name": "VoteMade",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "a",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "b",
				"type": "string"
			}
		],
		"name": "compareStrings",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "uuid",
				"type": "string"
			}
		],
		"name": "getTrip",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "uuid",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "partId",
				"type": "uint256"
			}
		],
		"name": "getTripParticipant",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "uuid",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "transId",
				"type": "uint256"
			}
		],
		"name": "getTripTransaction",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "uuid",
				"type": "string"
			}
		],
		"name": "getVotePercent",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tripIds",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "trips",
		"outputs": [
			{
				"internalType": "address",
				"name": "organizer",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tripBalance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "maxPeople",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "trustMode",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "participantNumber",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "deadlineDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "endingDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "transactionNumber",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "ended",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

module.exports = {
	ContractEvents,
	ContractAddress,
	ContractABI
};
