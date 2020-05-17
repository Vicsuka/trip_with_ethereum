import React, { useState, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import Loader from 'react-loader-spinner';

// @material-ui/core components
import { Dialog } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import SnackbarContent from "components/Snackbar/SnackbarContent";
import Table from "components/Table/Table.js";

import GlobalVariables from "variables/general.js";

import Web3 from 'web3';

// @material-ui/icons
import HistoryIcon from '@material-ui/icons/History';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import HowToRegOutlinedIcon from '@material-ui/icons/HowToRegOutlined';
import BuildIcon from '@material-ui/icons/Build';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import SmsIcon from '@material-ui/icons/Sms';
import WcIcon from '@material-ui/icons/Wc';
// core components
import CardIcon from "components/Card/CardIcon.js";

import DoneOutline from "@material-ui/icons/DoneOutline";
import Error from "@material-ui/icons/Error";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import Snackbar from "components/Snackbar/Snackbar";

const secondaryStyles = {
    cardCategoryWhite: {
        color: "rgba(255,255,255,.62)",
        margin: "0",
        fontSize: "14px",
        marginTop: "0",
        marginBottom: "0"
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none"
    },
    gradientButton: {
        backgroundImage: "linear-gradient(to right, #FF512F 0%, #F09819 51%)",
    },
    centerLoader: {
        textAlign: "center"
    }


};

const useStyles = makeStyles(styles);
const useMoreStyles = makeStyles(secondaryStyles);

export default function TripDetails(props) {
    var tripId = props.match.params.tripId;
    const classes = useStyles();
    const secondaryClasses = useMoreStyles();

    const [succApply, setApplyNoti] = useState(false);
    const [errApply, setApplyErrNoti] = useState(false);
    const [succUnsub, setUnsubSucc] = useState(false);
    const [errUnsub, setUnsubErr] = useState(false);

    const [succVote, setSuccVote] = useState(false);
    const [errVote, setErrVote] = useState(false);
    const [succTranCreate, setSuccTranCreate] = useState(false);
    const [errTranCreate, setErrTranCreate] = useState(false);
    const [succTranCancel, setSuccTranCancel] = useState(false);
    const [errTranCancel, setErrTranCancel] = useState(false);
    const [succEnd, setSuccEnd] = useState(false);
    const [errEnd, setErrEnd] = useState(false);
    

    const [isFree, setFree] = useState(false);
    const [tripEnded, setTripEnded] = useState(false);
    const [isLoading, setLoading] = useState(true);

    const [transactionInProgress, setTransactionInProgress] = useState(false);

    const [isContractReady, setContractReady] = useState(false);
    const [isEthEnabled, setEthEnabled] = useState(false);
    const [isUserApplied, setUserApplied] = useState(false);
    const [isUserOrganizer, setUserOrganizer] = useState(false);
    const [isDeadlinePassed, setDeadlinePassed] = useState(false);
    const [isEnddatePassed, setEnddatePassed] = useState(false);

    const [transactionAddress, setTransactionAddress] = useState("");
    const [transactionAmount, setTransactionAmount] = useState("");
    const [transactionDescription, setTransactionDescription] = useState("");

    const [events, setEvents] = useState([]);

    const [trip, setTrip] = useState({});
    const [participants, setParticipants] = useState([]);

    const [showDialog, setShowDialog] = React.useState(false);
    const open = () => {
        setTransactionAddress("");
        setTransactionAmount("");
        setTransactionDescription("");
        setShowDialog(true);
    }

    const close = () => setShowDialog(false);

    useEffect(() => {
        if (window.ethereum) {
            enableEthereum();
            setEthEnabled(true);
            findCreationEvent();
            loadAllEvents();
        }
        loadTrip();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const findCreationEvent = () => {
        var tripIdHASH = window.web3.eth.abi.encodeEventSignature(tripId);

        var options = {
            fromBlock: 0,
            toBlock: 'latest',
            address: GlobalVariables.ContractAddress,
            topics: [GlobalVariables.ContractEvents.TripCreation, tripIdHASH]
        };


        window.web3.eth.subscribe('logs', options, function (error, result) {
            if (error) console.log(error);
        }).on("data", function (log) {
            setContractReady(true);
        })
    }

    const loadAllEvents = () => {
        var tripIdHASH = window.web3.eth.abi.encodeEventSignature(tripId);

        var options = {
            fromBlock: 0,
            toBlock: 'latest',
            address: GlobalVariables.ContractAddress,
            topics: [null, tripIdHASH]
        };


        window.web3.eth.subscribe('logs', options, function (error, result) {
            if (error) console.log(error);
        }).on("data", function (log) {
            switch (log.topics[0]) {
                case (GlobalVariables.ContractEvents.TripCreation):
                    var creationEvent = window.web3.eth.abi.decodeParameters([
                        { type: 'uint256', name: 'price' },
                        { type: 'uint256', name: 'maxPeople' },
                        { type: 'uint256', name: 'trustMode' },
                        { type: 'uint256', name: 'deadlineDate' },
                        { type: 'uint256', name: 'endingDate' },
                        { type: 'uint256', name: 'creationDate' },
                    ], log.data);

                    setEvents(events => [...events, ["TripCreation", convertUinxToDateString(creationEvent.creationDate), getCreationParameters(creationEvent), <a rel="noopener noreferrer" target="_blank" href={"https://ropsten.etherscan.io/tx/" + log.transactionHash}>Transacion</a>]]);
                    break;
                case (GlobalVariables.ContractEvents.TripEnd):
                    var TripEndevent = window.web3.eth.abi.decodeParameters([
                        { type: 'uint256', name: 'endingDate' },
                    ], log.data);
                    setTripEnded(true);
                    setEvents(events => [...events, ["TripEnd", convertUinxToDateString(TripEndevent.endingDate), <a rel="noopener noreferrer" target="_blank" href={"https://ropsten.etherscan.io/tx/" + log.transactionHash}>Transacion</a>]]);
                    break;
                case (GlobalVariables.ContractEvents.NewApplication):
                    var NewApplicationevent = window.web3.eth.abi.decodeParameters([
                        { type: 'address', name: 'applicant' },
                        { type: 'uint256', name: 'currentApplicants' },
                        { type: 'uint256', name: 'creationDate' },
                    ], log.data);

                    setEvents(events => [...events, ["NewApplication", convertUinxToDateString(NewApplicationevent.creationDate), "Applicant address: " + NewApplicationevent.applicant + ", Current participants: " + NewApplicationevent.currentApplicants, <a rel="noopener noreferrer" target="_blank" href={"https://ropsten.etherscan.io/tx/" + log.transactionHash}>Transacion</a>]]);
                    break;
                case (GlobalVariables.ContractEvents.Unsubscription):
                    var Unsubscriptionevent = window.web3.eth.abi.decodeParameters([
                        { type: 'address', name: 'unsubscribed' },
                        { type: 'uint256', name: 'currentApplicants' },
                        { type: 'uint256', name: 'creationDate' },
                    ], log.data);

                    setEvents(events => [...events, ["Unsubscription", convertUinxToDateString(Unsubscriptionevent.creationDate), "Unsubscribed address: " + Unsubscriptionevent.unsubscribed + ", Current participants: " + Unsubscriptionevent.currentApplicants, <a rel="noopener noreferrer" target="_blank" href={"https://ropsten.etherscan.io/tx/" + log.transactionHash}>Transacion</a>]]);
                    break;
                case (GlobalVariables.ContractEvents.TransactionCreation):
                    var TransactionCreationevent = window.web3.eth.abi.decodeParameters([
                        { type: 'address', name: 'to' },
                        { type: 'uint256', name: 'amount' },
                        { type: 'uint256', name: 'txNumber' },
                        { type: 'string', name: 'description' },
                        { type: 'uint256', name: 'creationDate' },
                    ], log.data);

                    setEvents(events => [...events, ["TransactionCreation", convertUinxToDateString(TransactionCreationevent.creationDate), getTransactionCreation(TransactionCreationevent), <a rel="noopener noreferrer" target="_blank" href={"https://ropsten.etherscan.io/tx/" + log.transactionHash}>Transacion</a>]]);
                    break;
                case (GlobalVariables.ContractEvents.TransactionComplete):
                    var TransactionCompleteevent = window.web3.eth.abi.decodeParameters([
                        { type: 'address', name: 'to' },
                        { type: 'uint256', name: 'amount' },
                        { type: 'uint256', name: 'txNumber' },
                        { type: 'string', name: 'description' },
                        { type: 'uint256', name: 'creationDate' },
                    ], log.data);

                    setEvents(events => [...events, ["TransactionComplete", convertUinxToDateString(TransactionCompleteevent.creationDate), getTransactionCreation(TransactionCompleteevent), <a rel="noopener noreferrer" target="_blank" href={"https://ropsten.etherscan.io/tx/" + log.transactionHash}>Transacion</a>]]);
                    break;
                case (GlobalVariables.ContractEvents.TransactionCanceled):
                    var TransactionCanceledevent = window.web3.eth.abi.decodeParameters([
                        { type: 'uint256', name: 'txNumber' },
                        { type: 'string', name: 'description' },
                        { type: 'uint256', name: 'creationDate' },
                    ], log.data);

                    setEvents(events => [...events, ["TransactionCanceled", convertUinxToDateString(TransactionCanceledevent.creationDate), "Transaction number: " + TransactionCanceledevent.txNumber + ", Description: " + TransactionCanceledevent.description, <a rel="noopener noreferrer" target="_blank" href={"https://ropsten.etherscan.io/tx/" + log.transactionHash}>Transacion</a>]]);
                    break;
                case (GlobalVariables.ContractEvents.VoteMade):
                    var VoteMadeevent = window.web3.eth.abi.decodeParameters([
                        { type: 'address', name: 'who' },
                        { type: 'uint256', name: 'txNumber' },
                        { type: 'uint256', name: 'creationDate' },
                    ], log.data);

                    setEvents(events => [...events, ["VoteMade", convertUinxToDateString(VoteMadeevent.creationDate), "Voter address: " + VoteMadeevent.who + ", On transaction: " + VoteMadeevent.txNumber, <a rel="noopener noreferrer" target="_blank" href={"https://ropsten.etherscan.io/tx/" + log.transactionHash}>Transacion</a>]]);
                    break;
                default:
                    console.log("Unknown Event");
            }
        })
    }

    const getCreationParameters = (event) => {
        return "Price: " + event.price + " (wei), Max participants: " + event.maxPeople + ", Trust factor: " + event.trustMode + ", Deadline date: " + convertUinxToDateString(event.deadlineDate) + ", Ending date: " + convertUinxToDateString(event.endingDate);
    }

    const getTransactionCreation = (event) => {
        return "Send to: " + event.to + ", Amount to send: " + event.amount + " (wei), Transaction number: " + event.txNumber + ", Description: " + event.description;
    }

    const convertUinxToDateString = (unixTime) => {
        return moment.unix(unixTime).format("YYYY. MM. DD. HH:mm");
    }

    const loadTrip = () => {
        fetch("/api/trip/trips/" + tripId)
            .then(response => response.json())
            .then(
                (data) => {
                    if (data.trip !== null) {
                        if (data.trip.price === 0) setFree(true);
                        setTrip(data.trip);
                        setDeadlinePassed(!moment(moment().format("YYYY-MM-DD")).isBefore(data.trip.deadLineDate));
                        setEnddatePassed(!moment(moment().format("YYYY-MM-DD")).isBefore(data.trip.endingDate));
                        setUserApplied(data.isUserApplied);
                        setUserOrganizer(data.isUserOrganizer);
                        loadParticipants(data.trip);
                    }
                },
                (error) => {
                    console.log(error);
                }
            )
    }

    const loadParticipants = (data) => {
        setParticipants(participants => []);
        data.participantIds.forEach(id => {
            fetch("/api/user/users/" + id)
                .then(response => response.json())
                .then(
                    (participant) => {
                        setParticipants(participants => [...participants, participant]);
                        setLoading(false);
                    },
                    (error) => {
                        console.log(error);
                    }
                )
        })
    }

    async function enableEthereum() {
        window.web3 = new Web3(Web3.givenProvider || "https://ropsten.infura.io/v3/63eae98070cc47a681277e95a2b2d7c0");
        try {
            // Request account access if needed
            await window.ethereum.enable();

            window.ethereum.on('chainChanged', () => {
                document.location.reload()
            })
            // Acccounts now exposed

        } catch (error) {
            // User denied account access...
        }
    }

    const handleUnsubscription = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tripId: tripId })
        };

        fetch('/api/trip/unsubscribe', requestOptions)
            .then(response => response.json())
            .then(
                (data) => {
                    setTransactionInProgress(false);
                    if (!data.errors) {
                        if (!succUnsub) {
                            setUnsubSucc(true);
                            setTimeout(function () {
                                setUnsubSucc(false);
                            }, 3000);
                        }
                        if (data.trip !== null) {
                            if (data.trip.price === 0) setFree(true);
                            setTrip(data.trip);
                            setDeadlinePassed(!moment(moment().format("YYYY-MM-DD")).isBefore(data.trip.deadLineDate));
                            setEnddatePassed(!moment(moment().format("YYYY-MM-DD")).isBefore(data.trip.endingDate));
                            setUserApplied(data.isUserApplied);
                            setUserOrganizer(data.isUserOrganizer);
                            loadParticipants(data.trip);
                        }
                    } else {
                        console.log(data);
                        if (!errUnsub) {
                            setUnsubErr(true);
                            setTimeout(function () {
                                setUnsubErr(false);
                            }, 3000);
                        }
                    }
                 },
                (error) => {
                    setTransactionInProgress(false);
                    if (!errUnsub) {
                        setUnsubErr(true);
                        setTimeout(function () {
                            setUnsubErr(false);
                        }, 3000);
                    }
                    console.log(error);
                }
            )
    }

    const endTrip = () => {
        window.web3.eth.getAccounts(function (error, result) {
            if (!error) {
                setTransactionInProgress(true);
                var contract = new window.web3.eth.Contract(GlobalVariables.ContractABI, GlobalVariables.ContractAddress);

                contract.methods.endTrip(tripId).send({ from: result[0], gas: 300000, gasPrice: window.web3.utils.toWei("20", 'gwei') })
                    .on('transactionHash', hash => {
                    })
                    .then(receipt => {
                        setTransactionInProgress(false);
                        console.log(receipt);
                        if (!succEnd) {
                            setSuccEnd(true);
                            setTimeout(function () {
                                setSuccEnd(false);
                            }, 3000);
                        }
                    })
                    .catch(err => {
                        setTransactionInProgress(false);
                        if (!errEnd) {
                            setErrEnd(true);
                            setTimeout(function () {
                                setErrEnd(false);
                            }, 3000);
                        }
                        console.log('Error', err);
                    })
            }
        });
    }

    const cancelTransaction = () => {
        window.web3.eth.getAccounts(function (error, result) {
            if (!error) {
                setTransactionInProgress(true);
                var contract = new window.web3.eth.Contract(GlobalVariables.ContractABI, GlobalVariables.ContractAddress);

                contract.methods.cancelTransaction(tripId).send({ from: result[0], gas: 300000, gasPrice: window.web3.utils.toWei("20", 'gwei') })
                    .on('transactionHash', hash => {
                    })
                    .then(receipt => {
                        setTransactionInProgress(false);
                        if (!succTranCancel) {
                            setSuccTranCancel(true);
                            setTimeout(function () {
                                setSuccTranCancel(false);
                            }, 3000);
                        }
                        console.log(receipt);
                    })
                    .catch(err => {
                        setTransactionInProgress(false);
                        if (!errTranCancel) {
                            setErrTranCancel(true);
                            setTimeout(function () {
                                setErrTranCancel(false);
                            }, 3000);
                        }
                        console.log('Error', err)
                    })
            }
        });
    }

    const createTransaction = () => {
        window.web3.eth.getAccounts(function (error, result) {
            if (!error) {
                setTransactionInProgress(true);
                var contract = new window.web3.eth.Contract(GlobalVariables.ContractABI, GlobalVariables.ContractAddress);
                if (!window.web3.utils.isAddress(transactionAddress)) return;
                contract.methods.newTransaction(tripId, transactionAddress, window.web3.utils.toWei(transactionAmount.toString()), transactionDescription).send({ from: result[0], gas: 300000, gasPrice: window.web3.utils.toWei("20", 'gwei') })
                    .on('transactionHash', hash => {
                    })
                    .then(receipt => {
                        console.log(receipt);
                        close();
                        if (!succTranCreate) {
                            setSuccTranCreate(true);
                            setTimeout(function () {
                                setSuccTranCreate(false);
                            }, 3000);
                        }
                        setTransactionInProgress(false);
                    })
                    .catch(err => {
                        console.log('Error', err);
                        close();
                        if (!errTranCreate) {
                            setErrTranCreate(true);
                            setTimeout(function () {
                                setErrTranCreate(false);
                            }, 3000);
                        }
                        setTransactionInProgress(false);
                    })
            }
        });
    }

    const makeVote = () => {
        window.web3.eth.getAccounts(function (error, result) {
            if (!error) {
                setTransactionInProgress(true);
                var contract = new window.web3.eth.Contract(GlobalVariables.ContractABI, GlobalVariables.ContractAddress);

                contract.methods.makeVote(tripId).send({ from: result[0], gas: 300000, gasPrice: window.web3.utils.toWei("20", 'gwei') })
                    .on('transactionHash', hash => {
                    })
                    .then(receipt => {
                        setTransactionInProgress(false);
                        if (!succVote) {
                            setSuccVote(true);
                            setTimeout(function () {
                                setSuccVote(false);
                            }, 3000);
                        }
                        console.log(receipt);
                    })
                    .catch(err => {
                        setTransactionInProgress(false);
                        if (!errVote) {
                            setErrVote(true);
                            setTimeout(function () {
                                setErrVote(false);
                            }, 3000);
                        }
                        console.log('Error', err)
                    })
            }
        });
    }

    const unsubscribeFromTrip = () => {
        window.web3.eth.getAccounts(function (error, result) {
            if (!error) {
                setTransactionInProgress(true);
                var contract = new window.web3.eth.Contract(GlobalVariables.ContractABI, GlobalVariables.ContractAddress);

                contract.methods.unsubscribeFromTrip(tripId).send({ from: result[0], gas: 300000, gasPrice: window.web3.utils.toWei("20", 'gwei') })
                    .on('transactionHash', hash => {
                    })
                    .then(receipt => {
                        handleUnsubscription();
                    })
                    .catch(err => {
                        setTransactionInProgress(false);
                        if (!errUnsub) {
                            setUnsubErr(true);
                            setTimeout(function () {
                                setUnsubErr(false);
                            }, 3000);
                        }
                        console.log('Error', err)
                    })
            }
        });
    }

    const applyToTrip = () => {
        window.web3.eth.getAccounts(function (error, result) {
            if (!error) {
                setTransactionInProgress(true);
                var contract = new window.web3.eth.Contract(GlobalVariables.ContractABI, GlobalVariables.ContractAddress);

                contract.methods.applyToTrip(tripId).send({ from: result[0], gas: 3000000, gasPrice: window.web3.utils.toWei("20", 'gwei'), value: window.web3.utils.toWei(trip.price.toString(), 'ether') })
                    .on('transactionHash', hash => {
                    })
                    .then(receipt => {
                        handleApply();
                    })
                    .catch(err => {                        
                        setTransactionInProgress(false);
                        if (!errApply) {
                            setApplyErrNoti(true);
                            setTimeout(function () {
                                setApplyErrNoti(false);
                            }, 3000);
                        }
                        console.log('Error', err);
                    })
            }
        });
    }

    const handleTransactionAddressChange = (event, value) => {
        setTransactionAddress(event.target.value);
    }

    const handleTransactionAmountChange = (event, value) => {
        setTransactionAmount(event.target.value);
    }

    const handleTransactionDescriptionChange = (event, value) => {
        setTransactionDescription(event.target.value);
    }

    const handleApply = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tripId: tripId })
        };

        fetch('/api/trip/apply', requestOptions)
            .then(response => response.json())
            .then(
                (data) => {                    
                    setTransactionInProgress(false);
                    if (!data.errors) {
                        if (!succApply) {
                            setApplyNoti(true);
                            setTimeout(function () {
                                setApplyNoti(false);
                            }, 3000);
                        }
                        if (data.trip !== null) {
                            if (data.trip.price === 0) setFree(true);
                            setTrip(data.trip);
                            setDeadlinePassed(!moment(moment().format("YYYY-MM-DD")).isBefore(data.trip.deadLineDate));
                            setEnddatePassed(!moment(moment().format("YYYY-MM-DD")).isBefore(data.trip.endingDate));
                            setUserApplied(data.isUserApplied);
                            setUserOrganizer(data.isUserOrganizer);
                            loadParticipants(data.trip);
                        }
                    } else {
                        console.log(data);
                        if (!errApply) {
                            setApplyErrNoti(true);
                            setTimeout(function () {
                                setApplyErrNoti(false);
                            }, 3000);
                        }
                    }

                },
                (error) => {
                    setTransactionInProgress(false);
                    if (!errApply) {
                        setApplyErrNoti(true);
                        setTimeout(function () {
                            setApplyErrNoti(false);
                        }, 3000);
                    }
                    console.log(error);
                }
            )
    }

    const renderType = () => {
        switch (trip.smartContractType) {
            case "1":
                return 'Personal vote';
            case "2":
                return 'Majority vote';
            case "3":
                return 'Full trust';
            default:
                return 'Unknown type';
        }
    }

    const renderStatus = () => {
        if (isDeadlinePassed) {
            if (moment(moment().format("YYYY-MM-DD")).isBefore(trip.startingDate)) {
                return 'Preparing';
            } else if (moment(moment().format("YYYY-MM-DD")).isBefore(trip.endingDate)) {
                return 'Ongoing';
            } else {
                return 'Finished';
            }
        } else {
            return 'Organizing';
        }

    }

    const renderedParticipants = participants.map((participant, i) => {
        return (<Link to={`/admin/user/${participant.auth0id}`} key={i}>{participant.firstname + " " + participant.lastname}<br></br></Link>)
    })

    return (
        <div>
            {
                isLoading
                    ?
                    <div className={secondaryClasses.centerLoader}>
                        <Loader type="Grid" color="#ff9800" height={120} width={120} />
                    </div>
                    :
                    <div>
                        <GridContainer >
                            <GridItem xs={12} sm={6} md={6}>
                                <Button color="warning" size="lg" onClick={props.history.goBack}>Back</Button>

                            </GridItem>
                            <GridItem xs={12} sm={6} md={3} className={secondaryClasses.alignRight}>

                                <div>
                                    {isFree
                                        ?
                                        ""
                                        :
                                        isEthEnabled
                                            ?
                                            isContractReady
                                                ?
                                                isEnddatePassed
                                                    ?
                                                    tripEnded
                                                        ?
                                                        <SnackbarContent
                                                            message={
                                                                'This trip has already ended!'
                                                            }
                                                            color="danger"
                                                        />
                                                        :
                                                            transactionInProgress
                                                            ?
                                                            <Loader type="Watch" color="#ff9800" height={45} width={45} />
                                                            :
                                                            <Button color="info" block size="lg" onClick={endTrip}>End trip</Button>
                                                    :
                                                    ""
                                                :
                                                ""
                                            :
                                            ""
                                    }
                                </div>
                            </GridItem>

                            <GridItem xs={12} sm={6} md={3} className={secondaryClasses.alignRight}>
                                <div>
                                    {isFree
                                        ?
                                        isDeadlinePassed
                                            ?
                                            isEnddatePassed
                                                ?
                                                    ""
                                                :
                                                <SnackbarContent
                                                    message={
                                                        'Application deadline has already passed!'
                                                    }
                                                    color="danger"
                                                />
                                            :
                                            transactionInProgress
                                                ?
                                                    <Loader type="Watch" color="#ff9800" height={45} width={45} />
                                                :
                                                isUserApplied
                                                    ?
                                                    isUserOrganizer
                                                        ? ""
                                                        : <Button color="danger" block size="lg" onClick={handleUnsubscription}>Unsubscribe from trip</Button>
                                                    : <Button className={secondaryClasses.gradientButton} block size="lg" onClick={handleApply}>Apply to trip</Button>
                                        :
                                        isEthEnabled
                                            ?
                                            isContractReady
                                                ?
                                                isDeadlinePassed
                                                    ?
                                                        isEnddatePassed
                                                            ?
                                                                ""
                                                            :
                                                            <SnackbarContent
                                                                message={
                                                                    'Application deadline has already passed!'
                                                                }
                                                                color="danger"
                                                            />
                                                    :
                                                    transactionInProgress
                                                        ?
                                                            <Loader type="Watch" color="#ff9800" height={45} width={45} />
                                                        : 
                                                            isUserApplied
                                                                ? 
                                                                isUserOrganizer
                                                                    ? ""
                                                                    : <Button color="danger" block size="lg" onClick={handleUnsubscription}>Unsubscribe from trip</Button>
                                                                : <Button className={secondaryClasses.gradientButton} block size="lg" onClick={handleApply}>Apply to trip</Button>
                                                :
                                                <SnackbarContent
                                                    message={
                                                        'This trip is currently being deployed on the blockchain!'
                                                    }
                                                    color="info"
                                                />
                                            :
                                            <SnackbarContent
                                                message={
                                                    'You are not connected to the Ethereum network!'
                                                }
                                                color="danger"
                                            />
                                    }
                                </div>
                            </GridItem>
                        </GridContainer>

                        <GridContainer>
                            <GridItem xs={12} sm={12} md={12}>
                                <Card>
                                    <CardHeader color="warning">
                                        <h4 className={secondaryClasses.cardTitleWhite}>{trip.title}</h4>
                                        <p className={secondaryClasses.cardCategoryWhite}>
                                            {trip.startingDate} - {trip.endingDate}
                                        </p>
                                    </CardHeader>
                                    <CardBody>
                                        <GridContainer>
                                            <GridItem xs={12} sm={6} md={6}>
                                                <Card>
                                                    <CardHeader color="warning" stats icon>
                                                        <CardIcon color="warning">
                                                            <HistoryIcon></HistoryIcon>
                                                        </CardIcon>
                                                        <p className={classes.cardCategory}>Status</p>
                                                        <h3 className={classes.cardTitle}>{renderStatus()}</h3>
                                                    </CardHeader>
                                                </Card>
                                            </GridItem>
                                            <GridItem xs={12} sm={6} md={6}>
                                                <Card>
                                                    <CardHeader color="warning" stats icon>
                                                        <CardIcon color="warning">
                                                            <HowToRegOutlinedIcon></HowToRegOutlinedIcon>
                                                        </CardIcon>
                                                        <p className={classes.cardCategory}>Participants</p>
                                                        <h3 className={classes.cardTitle}>{trip.participantIds ? trip.participantIds.length : "?"} / {trip.maxPersons}</h3>
                                                    </CardHeader>
                                                </Card>
                                            </GridItem>
                                            {
                                                isFree
                                                    ?
                                                    ""
                                                    :
                                                    <GridItem xs={12} sm={12} md={12}>
                                                        <GridContainer>
                                                            <GridItem xs={12} sm={6} md={6}>
                                                                <Card>
                                                                    <CardHeader color="warning" stats icon>
                                                                        <CardIcon color="warning">
                                                                            <BuildIcon></BuildIcon>
                                                                        </CardIcon>
                                                                        <p className={classes.cardCategory}>Contract type</p>
                                                                        <h3 className={classes.cardTitle}>{renderType()}</h3>
                                                                    </CardHeader>
                                                                </Card>
                                                            </GridItem>
                                                            <GridItem xs={12} sm={6} md={6}>
                                                                <Card>
                                                                    <CardHeader color="warning" stats icon>
                                                                        <CardIcon color="warning">
                                                                            <AttachMoneyIcon></AttachMoneyIcon>
                                                                        </CardIcon>
                                                                        <p className={classes.cardCategory}>Price</p>
                                                                        <h3 className={classes.cardTitle}>{trip.price} Ξ</h3>
                                                                    </CardHeader>
                                                                </Card>
                                                            </GridItem>
                                                        </GridContainer>
                                                    </GridItem>
                                            }
                                        </GridContainer>

                                        <GridContainer>
                                            <GridItem xs={12} sm={6} md={6}>
                                                <Card>
                                                    <CardHeader color="warning" stats icon>
                                                        <CardIcon color="warning">
                                                            <WcIcon></WcIcon>
                                                        </CardIcon>
                                                        <p className={classes.cardCategory}>Participants</p>
                                                        <h3 className={classes.cardTitle}>{renderedParticipants}</h3>
                                                    </CardHeader>
                                                </Card>
                                            </GridItem>
                                            <GridItem xs={12} sm={6} md={6}>
                                                <Card>
                                                    <CardHeader color="warning" stats icon>
                                                        <CardIcon color="warning">
                                                            <CalendarTodayIcon></CalendarTodayIcon>
                                                        </CardIcon>
                                                        <p className={classes.cardCategory}>Application deadline</p>
                                                        <h3 className={classes.cardTitle}>{trip.deadLineDate}</h3>
                                                    </CardHeader>
                                                </Card>
                                            </GridItem>
                                        </GridContainer>

                                        <Card>
                                            <CardHeader color="warning" stats icon>
                                                <CardIcon color="warning">
                                                    <InfoOutlinedIcon></InfoOutlinedIcon>
                                                </CardIcon>
                                                <p className={classes.cardCategory}>Trip Description</p>
                                            </CardHeader>
                                            <CardBody>
                                                <h3 className={classes.cardTitle}>{trip.description}</h3>
                                            </CardBody>
                                        </Card>

                                        {isFree
                                            ?
                                            ""
                                            :
                                            <Card>
                                                <CardHeader color="warning" stats icon>
                                                    <CardIcon color="warning">
                                                        <SmsIcon></SmsIcon>
                                                    </CardIcon>
                                                    <p className={classes.cardCategory}>Trip Events</p>
                                                    {isFree
                                                        ?
                                                        ""
                                                        :
                                                        isEthEnabled
                                                            ?
                                                            isContractReady
                                                                ?
                                                                isDeadlinePassed
                                                                    ?
                                                                        isEnddatePassed
                                                                        ?
                                                                            ""
                                                                        :
                                                                        isUserOrganizer
                                                                            ?
                                                                            transactionInProgress
                                                                                ?
                                                                                    <Loader type="Watch" color="#ff9800" height={45} width={45} />
                                                                                :
                                                                                    <div>
                                                                                        <Button color="danger" size="lg" onClick={cancelTransaction}>Cancel current transaction</Button>
                                                                                        <Button color="success" size="lg" onClick={open}>Create a new transaction</Button>
                                                                                    </div>
                                                                            : ""
                                                                        : ""
                                                                :
                                                                <SnackbarContent
                                                                    message={
                                                                        'This trip is currently being deployed on the blockchain!'
                                                                    }
                                                                    color="info"
                                                                />

                                                            :
                                                            <SnackbarContent
                                                                message={
                                                                    'You are not connected to the Ethereum network!'
                                                                }
                                                                color="danger"
                                                            />
                                                    }
                                                </CardHeader>
                                                <CardBody>

                                                    <Table
                                                        tableHeaderColor="warning"
                                                        tableHead={["Name", "Timestamp", "Input parameters", "Tx"]}
                                                        tableData={events}
                                                    />
                                                    {isFree
                                                        ?
                                                        ""
                                                        :
                                                        isEthEnabled
                                                            ?
                                                            isContractReady
                                                                ?
                                                                isDeadlinePassed
                                                                    ?
                                                                    isEnddatePassed
                                                                        ?
                                                                            ""
                                                                        :
                                                                        isUserApplied
                                                                            ? 
                                                                                transactionInProgress
                                                                                ?
                                                                                    <Loader type="Watch" color="#ff9800" height={45} width={45} />
                                                                                :
                                                                                    <Button color="success" size="lg" onClick={makeVote}>Vote on current transaction</Button>
                                                                            : ""
                                                                        : ""
                                                                :
                                                                    <SnackbarContent
                                                                        message={
                                                                            'This trip is currently being deployed on the blockchain!'
                                                                        }
                                                                        color="info"
                                                                    />

                                                            :
                                                            <SnackbarContent
                                                                message={
                                                                    'You are not connected to the Ethereum network!'
                                                                }
                                                                color="danger"
                                                            />
                                                    }
                                                </CardBody>
                                            </Card>

                                        }


                                    </CardBody>
                                </Card>
                            </GridItem>
                        </GridContainer>
                    </div>
            }

            <Dialog open={showDialog}>
                <Button color="danger" onClick={close}>Close</Button>
                <CustomInput
                    labelText="Send transaction to (ethereum address)"
                    id="transaction-address"
                    formControlProps={{
                        fullWidth: true,
                        onChange: handleTransactionAddressChange
                    }}
                />
                <CustomInput
                    labelText="Amount (ether)"
                    id="transaction-amount"
                    formControlProps={{
                        fullWidth: true,
                        onChange: handleTransactionAmountChange
                    }}
                />
                <CustomInput
                    labelText="Description"
                    id="transaction-description"
                    formControlProps={{
                        fullWidth: true,
                        onChange: handleTransactionDescriptionChange
                    }}
                />
                <p className={classes.cardCategory}>Please make sure you have the correct data filled in!</p>
                <p className={classes.cardCategory}>Only 1 transaction can be active at a time!</p>
                {
                    transactionInProgress
                    ?
                        <Loader type="Watch" color="#ff9800" height={45} width={45} />
                    :
                        <Button color="success" onClick={createTransaction}>Send</Button>
                }
                
            </Dialog>

            <Snackbar
                place="br"
                color="success"
                icon={DoneOutline}
                message="Application successful!"
                open={succApply}
                closeNotification={() => setApplyNoti(false)}
                close
            />

            <Snackbar
                place="br"
                color="danger"
                icon={Error}
                message="Error with application!"
                open={errApply}
                closeNotification={() => setApplyErrNoti(false)}
                close
            />

            <Snackbar
                place="br"
                color="success"
                icon={DoneOutline}
                message="Unsubscription successful!"
                open={succUnsub}
                closeNotification={() => setUnsubSucc(false)}
                close
            />

            <Snackbar
                place="br"
                color="danger"
                icon={Error}
                message="Error with unsubscription!"
                open={errUnsub}
                closeNotification={() => setUnsubErr(false)}
                close
            />

            <Snackbar
                place="br"
                color="success"
                icon={DoneOutline}
                message="Vote successful!"
                open={succVote}
                closeNotification={() => setSuccVote(false)}
                close
            />

            <Snackbar
                place="br"
                color="danger"
                icon={Error}
                message="Error while voting!"
                open={errVote}
                closeNotification={() => setErrVote(false)}
                close
            />

            <Snackbar
                place="br"
                color="success"
                icon={DoneOutline}
                message="New transaction creation successful!"
                open={succTranCreate}
                closeNotification={() => setSuccTranCreate(false)}
                close
            />

            <Snackbar
                place="br"
                color="danger"
                icon={Error}
                message="Error while creating new transaction!"
                open={errTranCreate}
                closeNotification={() => setErrTranCreate(false)}
                close
            />

            <Snackbar
                place="br"
                color="success"
                icon={DoneOutline}
                message="Transaction cancel successful!"
                open={succTranCancel}
                closeNotification={() => setSuccTranCancel(false)}
                close
            />

            <Snackbar
                place="br"
                color="danger"
                icon={Error}
                message="Error while cancelling transaction!"
                open={errTranCancel}
                closeNotification={() => setErrTranCancel(false)}
                close
            />

            <Snackbar
                place="br"
                color="success"
                icon={DoneOutline}
                message="Ending trip successful!"
                open={succEnd}
                closeNotification={() => setSuccEnd(false)}
                close
            />

            <Snackbar
                place="br"
                color="danger"
                icon={Error}
                message="Error while ending trip!"
                open={errEnd}
                closeNotification={() => setErrEnd(false)}
                close
            />
            
        </div>
    );
}
