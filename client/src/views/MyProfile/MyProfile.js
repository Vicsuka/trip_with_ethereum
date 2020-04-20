import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
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

export default function UserProfile() {
  const classes = useStyles();
  const [profile, setProfile] = useState({});

  useEffect(() => {

    fetch("/api/userprofile")
      .then(response => response.json())
      .then(
        (data) => {
          console.log(data);
          setProfile(data);
        },
        (error) => {
          console.log(error);
        }
      )

  }, []);


  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={5}>
          <Card profile>
            <CardAvatar profile>
              <img src={profile.picture} alt="" />
            </CardAvatar>
            <CardBody profile className={classes.aboutInfo}>
              <CardHeader color="primary">
                <h3 className={classes.cardTitleWhite + ' ' + classes.cardTitle}>{profile.name}</h3>
                <p className={classes.cardCategoryWhite + ' ' + classes.description}>YOUR DATA</p>
              </CardHeader>
              <GridContainer >
                <GridItem xs={12} sm={12} md={3}>
                  <h4>Username:</h4>
                </GridItem>
                <GridItem xs={12} sm={12} md={9}>
                  <h4>{profile.nickname}</h4>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                  <h4>Email:</h4>
                </GridItem>
                <GridItem xs={12} sm={12} md={9}>
                  <h4>{profile.email}</h4>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                  <h4>ID:</h4>
                </GridItem>
                <GridItem xs={12} sm={12} md={9}>
                  <h4>{profile.sub}</h4>
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                  <h4>About:</h4>
                </GridItem>
                <GridItem xs={12} sm={12} md={9}>
                  <h4>{profile.about}</h4>
                </GridItem>

              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={12} md={7}>
          <Card>
            <CardHeader color="primary">
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
                      fullWidth: true
                    }}>
                    {profile.given_name}
                  </CustomInput>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Last Name"
                    id="last-name"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="Username"
                    id="username"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="City"
                    id="city"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="Country"
                    id="country"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="Postal Code"
                    id="postal-code"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <InputLabel style={{ color: "#AAAAAA" }}>About me</InputLabel>
                  <CustomInput
                    labelText="Write something interesting about you!"
                    id="about-me"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 5
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color="primary">Update Your Profile</Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
