// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import DeveloperBoard from "@material-ui/icons/DeveloperBoard";
import Notifications from "@material-ui/icons/Notifications";
import CardTravel from "@material-ui/icons/CardTravel";

// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import MyProfile from "views/MyProfile/MyProfile.js";
import TableList from "views/TableList/TableList.js";
import Typography from "views/Typography/Typography.js";
import Icons from "views/Icons/Icons.js";
import DevArea from "views/DevArea/DevArea.js";
import NotificationsPage from "views/Notifications/Notifications.js";
import Trips from "views/Trips/Trips.js";

const dashboardRoutes = [
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
    path: "/user",
    name: "My Profile",
    icon: Person,
    component: MyProfile,
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
  
];

export default dashboardRoutes;
