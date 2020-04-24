import React from "react";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import CardHeader from "components/Card/CardHeader";
import { makeStyles } from "@material-ui/core";

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
    customMap: {
        height:"100px",
        width:"100px"
    },
    customCard: {
        height:"300px"
    }

};


const useStyles = makeStyles(styles);

export default function Trips() {
    const classes = useStyles();

    return (
        <div>
            <Card>
                <CardBody>
                    <div className="container">Trips will be displayed here</div>
                </CardBody>
            </Card>
            <GridContainer>
                <GridItem xs={12} sm={6} md={4}>
                    <Card>
                        <CardHeader color="warning">
                            <h4 className={classes.cardTitleWhite}>Trip #1</h4>
                            <p className={classes.cardCategoryWhite}>2020. 06. 17.</p>
                        </CardHeader>
                        <CardBody className={classes.customCard}>

                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={6} md={4}>
                    <Card>
                        <CardHeader color="warning">
                            <h4 className={classes.cardTitleWhite}>Trip #2</h4>
                            <p className={classes.cardCategoryWhite}>2020. 08. 27.</p>
                        </CardHeader>
                        <CardBody className={classes.customCard}>
                           
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem xs={12} sm={6} md={4}>
                    <Card>
                        <CardHeader color="warning">
                            <h4 className={classes.cardTitleWhite}>Trip #3</h4>
                            <p className={classes.cardCategoryWhite}>2020. 10. 01.</p>
                        </CardHeader>
                        <CardBody className={classes.customCard}>

                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
        </div>
    );
}
