import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import SnackbarContent from "components/Snackbar/SnackbarContent";

import defaultIcon from "assets/img/faces/profile-icon.png"

import DoneOutline from "@material-ui/icons/DoneOutline";
import Error from "@material-ui/icons/Error";

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
  aboutInfo: {
    textAlign: "left"
  }
};

const useStyles = makeStyles(styles);

export default function MyProfile() {
  const classes = useStyles();

  const [isEthEnabled, setEthEnabled] = useState(false);

  const [profile, setProfile] = useState({});

  const [succNoti, setSuccNoti] = React.useState(false);
  const [errorNoti, setErrorNoti] = React.useState(false);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");

  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [aboutMe, setAboutMe] = useState("");

  const [etherAddress, setEtherAddress] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      enableEthereum();
      setEthEnabled(true);
    } 
    loadProfile();
  }, []);

  const loadProfile = () => {
    fetch("/api/user/getUserProfile")
      .then(response => response.json())
      .then(
        (data) => {
          setProfile(data);
          setFirstname(data.firstname);
          setLastname(data.lastname);
          setUsername(data.username);

          if (data.address !== undefined) {
            setCity(data.address.city);
            setCountry(data.address.country);
            setStreetAddress(data.address.streetAddress);
            setPostalCode(data.address.postalCode);
          }


          setAboutMe(data.about);

          if (etherAddress != "") {
            setEtherAddress(data.ethereumAddress);
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
      // Acccounts now exposed

      console.log("Eth enabled!");

      window.web3.eth.getAccounts().then(addresses => {
        console.log(addresses);
        setEtherAddress(addresses[0]);
      })

      // web3.eth.sendTransaction({/* ... */});
    } catch (error) {
      // User denied account access...
    }
  }
  const handleUpdateProfile = () => {
    var userData = { ...profile };
    userData.firstname = firstname;
    userData.lastname = lastname;
    userData.username = username;
    userData.ethereumAddress = etherAddress;
    userData.address = {};
    userData.address.city = city;
    userData.address.country = country;
    userData.address.streetAddress = streetAddress;
    userData.address.postalCode = postalCode;
    userData.about = aboutMe;

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    };

    fetch('/api/user/updateUserProfile', requestOptions)
      .then(response => response.json())
      .then(
        (data) => {
          console.log(data);
          if (data.errors) {
            if (!errorNoti) {
              setErrorNoti(true);
              setTimeout(function () {
                setErrorNoti(false);
              }, 3000);
            }
          }else {
            if (!succNoti) {
              setSuccNoti(true);
              setTimeout(function () {
                setSuccNoti(false);
              }, 3000);
            }
          }
        },
        (error) => {
          console.log(error);
          if (!errorNoti) {
            setErrorNoti(true);
            setTimeout(function () {
              setErrorNoti(false);
            }, 3000);
          }
        }
      );
  }

  const handleFirstnameChange = (event, value) => {
    setFirstname(event.target.value);
  };

  const handleLastnameChange = (event, value) => {
    setLastname(event.target.value);
  };

  const handleUsernameChange = (event, value) => {
    setUsername(event.target.value);
  };

  const handleAboutChange = (event, value) => {
    setAboutMe(event.target.value);
  };

  const handlePostalChange = (event, value) => {
    setPostalCode(event.target.value);
  };

  const handleStreetChange = (event, value) => {
    setStreetAddress(event.target.value);
  };

  const handleCountryChange = (event, value) => {
    setCountry(event.target.value);
  };

  const handleCityChange = (event, value) => {
    setCity(event.target.value);
  };

  const handleEthereumChange = (event, value) => {
    setEtherAddress(event.target.value);
  };


  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={5}>
          <Card profile>
            <CardAvatar profile>
              <img src={profile.picture || defaultIcon} alt="" />
            </CardAvatar>
            <CardBody profile >
              <CardHeader color="warning">
                <h3 className={classes.cardTitleWhite + ' ' + classes.cardTitle}>{firstname} {lastname}</h3>
                <p className={classes.cardCategoryWhite + ' ' + classes.description}>YOUR DATA</p>
              </CardHeader>
              <div className={classes.aboutInfo}>
                <GridContainer >
                  <GridItem xs={6} sm={6} md={3}>
                    <h4>Username:</h4>
                  </GridItem>
                  <GridItem xs={6} sm={6} md={9}>
                    <h4>{username}</h4>
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
                    <h4>{etherAddress}</h4>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={6} sm={6} md={3}>
                    <h4>City:</h4>
                  </GridItem>
                  <GridItem xs={6} sm={6} md={3}>
                    <h4>{city}</h4>
                  </GridItem>
                  <GridItem xs={6} sm={6} md={3}>
                    <h4>Country:</h4>
                  </GridItem>
                  <GridItem xs={6} sm={6} md={3}>
                    <h4>{country}</h4>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={6} sm={6} md={2}>
                    <h4>Street Address:</h4>
                  </GridItem>
                  <GridItem xs={6} sm={6} md={5}>
                    <h4>{streetAddress}</h4>
                  </GridItem>
                  <GridItem xs={6} sm={6} md={3}>
                    <h4>Postal Code:</h4>
                  </GridItem>
                  <GridItem xs={6} sm={6} md={2}>
                    <h4>{postalCode}</h4>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={6} sm={6} md={3}>
                    <h4>About:</h4>
                  </GridItem>
                  <GridItem xs={6} sm={6} md={9}>
                    <h4>{aboutMe}</h4>
                  </GridItem>
                </GridContainer>
              </div>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={12} md={7}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
              <p className={classes.cardCategoryWhite}>Complete your profile</p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="First Name"
                    id="first-name"
                    formControlProps={{
                      fullWidth: true,
                      onChange: handleFirstnameChange
                    }}
                    inputProps={{
                      value: firstname
                    }}
                  />

                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Last Name"
                    id="last-name"
                    formControlProps={{
                      fullWidth: true,
                      onChange: handleLastnameChange
                    }}
                    inputProps={{
                      value: lastname
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer alignItems="flex-end">
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Username"
                    id="username"
                    formControlProps={{
                      fullWidth: true,
                      onChange: handleUsernameChange
                    }}
                    inputProps={{
                      value: username
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  {
                    !isEthEnabled 
                    ? <SnackbarContent
                        message={
                          'You are not connected to the Ethereum network!'
                        }
                        color="danger"
                      />
                    : ""
                  }
                  
                  <CustomInput
                    labelText="Ethereum Address"
                    id="ethereum-address"
                    formControlProps={{
                      fullWidth: true,
                      onChange: handleEthereumChange
                    }}
                    inputProps={{
                      value: etherAddress,
                      disabled: true
                    }}
                    error={!isEthEnabled}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                  <CustomInput
                    labelText="City"
                    id="city"
                    formControlProps={{
                      fullWidth: true,
                      onChange: handleCityChange
                    }}
                    inputProps={{
                      value: city
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <CustomInput
                    labelText="Country"
                    id="country"
                    formControlProps={{
                      fullWidth: true,
                      onChange: handleCountryChange
                    }}
                    inputProps={{
                      value: country
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="Street Address"
                    id="street-address"
                    formControlProps={{
                      fullWidth: true,
                      onChange: handleStreetChange
                    }}
                    inputProps={{
                      value: streetAddress
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={2}>
                  <CustomInput
                    labelText="Postal Code"
                    id="postal-code"
                    formControlProps={{
                      fullWidth: true,
                      onChange: handlePostalChange
                    }}
                    inputProps={{
                      value: postalCode
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Write something interesting about you!"
                    id="about-me"
                    formControlProps={{
                      fullWidth: true,
                      onChange: handleAboutChange
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 5,
                      value: aboutMe
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color="warning" onClick={handleUpdateProfile}>Update Your Profile</Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <Snackbar
        place="br"
        color="success"
        icon={DoneOutline}
        message="Update successful!"
        open={succNoti}
        closeNotification={() => setSuccNoti(false)}
        close
      />

      <Snackbar
        place="br"
        color="danger"
        icon={Error}
        message="An error occurred! Please check data and try again later!"
        open={errorNoti}
        closeNotification={() => setErrorNoti(false)}
        close
      />
    </div>
  );
}
