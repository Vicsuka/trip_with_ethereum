import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";

import defaultIcon from "assets/img/faces/profile-icon.png"


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
    aboutInfo: {
        textAlign: "left"
    }
};

const useStyles = makeStyles(styles);

export default function UserProfile(props) {
    console.log(props);
    var userId = props.match.params.userId;
    const classes = useStyles();

    const [profile, setProfile] = useState({});

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = () => {
        fetch("/api/user/users/"+userId)
            .then(response => response.json())
            .then(
                (data) => {
                    setProfile(data);
                },
                (error) => {
                    console.log(error);
                }
            )
    }


    return (
        <div>
            <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                    <Card profile>
                        <CardAvatar profile>
                            <img src={profile.picture || defaultIcon} alt="" />
                        </CardAvatar>
                        <CardBody profile >
                            <CardHeader color="warning">
                                <h3 className={classes.cardTitleWhite + ' ' + classes.cardTitle}>{profile.firstname} {profile.lastname}</h3>
                                <p className={classes.cardCategoryWhite + ' ' + classes.description}>YOUR DATA</p>
                            </CardHeader>
                            <div className={classes.aboutInfo}>
                                <GridContainer >
                                    <GridItem xs={6} sm={6} md={3}>
                                        <h4>Username:</h4>
                                    </GridItem>
                                    <GridItem xs={6} sm={6} md={9}>
                                        <h4>{profile.username}</h4>
                                    </GridItem>
                                </GridContainer>
                                <GridContainer>
                                    <GridItem xs={6} sm={6} md={3}>
                                        <h4>Email:</h4>
                                    </GridItem>
                                    <GridItem xs={6} sm={6} md={9}>
                                        <h4>{profile.email}</h4>
                                    </GridItem>
                                </GridContainer>
                                <GridContainer>
                                    <GridItem xs={6} sm={6} md={3}>
                                        <h4>ID:</h4>
                                    </GridItem>
                                    <GridItem xs={6} sm={6} md={9}>
                                        <h4>{profile.auth0id}</h4>
                                    </GridItem>
                                </GridContainer>
                                <GridContainer>
                                    <GridItem xs={6} sm={6} md={3}>
                                        <h4>Ethereum Address:</h4>
                                    </GridItem>
                                    <GridItem xs={6} sm={6} md={9}>
                                        <h4>{profile.etherAddress}</h4>
                                    </GridItem>
                                </GridContainer>
                                <GridContainer>
                                    <GridItem xs={6} sm={6} md={3}>
                                        <h4>City:</h4>
                                    </GridItem>
                                    <GridItem xs={6} sm={6} md={3}>
                                        <h4>{profile.city}</h4>
                                    </GridItem>
                                    <GridItem xs={6} sm={6} md={3}>
                                        <h4>Country:</h4>
                                    </GridItem>
                                    <GridItem xs={6} sm={6} md={3}>
                                        <h4>{profile.country}</h4>
                                    </GridItem>
                                </GridContainer>
                                <GridContainer>
                                    <GridItem xs={6} sm={6} md={2}>
                                        <h4>Street Address:</h4>
                                    </GridItem>
                                    <GridItem xs={6} sm={6} md={5}>
                                        <h4>{profile.streetAddress}</h4>
                                    </GridItem>
                                    <GridItem xs={6} sm={6} md={3}>
                                        <h4>Postal Code:</h4>
                                    </GridItem>
                                    <GridItem xs={6} sm={6} md={2}>
                                        <h4>{profile.postalCode}</h4>
                                    </GridItem>
                                </GridContainer>
                                <GridContainer>
                                    <GridItem xs={6} sm={6} md={3}>
                                        <h4>About:</h4>
                                    </GridItem>
                                    <GridItem xs={6} sm={6} md={9}>
                                        <h4>{profile.aboutMe}</h4>
                                    </GridItem>
                                </GridContainer>
                            </div>
                        </CardBody>
                    </Card>
                </GridItem>
             </GridContainer>
        </div>
    );
}
