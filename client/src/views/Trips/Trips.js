import React, { useState } from "react";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import CardHeader from "components/Card/CardHeader";
import { makeStyles } from "@material-ui/core";
import { useEffect } from "react";
import Button from "components/CustomButtons/Button.js";
import { Link } from "react-router-dom";

// import GlobalVariables from "variables/general.js";

import { Avatar } from '@material-ui/core';
import { AvatarGroup } from '@material-ui/lab';
import CardFooter from "components/Card/CardFooter";

import Web3 from 'web3';


const styles = {
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
    customCard: {
        height: "300px"
    },
    avatarBorderless: {
        border: "0 !important"
    }

};


const useStyles = makeStyles(styles);

export default function Trips() {
    const [isEthEnabled, setEthEnabled] = useState(false);


    const classes = useStyles();

    const [trips, setTrips] = useState([]);

    useEffect(() => {
        if (window.ethereum) {
            enableEthereum();
            setEthEnabled(true);
        }
        loadTrips();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const loadTrips = () => {
        fetch("/api/trip/alltrips")
            .then(response => response.json())
            .then(
                (data) => {
                    loadParticipants(data);
                    //verifyTrips(data);            
                },
                (error) => {
                    console.log(error);
                }
            )
    }


    // const verifyTrips = (data) => {
    //     // var contract = new window.web3.eth.Contract(GlobalVariables.ContractABI, GlobalVariables.ContractAddress);
    //     var allPromises = [];
    //     var verifiedTrips = [];
    //     var subscriptions = [];

    //     data.forEach(trip => {
    //         console.log(trip);

    //         var TripCreationHASH = window.web3.eth.abi.encodeEventSignature('TripCreation(string,uint256,uint256,uint256,uint256,uint256,uint256)');
    //         var tripIdHASH = window.web3.eth.abi.encodeEventSignature(trip.id);
    //         console.log("tripIdHASH",tripIdHASH);

    //         var options = {
    //             fromBlock: 0,
    //             toBlock: 'latest',
    //             address: GlobalVariables.ContractAddress,
    //             topics: [TripCreationHASH, tripIdHASH]
    //         };

    //         allPromises.push(

    //             new Promise(function(resolve, reject) {
    //                 subscriptions.push(window.web3.eth.subscribe('logs', options, function (error, result) {
    //                     if (error) console.log(error);
    //                     console.log("result",result);
    //                     console.log("Verifing trip: ", trip);
    //                     verifiedTrips.push(trip);
    //                     resolve();
    //                 }).on("data", function (log) {
                        
    //                 }).on("changed", function (log) {
    //                     //
    //                 }))
    //             })
    //         );
    //     });
    //     // Wait until all trips are verified
    //     Promise.all(allPromises).then(function () {
    //         console.log("Trips verified");
    //         subscriptions.forEach(element => {
    //             element.unsubscribe(function(error, success){
    //                 if(success)
    //                     console.log('Successfully unsubscribed!');
    //             });
    //         });
    //         loadParticipants(verifiedTrips);
    //     });


    // }

    const loadParticipants = (data) => {
        var extendedData = data;
        var allPromises = [];
        extendedData.forEach(trip => {
            trip.participants = [];
            trip.participantIds.forEach(id => {
                allPromises.push(
                    fetch("/api/user/users/" + id)
                        .then(response => response.json())
                        .then(
                            (participant) => {
                                if (!trip.participants.includes(participant)) {
                                    trip.participants.push(participant);
                                }
                            },
                            (error) => {
                                console.log(error);
                            }
                        )
                )
            })
        });

        // Wait until all participants are loaded
        Promise.all(allPromises).then(function () {
            setTrips(extendedData);
        });

    }

    const renderedTrips = trips.map((trip) =>
        <GridItem xs={12} sm={6} md={4} key={trip.id}>
            <Card className={classes.customCard}>
                <CardHeader color="warning">
                    <h4 className={classes.cardTitleWhite}>{trip.title}</h4>
                    <p className={classes.cardCategoryWhite}>
                        {trip.startingDate} - {trip.endingDate}
                    </p>
                </CardHeader>
                <CardBody>
                    <h5 dangerouslySetInnerHTML={{ __html: trip.description }}></h5>
                </CardBody>
                <CardFooter>
                    <h4>Participants:</h4>
                    <AvatarGroup max={3} >
                        { trip.participants
                        ? 
                            trip.participants.map((participant, i) => {
                                return (<Link className={classes.avatarBorderless} to={`/admin/user/${participant.auth0id}`} key={i}><Avatar alt={participant.firstname + " " + participant.lastname} src={participant.picture} key={i} /></Link>)
                            })
                        :
                        ""
                        }
                    </AvatarGroup>
                    <Link to={`/admin/trip/${trip.id}`}>
                        <Button color="warning" >Details</Button>
                    </Link>
                </CardFooter>
            </Card>
        </GridItem>
    );



    return (
        <div>
            {
                isEthEnabled
                    ? <div>
                        <Link to="/admin/trips/create"><Button color="warning" size="lg" round >Create Your Trip</Button></Link>
                        <GridContainer>
                            {renderedTrips}
                        </GridContainer>
                    </div>
                    :
                    <Card>
                        <CardBody>
                            <h2>Please connect to an Ethereum wallet to continue!</h2>
                        </CardBody>
                    </Card>
            }
        </div>
    );
}


