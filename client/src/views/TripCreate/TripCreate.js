

import React, { useState, useEffect } from "react";
import moment from "moment";
import Loader from 'react-loader-spinner';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import GlobalVariables from "variables/general.js";
import Web3 from 'web3';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import DoneOutline from "@material-ui/icons/DoneOutline";
import Error from "@material-ui/icons/Error";
import Snackbar from "components/Snackbar/Snackbar";

import { v4 as uuidv4 } from 'uuid';
import { RadioGroup, Radio, FormLabel, FormControl, withStyles } from "@material-ui/core";

const PrimaryRadio = withStyles({
    root: {
      color: '#ff9800',
      '&$checked': {
        color: '#ff9800',
      },
    },
    checked: {},
  })((props) => <Radio color="default" {...props} />);

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
    },
    alignRightCenter: {
        textAlign: "right"
    },
    centerLoader: {
        textAlign: "center"
    },
    primaryColored: {
        color: '#ff9800',
        '&$checked': {
          color: '#ff9800'
        }
      },
};

const useStyles = makeStyles(styles);

export default function MyProfile(props) {
    const classes = useStyles();

    const [isFree, setFree] = useState(false);

    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [price, setPrice] = useState("");
    const [particNumber, setParticN] = useState("");
    const [type, setType] = useState("");

    const [succDBCreation, setSuccDBCreation] = useState(false);
    const [errDBCreation, setErrDBCreation] = useState(false);
    const [succETHCreation, setSuccETHCreation] = useState(false);
    const [errETHCreation, setErrETHCreation] = useState(false);
    const [transactionInProgress, setTransactionInProgress] = useState(false);

    const [deadline, setDeadline] = useState("");
    const [deadlineDate, setDeadlineDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));

    const [starting, setStarting] = useState("");
    const [startingDate, setStartingDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));

    const [ending, setEnding] = useState("");


    useEffect(() => {
        if (window.ethereum) {
            enableEthereum();
        }
    }, []);

    async function enableEthereum() {
        window.web3 = new Web3(Web3.givenProvider || "https://ropsten.infura.io/v3/63eae98070cc47a681277e95a2b2d7c0");
        try {
            // Request account access if needed
            await window.ethereum.enable();

            // Acccounts now exposed
            console.log("Eth enabled!");

            window.web3.eth.getAccounts().then(addresses => {
                console.log(addresses);
            })


        } catch (error) {
            // User denied account access...
        }
    }

    const createTrip = (tripId) => {
        window.web3.eth.getAccounts(function (error, result) {
            if (!error) {
                var contract = new window.web3.eth.Contract(GlobalVariables.ContractABI, GlobalVariables.ContractAddress);

                console.log(tripId,
                    window.web3.utils.toWei(price.toString(), 'ether'),
                    particNumber,
                    type,
                    moment(deadline, 'YYYY-MM-DD').unix(),
                    moment(ending, 'YYYY-MM-DD').unix()
                );

                contract.methods.createTrip(
                    tripId,
                    window.web3.utils.toWei(price.toString(), 'ether'),
                    particNumber,
                    type,
                    moment(deadline, 'YYYY-MM-DD').unix(),
                    moment(ending, 'YYYY-MM-DD').unix()
                )
                    .send({ from: result[0], gas: 3000000, gasPrice: window.web3.utils.toWei('20', 'gwei'), value: window.web3.utils.toWei(price.toString(), 'ether') })
                    .on('transactionHash', hash => {
                        console.log('TX Hash', hash)
                    })
                    .then(receipt => {
                        console.log('Mined', receipt);
                        setTransactionInProgress(false);
                        if (!succETHCreation) {
                            setSuccETHCreation(true);
                            setTimeout(function () {
                                setSuccETHCreation(false);
                                window.location.replace("/admin/trips");
                            }, 3000);
                        }
                    })
                    .catch(err => {
                        setTransactionInProgress(false);
                        if (!errETHCreation) {
                            setErrETHCreation(true);
                            setTimeout(function () {
                                setErrETHCreation(false);
                            }, 3000);
                        }
                        deleteTrip(tripId);
                    })
            } else {
                deleteTrip(tripId);
            }
        });
    }

    const deleteTrip = (tripId) => {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        };

        fetch("/api/trip/trips/" + tripId, requestOptions)
            .then(response => response.json())
            .then(
                (data) => {
                    console.log("Trip deleted", data);
                },
                (error) => {
                    console.log(error);
                }
            )
    };


    const handleSubmit = () => {
        var tripId = uuidv4();
        let tripData = {};
        setTransactionInProgress(true);

        if (isFree) {
            tripData = {
                id: tripId,
                title: title,
                description: desc,
                price: "0",
                maxPersons: particNumber,
                smartContractType: "1",
                deadLineDate: deadline,
                startingDate: starting,
                endingDate: ending
            };
        } else {
            tripData = {
                id: tripId,
                title: title,
                description: desc,
                price: price,
                maxPersons: particNumber,
                smartContractType: type,
                deadLineDate: deadline,
                startingDate: starting,
                endingDate: ending
            };
        }
        

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
                    if (!data.errors) {
                        if (!isFree) {
                            if (!succDBCreation) {
                                setSuccDBCreation(true);
                                setTimeout(function () {
                                    setSuccDBCreation(false);
                                }, 3000);
                            }
                            createTrip(tripId);
                        } else {
                            setTransactionInProgress(false);
                            if (!succETHCreation) {
                                setSuccETHCreation(true);
                                setTimeout(function () {
                                    setSuccETHCreation(false);
                                }, 3000);
                            }
                        }
                    } else {
                        setTransactionInProgress(false);
                        if (!errDBCreation) {
                            setErrDBCreation(true);
                            setTimeout(function () {
                                setErrDBCreation(false);
                            }, 3000);
                        }
                    }
                },
                (error) => {
                    setTransactionInProgress(false);
                    if (!errDBCreation) {
                        setErrDBCreation(true);
                        setTimeout(function () {
                            setErrDBCreation(false);
                        }, 3000);
                    }
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

    const setFreeTrip = () => {
        setFree(!isFree);
    }


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

                            </GridContainer>
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
                                        labelText="Max participants"
                                        id="trip-participants"
                                        formControlProps={{
                                            fullWidth: true,
                                            onChange: handleParticChange
                                        }}
                                    />
                                </GridItem>
                                <GridItem xs={12} sm={12} md={2}>
                                    <FormControlLabel
                                        label="Free trip"
                                        control={
                                            <Checkbox className={classes.primaryColored} checked={isFree} onChange={setFreeTrip} icon={<AttachMoneyIcon />} checkedIcon={<MoneyOffIcon className={classes.primaryColored}/>} />
                                        }
                                        labelPlacement="start"                                                        
                                    />
                                </GridItem>
                                {
                                    isFree
                                        ?
                                        ""
                                        :
                                        <GridItem xs={12} sm={12} md={2}>
                                            <GridContainer >
                                                <GridItem xs={4} sm={4} md={4}>
                                                    <CustomInput
                                                        labelText="Price"
                                                        id="trip-price"
                                                        formControlProps={{
                                                            fullWidth: true,
                                                            onChange: handlePriceChange
                                                        }}
                                                    />

                                                </GridItem>
                                                <GridItem xs={8} sm={8} md={8}>
                                                <FormControl component="fieldset">
                                                    <FormLabel component="legend">Trust factor</FormLabel>
                                                    <RadioGroup aria-label="Trust factor" name="trip-trust" onChange={handleTypeChange}>
                                                        <FormControlLabel value="1" control={<PrimaryRadio  />} label='Personal vote' />
                                                        <FormControlLabel value="2" control={<PrimaryRadio />} label='Majority vote' />
                                                        <FormControlLabel value="3" control={<PrimaryRadio />} label='Full trust' />
                                                    </RadioGroup>
                                                </FormControl>
                                                </GridItem>
                                                
                                            </GridContainer>
                                        </GridItem>
                                }

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
                                    <DatePicker onChange={handleDeadlineChange} showYearDropdown minDate={new Date(new Date().setDate(new Date().getDate() + 1))} inline />

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
                                    <DatePicker onChange={handleStartingChange} showYearDropdown minDate={deadlineDate} inline />
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
                                    <DatePicker onChange={handleEndingChange} showYearDropdown minDate={startingDate} inline />
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
                            {
                                transactionInProgress
                                    ?
                                    <Loader type="Watch" color="#ff9800" height={45} width={45} />
                                    :
                                    <Button size="lg" color="warning" onClick={handleSubmit}>Create trip</Button>
                            }
                        </CardFooter>
                    </Card>
                </GridItem>

            </GridContainer>


            <Snackbar
                place="br"
                color="info"
                icon={DoneOutline}
                message="Successful validation, sending request to blockchain..."
                open={succDBCreation}
                closeNotification={() => setSuccDBCreation(false)}
                close
            />

            <Snackbar
                place="br"
                color="danger"
                icon={Error}
                message="Error while validating trip, please check your data!"
                open={errDBCreation}
                closeNotification={() => setErrDBCreation(false)}
                close
            />

            <Snackbar
                place="br"
                color="success"
                icon={DoneOutline}
                message="Trip created successfully!"
                open={succETHCreation}
                closeNotification={() => setSuccETHCreation(false)}
                close
            />

            <Snackbar
                place="br"
                color="danger"
                icon={Error}
                message="Error while deploying trip on blockchain, please try again later or contact support!"
                open={errETHCreation}
                closeNotification={() => setErrETHCreation(false)}
                close
            />
        </div>
    );
}

