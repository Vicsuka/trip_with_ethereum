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
    customCard: {
        height: "300px"
    }

};


const useStyles = makeStyles(styles);

export default function Trips() {
    const classes = useStyles();

    const [trips, setTrips] = useState([]);

    useEffect(() => {
        loadTrips();
    }, []);

    const handleCreateTrip = () => {

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
                    <AvatarGroup max={3}>
                        {trip.participants.map((participant, i) => {
                            return (<Link to={`/admin/user/${participant.auth0id}`}><Avatar alt={participant.firstname + " " + participant.lastname} src={participant.picture} key={i} /></Link>)
                        })}
                    </AvatarGroup>
                    <Link to={`/admin/trip/${trip.id}`}>
                        <Button color="warning">Details</Button>
                    </Link>
                </CardFooter>
            </Card>
        </GridItem>
    );



    return (
        <div>
            <Link to="/admin/trips/create"><Button color="warning" size="lg" round onClick={handleCreateTrip}>Create Your Trip</Button></Link>
            <GridContainer>
                {renderedTrips}
            </GridContainer>

        </div>
    );
}
