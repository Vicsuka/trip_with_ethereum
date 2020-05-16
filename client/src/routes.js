// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import DeveloperBoard from "@material-ui/icons/DeveloperBoard";
import Notifications from "@material-ui/icons/Notifications";
import CardTravel from "@material-ui/icons/CardTravel";
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import MyProfile from "views/MyProfile/MyProfile.js";
import MyTrips from "views/MyTrips/MyTrips.js";
import TableList from "views/TableList/TableList.js";
import Typography from "views/Typography/Typography.js";
import Icons from "views/Icons/Icons.js";
import DevArea from "views/DevArea/DevArea.js";
import NotificationsPage from "views/Notifications/Notifications.js";
import Trips from "views/Trips/Trips.js";
import UserProfile from "views/UserProfile/UserProfile";
import TripDetails from "views/TripDetails/TripDetails";
import TripCreate from "views/TripCreate/TripCreate";


const routes = {
  dashboard: [
    {
      path: "/dev",
      name: "Developer area",
      icon: DeveloperBoard,
      component: DevArea,
      layout: "/admin"
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: Dashboard,
      component: DashboardPage,
      layout: "/admin"
    },
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
    },
    {
      path: "/table",
      name: "Table List",
      icon: "content_paste",
      component: TableList,
      layout: "/admin"
    },
    {
      path: "/typography",
      name: "Typography",
      icon: LibraryBooks,
      component: Typography,
      layout: "/admin"
    },
    {
      path: "/icons",
      name: "Icons",
      icon: BubbleChart,
      component: Icons,
      layout: "/admin"
    },
    {
      path: "/notifications",
      name: "Notifications",
      icon: Notifications,
      component: NotificationsPage,
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
