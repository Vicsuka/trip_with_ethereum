import React, { useState } from "react";
import { Link } from "react-router-dom";
import Loader from 'react-loader-spinner';

import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import CardHeader from "components/Card/CardHeader";
import { makeStyles } from "@material-ui/core";
import { useEffect } from "react";
import Button from "components/CustomButtons/Button.js";

import { Avatar } from '@material-ui/core';
import { AvatarGroup } from '@material-ui/lab';
import CardFooter from "components/Card/CardFooter";
import Snackbar from "components/Snackbar/Snackbar";
import Error from "@material-ui/icons/Error";


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
        height: "300px",        
    },
    customCardBody: {
        overflow: "hidden",
    },
    avatarBorderless: {
        border: "0 !important"
    },
    centerLoader: {
        textAlign: "center"
    },

};


const useStyles = makeStyles(styles);

export default function Trips() {
    const classes = useStyles();

    const [trips, setTrips] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [errorLoad, setErrorLoad] = useState(false);

    useEffect(() => {
        loadTrips();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadTrips = () => {
        fetch("/api/trip/alltrips")
            .then(response => response.json())
            .then(
                (data) => {
                    loadParticipants(data.trips);
                    //verifyTrips(data);            
                },
                (error) => {
                    if (!errorLoad) {
                        setErrorLoad(true);
                        setTimeout(function () {
                          setErrorLoad(false);
                        }, 3000);
                      }
                    setLoading(false);
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
            setLoading(false);
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
                <CardBody className={classes.customCardBody}>
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
            <Link to="/admin/trips/create"><Button color="warning" size="lg" round >Create Your Trip</Button></Link>
            {
            isLoading
                ?
                <div className={classes.centerLoader}>
                    <Loader type="Grid" color="#ff9800" height={120} width={120} />
                </div>
                :
                <GridContainer>
                    {renderedTrips}
                </GridContainer>
            }
            <Snackbar
                place="br"
                color="danger"
                icon={Error}
                message="We could not connect to the database!"
                open={errorLoad}
                closeNotification={() => setErrorLoad(false)}
                close
            />
            
            
        </div>
    );
}


