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
    const [ethereumAddress, setEthereumAddress] = useState("");

    const classes = useStyles();

    const [trips, setTrips] = useState([]);

    useEffect(() => {
        if (window.ethereum) {
            console.log("Eth enabled!");
            window.web3 = new Web3(Web3.givenProvider || "https://mainnet.infura.io/v3/63eae98070cc47a681277e95a2b2d7c0");
            enableEthereum();
            setEthEnabled(true);
        } 
        loadTrips();
    }, []);

    async function enableEthereum() {
        try {
            // Request account access if needed
            await window.ethereum.enable();
            // Acccounts now exposed

            window.web3.eth.getAccounts().then( addresses => {
                console.log(addresses);
            })
            
            // web3.eth.sendTransaction({/* ... */});
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
                },
                (error) => {
                    console.log(error);
                }
            )
    }

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
                                trip.participants.push(participant);
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
            console.log("Participants loaded");
            console.log(extendedData);
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
                        {trip.participants.map((participant, i) => {
                            return (<Link className={classes.avatarBorderless} to={`/admin/user/${participant.auth0id}`} key={i}><Avatar alt={participant.firstname + " " + participant.lastname} src={participant.picture} key={i}/></Link>)
                        })}
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
                    Please connect to an Ethereum Wallet to continue!
                </Card>
            }
        </div>
    );
}


