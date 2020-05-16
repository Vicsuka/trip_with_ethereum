// @material-ui/icons
import Person from "@material-ui/icons/Person";
import CardTravel from "@material-ui/icons/CardTravel";
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

// core components/views for Admin layout
import MyProfile from "views/MyProfile/MyProfile.js";
import MyTrips from "views/MyTrips/MyTrips.js";
import Trips from "views/Trips/Trips.js";
import UserProfile from "views/UserProfile/UserProfile";
import TripDetails from "views/TripDetails/TripDetails";
import TripCreate from "views/TripCreate/TripCreate";


const routes = {
  dashboard: [
    {
      path: "/myprofile",
      name: "My Profile",
      icon: Person,
      component: MyProfile,
      layout: "/admin"
    },
    {
      path: "/mytrips",
      name: "My Trips",
      icon: AssignmentIndIcon,
      component: MyTrips,
      layout: "/admin"
    },
    {
      path: "/trips",
      name: "Trips",
      icon: CardTravel,
      component: Trips,
      layout: "/admin"
    }
  ],
  users: {
    path: "/:userId",
    component: UserProfile,
    layout: "/admin/user"
  },
  trips: {
    path: "/:tripId",
    component: TripDetails,
    layout: "/admin/trip"
  },
  createTrip: {
    path: "/create",
    component: TripCreate,
    layout: "/admin/trips"
  }

};

export default routes;
