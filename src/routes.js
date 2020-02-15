import React from 'react'
import Dashboard from "@material-ui/icons/Dashboard"
import Users from "@material-ui/icons/AccountBox"
import Registration from "@material-ui/icons/MoveToInbox"
import Sponsor from "@material-ui/icons/Money";
import Club from "@material-ui/icons/Group";
import Event from "@material-ui/icons/Event";
import Payment from "@material-ui/icons/Payment";

import ClubPage from "./pages/clubs";
import UserPage from "./pages/users";
import SponsorPage from "./pages/sponsors";
import EventPage from "./pages/events";
import DashboardPage from "./pages/dashboard";
import PaymentPage from "./pages/payments";
import RegistrationPage from "./pages/registration";

export const AdminRoutes = [
    {
        path: "/",
        component: DashboardPage,
        nested: [],
    },
    {
        path: "/users",
        component: UserPage,
        nested: [],
    },
    {
        path: "/registrations",
        component: RegistrationPage,
        nested: [],
    },
    {
        path: "/events",
        component: EventPage,
        nested: [],
    },
    {
        path: "/sponsors",
        component: SponsorPage,
        nested: [],
    },
    {
        path: "/clubs",
        component: ClubPage,
        nested: [],
    },
    {
        path: "/payments",
        component: PaymentPage,
        nested: [],
    }
];

export const JsecRoutes = [
    {
        path: "/",
        component: DashboardPage,
        nested: [],
    },
    {
        path: "/registrations",
        component: RegistrationPage,
        nested: [],
    },
    {
        path: "/events",
        component: EventPage,
        nested: [],
    },
];

export const BrixRoutes = [
    {
        path: "/",
        component: DashboardPage,
        nested: [],
    },
    {
        path: "/users",
        component: UserPage,
        nested: [],
    },
    {
        path: "/registrations",
        component: RegistrationPage,
        nested: [],
    },
    {
        path: "/events",
        component: EventPage,
        nested: [],
    },
    {
        path: "/sponsors",
        component: SponsorPage,
        nested: [],
    },
    {
        path: "/clubs",
        component: ClubPage,
        nested: [],
    },
    {
        path: "/payments",
        component: PaymentPage,
        nested: [],
    }
];

export const AdminSideBar = [
    {
        path: "/",
        title: "Dashboard",
        icon: <Dashboard />
    },
    {
        path: "/users",
        title: "Users",
        icon: <Users />
    },
    {
        path: "/registrations",
        title: "Registrations",
        icon: <Registration />,
    },
    {
        path: "/sponsors",
        title: "Sponsors",
        icon: <Sponsor />
    },
    {
        path: "/clubs",
        title: "Clubs",
        icon: <Club />
    },
    {
        path: "/events",
        title: "Events",
        icon: <Event />
    },
    {
        path: "/payments",
        title: "Payments",
        icon: <Payment />
    }
]

export const JsecSideBar = [
    {
        path: "/",
        title: "Dashboard",
        icon: <Dashboard />
    },
    {
        path: "/registrations",
        title: "Registrations",
        icon: <Registration />,
    },
    {
        path: "/events",
        title: "Events",
        icon: <Event />
    },
]

export const BrixSideBar = [
    {
        path: "/",
        title: "Dashboard",
        icon: <Dashboard />
    },
    {
        path: "/users",
        title: "Users",
        icon: <Users />
    },
    {
        path: "/registrations",
        title: "Registrations",
        icon: <Registration />,
    },
    {
        path: "/sponsors",
        title: "Sponsors",
        icon: <Sponsor />
    },
    {
        path: "/clubs",
        title: "Clubs",
        icon: <Club />
    },
    {
        path: "/events",
        title: "Events",
        icon: <Event />
    },
    {
        path: "/payments",
        title: "Payments",
        icon: <Payment />
    }
]