import React, { useState, useEffect } from "react";
import moment from "moment";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
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
// core components
import CardIcon from "components/Card/CardIcon.js";


import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

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
    aboutInfo: {
        textAlign: "left"
    }
};

const useStyles = makeStyles(styles);

export default function TripDetails(props) {
    var tripId = props.match.params.tripId;
    const classes = useStyles();
    const useSecondaryStyles = makeStyles(secondaryStyles);
    const secondaryClasses = useStyles(useSecondaryStyles);

    const [isContractReady, setContractReady] = useState(false);
    const [isEthEnabled, setEthEnabled] = useState(false);
    const [isUserApplied, setUserApplied] = useState(false);
    const [isDeadlinePassed, setDeadlinePassed] = useState(false);

    const [events, setEvents] = useState([]);

    const [trip, setTrip] = useState({});

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
        // var contract = new window.web3.eth.Contract(GlobalVariables.ContractABI, GlobalVariables.ContractAddress);
        var tripIdHASH = window.web3.eth.abi.encodeEventSignature(tripId);
        console.log(tripId);
        console.log("tripIdHASH", tripIdHASH);

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
        }).on("changed", function (log) {
            //
        });
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
            console.log("New log:", log);

            console.log("Topic:", log.topics[0]);
            switch(log.topics[0]) {
                case (GlobalVariables.ContractEvents.TripCreation):
                    console.log("Trip creation event");
                    break;
                case (GlobalVariables.ContractEvents.TripEnd):
                    console.log("TripEnd event");
                    break;
                case (GlobalVariables.ContractEvents.NewApplication):
                    console.log("NewApplication event");
                    break;
                case (GlobalVariables.ContractEvents.Unsubscription):
                    console.log("Unsubscription event");
                    break;
                case (GlobalVariables.ContractEvents.TransactionCreation):
                    console.log("TransactionCreation event");
                    break;
                case (GlobalVariables.ContractEvents.TransactionComplete):
                    console.log("TransactionComplete event");
                    break;
                case (GlobalVariables.ContractEvents.TransactionCanceled):
                    console.log("TransactionCanceled event");
                    break;
                case (GlobalVariables.ContractEvents.VoteMade):
                    console.log("VoteMade event");
                    break;
                default:
                    console.log("Unknown Event");
            }

            var creationEventO =  window.web3.eth.abi.decodeParameters([
                { type: 'uint256', name: 'price' },
                { type: 'uint256', name: 'maxPeople' },
                { type: 'uint256', name: 'trustMode' },
                { type: 'uint256', name: 'deadlineDate' },
                { type: 'uint256', name: 'endingDate' },
                { type: 'uint256', name: 'creationDate' },
            ], log.data);

            setEvents([["TripCreation", convertUinxToDateString(creationEventO.creationDate), JSON.stringify(creationEventO)]]);
        })
    }

    const convertUinxToDateString = (unixTime) => {
        return moment.unix(unixTime).format("YYYY. MM. DD. HH:mm");
    }

    const loadTrip = () => {
        fetch("/api/trip/trips/" + tripId)
            .then(response => response.json())
            .then(
                (data) => {
                    console.log(data);
                    if (data.trip !== null) {
                        setTrip(data.trip);
                        setDeadlinePassed(moment(moment().format("YYYY-MM-DD")).isAfter(data.trip.deadLineDate));
                        setUserApplied(data.isUserApplied);
                    }
                },
                (error) => {
                    console.log(error);
                }
            )
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
            console.log("Eth enabled!");
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
                    console.log(data);
                },
                (error) => {
                    console.log(error);
                }
            )
    }

    const unsubscribeFromTrip = () => {
        window.web3.eth.getAccounts(function (error, result) {
            if (!error) {
                var contract = new window.web3.eth.Contract(GlobalVariables.ContractABI, GlobalVariables.ContractAddress);

                contract.methods.unsubscribeFromTrip(tripId).send({ from: result[0], gas: 100000, gasPrice: window.web3.utils.toWei("20", 'gwei') })
                    .on('transactionHash', hash => {
                        console.log('TX Hash', hash)
                    })
                    .then(receipt => {
                        console.log('Mined', receipt);
                        handleUnsubscription();
                    })
                    .catch(err => {
                        console.log('Error', err)
                    })
                    .finally(() => {
                        console.log('Extra Code After Everything')
                    });
            }
        });
    }

    const applyToTrip = () => {
        window.web3.eth.getAccounts(function (error, result) {
            if (!error) {
                var contract = new window.web3.eth.Contract(GlobalVariables.ContractABI, GlobalVariables.ContractAddress);

                contract.methods.applyToTrip(tripId).send({ from: result[0], gas: 3000000, gasPrice: window.web3.utils.toWei("20", 'gwei'), value: window.web3.utils.toWei(trip.price.toString(), 'ether') })
                    .on('transactionHash', hash => {
                        console.log('TX Hash', hash)
                    })
                    .then(receipt => {
                        console.log('Mined', receipt);
                        handleApply();
                    })
                    .catch(err => {
                        console.log('Error', err)
                    })
                    .finally(() => {
                        console.log('Extra Code After Everything')
                    });
            }
        });
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
                    console.log(data);
                },
                (error) => {
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


    return (
        <div>
            <Button color="warning" size="lg" onClick={props.history.goBack}>Back</Button>

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
                                                <AttachMoneyIcon></AttachMoneyIcon>
                                            </CardIcon>
                                            <p className={classes.cardCategory}>Price</p>
                                            <h3 className={classes.cardTitle}>{trip.price} Ξ</h3>
                                        </CardHeader>
                                    </Card>
                                </GridItem>
                                <GridItem xs={12} sm={6} md={6}>
                                    <Card>
                                        <CardHeader color="warning" stats icon>
                                            <CardIcon color="warning">
                                                <InfoOutlinedIcon></InfoOutlinedIcon>
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
                                                <HowToRegOutlinedIcon></HowToRegOutlinedIcon>
                                            </CardIcon>
                                            <p className={classes.cardCategory}>Participants</p>
                                            <h3 className={classes.cardTitle}>{trip.participantIds ? trip.participantIds.length : "?"} / {trip.maxPersons}</h3>
                                        </CardHeader>
                                    </Card>
                                </GridItem>
                            </GridContainer>
                            <h4 className={classes.cardTitle}>{trip.description}</h4>
                            {JSON.stringify(trip)}

                            <Card>
                                <CardHeader color="warning">
                                    <h4 className={secondaryClasses.cardTitleWhite}>Trip Events</h4>
                                </CardHeader>
                                <CardBody>
                                    <Table
                                        tableHeaderColor="info"
                                        tableHead={["Name", "Timestamp", "Input parameters"]}
                                        tableData={events}
                                    />
                                </CardBody>
                            </Card>

                            <GridContainer>
                                <GridItem xs={12} sm={6} md={3}>
                                    <div>
                                        {isEthEnabled
                                            ?
                                            isContractReady
                                                ?
                                                isDeadlinePassed
                                                    ?
                                                    <SnackbarContent
                                                        message={
                                                            'Application deadline has already passed!'
                                                        }
                                                        color="danger"
                                                    />
                                                    :
                                                    isUserApplied
                                                        ? <Button color="danger" size="lg" onClick={unsubscribeFromTrip}>Unsubscribe</Button>
                                                        : <Button color="success" size="lg" onClick={applyToTrip}>Apply</Button>
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
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
        </div>
    );
}
