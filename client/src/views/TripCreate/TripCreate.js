

import React, { useState } from "react";
import moment from "moment";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";



import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

export default function MyProfile(props) {
    const classes = useStyles();

    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [price, setPrice] = useState("");
    const [particNumber, setParticN] = useState("");
    const [type, setType] = useState("");


    const [deadline, setDeadline] = useState("");
    const [deadlineDate, setDeadlineDate] = useState(new Date());
    
    const [starting, setStarting] = useState("");
    const [startingDate, setStartingDate] = useState(new Date());

    const [ending, setEnding] = useState("");

    const handleSubmit = () => {
        let tripData = {
            title: title,
            description: desc,
            price: price,
            maxPersons: particNumber,
            smartContractType: type,
            deadLineDate: deadline,
            startingDate: starting,
            endingDate: ending
        };
        
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tripData)
        };

        fetch('/api/trip/createtrip', requestOptions)
            .then(response => response.json())
            .then(
                (data) => {
                    console.log(data);
                },
                (error) => {
                    console.log(error);
                }
            )
    };

    const handleTitleChange = (event, value) => {
        setTitle(event.target.value);
      };
    
      const handlePriceChange = (event, value) => {
        setPrice(event.target.value);
      };
    
      const handleDescChange = (event, value) => {
        setDesc(event.target.value);
      };
    
      const handleParticChange = (event, value) => {
        setParticN(event.target.value);
      };
    
      const handleTypeChange = (event, value) => {
        setType(event.target.value);
      };
    
      const handleDeadlineChange = (date) => {
        setDeadline(moment(date).format('YYYY-MM-DD'));
        
        if (!moment(starting).isAfter(moment(date).format('YYYY-MM-DD'))) {
            setStarting("");
            setEnding("");
        }
        date = moment(date).add(1, 'days');
        setDeadlineDate(date._d);
        date = moment(date).add(1, 'days');
        setStartingDate(date._d);
        
      };
    
      const handleStartingChange = (date) => {
        setStarting(moment(date).format('YYYY-MM-DD'));

        if (!moment(ending).isAfter(moment(date).format('YYYY-MM-DD'))) {
            setEnding("");
        }

        date = moment(date).add(1, 'days');
        setStartingDate(date._d);
        
      };
    
      const handleEndingChange = (date) => {

        setEnding(moment(date).format('YYYY-MM-DD'));
      };

      
    return (
        <div>
            <Button color="warning" size="lg" onClick={props.history.goBack}>Back</Button>
            <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                    <Card>
                        <CardHeader color="warning">
                            <h4 className={classes.cardTitleWhite}>Create your trip</h4>
                            <p className={classes.cardCategoryWhite}>Fill out the details</p>
                        </CardHeader>
                            <CardBody>

                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <CustomInput
                                            labelText="Title (max. 30 char)"
                                            id="trip-title"
                                            formControlProps={{
                                                fullWidth: true,
                                                onChange: handleTitleChange
                                            }}
                                        />

                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={2}>
                                        <CustomInput
                                            labelText="Price"
                                            id="trip-price"
                                            formControlProps={{
                                                fullWidth: true,
                                                onChange: handlePriceChange
                                            }}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={2}>
                                        <CustomInput
                                            labelText="Max participants"
                                            id="trip-participants"
                                            formControlProps={{
                                                fullWidth: true,
                                                onChange: handleParticChange
                                            }}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={2}>
                                        <CustomInput
                                            labelText="Trust factor"
                                            id="trip-trust"
                                            formControlProps={{
                                                fullWidth: true,
                                                onChange: handleTypeChange
                                            }}
                                        />
                                    </GridItem>
                                </GridContainer>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={4}>
                                        <CustomInput
                                            labelText="Deadline date"
                                            id="trip-deadline"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                value: deadline
                                              }}
                                        />
                                        <DatePicker onChange={handleDeadlineChange} showYearDropdown minDate={new Date()} inline/>

                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={4}>
                                        <CustomInput
                                            labelText="Starting date"
                                            id="trip-starting"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                value: starting
                                              }}
                                        />
                                        <DatePicker onChange={handleStartingChange} showYearDropdown minDate={deadlineDate} inline/>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={4}>
                                        <CustomInput
                                            labelText="Ending date"
                                            id="trip-ending"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                value: ending
                                              }}
                                        />
                                        <DatePicker onChange={handleEndingChange} showYearDropdown minDate={startingDate} inline/>
                                    </GridItem>
                                </GridContainer>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={12}>
                                        <CustomInput
                                            labelText="Trip description (min. 10 char)"
                                            id="trip-description"
                                            formControlProps={{
                                                fullWidth: true,
                                                onChange: handleDescChange
                                            }}
                                            inputProps={{
                                                multiline: true,
                                                rows: 10
                                            }}
                                        />
                                    </GridItem>
                                </GridContainer>

                            </CardBody>
                            <CardFooter>
                                <Button size="lg" color="warning" onClick={handleSubmit}>Create trip</Button>
                            </CardFooter>
                    </Card>
                </GridItem>

            </GridContainer>
        </div>
    );
}
