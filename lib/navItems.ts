import { UserRole } from "@/types/auth.types";
import { getDefaultDashboardRoute } from "./authUtils"
import { NavSection } from "@/types/dashboard.types";

export const getCommonNavItems = (role: UserRole):NavSection[] => {
    const defaultDashboard = getDefaultDashboardRoute(role);
    return [
        {
            items: [
                {
                    label: "Home",
                    href: "/",
                    icon: "Home"
                },
                {
                    label: "Dashboard",
                    href: defaultDashboard,
                    icon: "LayoutDashboard"
                },
                {
                    label: "My Profile",
                    href: "/my-profile",
                    icon: "User"
                },
                
            ]
        },
        {
            title: "Settings",
            items: [
                {
                    label: "Change Password",
                    href: "/change-password",
                    icon: "Lock"
                },
                {
                    label: "Logout",
                    href: "/logout",
                    icon: "Logout"
                },

            ]

        }
        
        
    ]
}

export const doctorNavItmes = (): NavSection[]=> {
    return [
        {
            title: "Patient Management",
            items: [
                {
                    label: "Appointments",
                    href: "/doctor/dashboard/appointments",
                    icon: "Calendar"
                },
                {
                label: "My Schedules",
                href: "/doctor/dashboard/my-schedules",
                icon: "Clock",
            },
            {
                label: "Prescriptions",
                href: "/doctor/dashboard/prescriptions",
                icon: "FileText",
            },
            {
                label: "My Reviews",
                href: "/doctor/dashboard/my-reviews",
                icon: "Star",
            },
            ]
        }
    ]
} ;

export const adminNavItems: NavSection[] = [
    {
        title: "User Management",
        items: [
            {
                label: "Admins",
                href: "/admin/dashboard/admins-management",
                icon: "Shield",
            },
            {
                label: "Doctors",
                href: "/admin/dashboard/doctors-management",
                icon: "Stethoscope",
            },
            {
                label: "Patients",
                href: "/admin/dashboard/patients-management",
                icon: "Users",
            },
        ],
    },
    {
        title: "Hospital Management",
        items: [
            {
                label: "Appointments",
                href: "/admin/dashboard/appointments-management",
                icon: "Calendar",
            },
            {
                label: "Schedules",
                href: "/admin/dashboard/schedules-management",
                icon: "Clock",
            },
            {
                label: "Specialties",
                href: "/admin/dashboard/specialties-management",
                icon: "Hospital",
            },
            {
                label: "Doctor Schedules",
                href: "/admin/dashboard/doctor-schedules-managament",
                icon: "CalendarClock",
            },
            {
                label: "Doctor Specialties",
                href: "/admin/dashboard/doctor-specialties-management",
                icon: "Stethoscope",
            },
            {
                label: "Payments",
                href: "/admin/dashboard/payments-management",
                icon: "CreditCard",
            },
            {
                label: "Prescriptions",
                href: "/admin/dashboard/prescriptions-management",
                icon: "FileText",
            },
            {
                label: "Reviews",
                href: "/admin/dashboard/reviews-management",
                icon: "Star",
            },
        ],
    },
];


export const patientNavItems: NavSection[] = [
    {
        title: "Appointments",
        items: [
            {
                label: "My Appointments",
                href: "/dashboard/my-appointments",
                icon: "Calendar",
            },
            {
                label: "Book Appointment",
                href: "/dashboard/book-appointments",
                icon: "ClipboardList",
            },
        ],
    },
    {
        title: "Medical Records",
        items: [
            {
                label: "My Prescriptions",
                href: "/dashboard/my-prescriptions",
                icon: "FileText",
            },
            {
                label: "Health Records",
                href: "/dashboard/health-records",
                icon: "Activity",
            },
        ],
    },
];


export const navItemsByRole = (role: UserRole): NavSection[] => {
    role = role === UserRole.SUPER_ADMIN? UserRole.ADMIN : role;
    const commonItems = getCommonNavItems(role);
    console.log("Common Items:", commonItems);
    console.log("Role:", role);
    switch (role){
        case UserRole.ADMIN: 
            return [...commonItems, ...adminNavItems];
        case UserRole.DOCTOR:
            return [...commonItems, ...doctorNavItmes()];
        case UserRole.PATIENT:
            return [...commonItems, ...patientNavItems];
        default:
            return commonItems;
    }
}