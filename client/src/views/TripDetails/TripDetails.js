import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Button from "components/CustomButtons/Button.js";

import GlobalVariables from "variables/general.js";

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
    gradientButton: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        padding: '0 30px',
    },
    aboutInfo: {
        textAlign: "left"
    }
};

const useStyles = makeStyles(styles);

export default function TripDetails(props) {
    console.log(props);

    var tripId = props.match.params.tripId;
    const classes = useStyles();


    const [isEthEnabled, setEthEnabled] = useState(false);

    const [trip, setTrip] = useState({});

    useEffect(() => {
        if (window.ethereum) {            
            enableEthereum();
            setEthEnabled(true);
        } 
        loadTrip();
    }, []);

    const loadTrip = () => {
        fetch("/api/trip/trips/" + tripId)
            .then(response => response.json())
            .then(
                (data) => {
                    console.log(data);
                    setTrip(data);
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

            // Acccounts now exposed
            console.log("Eth enabled!");
            
            window.web3.eth.getAccounts().then( addresses => {
                console.log(addresses);
            })
            
            
        } catch (error) {
            // User denied account access...
        }
    }

    const applyToTrip = () => {  
        window.web3.eth.getAccounts(function (error, result) {
            if (!error) {
                console.log(GlobalVariables.ContractAddress);                
                var contract = new window.web3.eth.Contract(GlobalVariables.ContractABI, GlobalVariables.ContractAddress);

                contract.methods.applyToTrip(tripId).send({ from: result[0], gas: 100000, value: window.web3.utils.toWei(trip.price.toString(), 'ether') })
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
            body: JSON.stringify({tripId : tripId})
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


    return (
        <div>
            <Button color="warning" size="lg" onClick={props.history.goBack}>Back</Button>
            <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                    <Card>
                        <CardHeader color="warning">
                            <h4 className={classes.cardTitleWhite}>{trip.title}</h4>
                            <p className={classes.cardCategoryWhite}>
                                {trip.startingDate} - {trip.endingDate}
                            </p>
                        </CardHeader>
                        <CardBody>
                            {JSON.stringify(trip)}
                        </CardBody>
                        <CardFooter>
                            { isEthEnabled 
                                ? <Button color="warning" className={classes.gradientButton} block onClick={applyToTrip}>Apply</Button>
                                : ""
                            }
                            
                        </CardFooter>
                    </Card>
                </GridItem>
            </GridContainer>
        </div>
    );
}
