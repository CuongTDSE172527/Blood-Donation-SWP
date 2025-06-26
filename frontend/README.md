# Blood Donation Web App – User Guide

## Overview

Welcome to the Blood Donation Web App! This platform is designed to make blood donation, requests, and management easy and accessible for everyone—donors, recipients, staff, and administrators. The app features a clean, modern red/white design, bilingual support (English/Vietnamese), and a user-friendly interface built with React and Material-UI.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Navigation & Layout](#navigation--layout)
3. [Language Support](#language-support)
4. [User Roles & Dashboards](#user-roles--dashboards)
    - [General User](#general-user)
    - [Donor](#donor)
    - [Staff](#staff)
    - [Admin](#admin)
5. [Key Features](#key-features)
    - [Home Page](#home-page)
    - [About Page](#about-page)
    - [Blood Schedule](#blood-schedule)
    - [Blood Requests & Emergency](#blood-requests--emergency)
    - [Blood Search](#blood-search)
6. [Account Management](#account-management)
7. [Accessibility & Design](#accessibility--design)
8. [FAQ](#faq)
9. [Contact & Support](#contact--support)

---

## Getting Started

### Accessing the App
- Open your web browser and navigate to the app's URL (provided by your organization or project admin).
- The app is fully responsive and works on desktop, tablet, and mobile devices.

### Registration
- Click the **Register** button in the top right corner.
- Fill in your details:
  - Name
  - Email
  - Password
  - Role (User, Donor, Staff)
  - Blood type (if registering as a donor)
- Submit the form. You will be redirected to your dashboard.

### Login
- Click the **Login** button in the top right corner.
- Enter your email and password.
- If you forget your password, use the "Forgot Password?" link to reset it.

### Language Selection
- Use the language switcher (🇬🇧/🇻🇳) in the header to toggle between English and Vietnamese.
- The app will reload to apply your language choice.

---

## Navigation & Layout

### Header Bar
- **Logo**: Click to return to the Home page.
- **Navigation Links**: Home, About, Schedule, etc.
- **Language Switcher**: Top right, for English/Vietnamese.
- **Login/Register**: Top right, for authentication.

### Footer
- Contains contact information, quick links, and copyright.

### Layouts
- The app uses different layouts for general users, staff, and admins, ensuring each role sees relevant navigation and features.

---

## Language Support

- All content is available in both English and Vietnamese.
- To change language, click the language switcher in the header. The app will reload and display all text in your chosen language.
- If you see translation keys (e.g., `home.title`) instead of text, try reloading the page or contact support.

---

## User Roles & Dashboards

### General User

#### Dashboard Overview
- **Profile Card**: Shows your name, blood type, and donation stats.
- **Donation History**: Table of your past donations (date, location, units).
- **Active Requests**: Track your blood requests and their statuses.
- **Quick Actions**:
  - **Schedule Donation**: Book a future donation slot.
  - **Request Blood**: Submit a blood request for yourself or someone else.
  - **View History**: See your donation and request history.
  - **Notifications**: Check updates and alerts.

#### Example
![User Dashboard Example](./screenshots/user-dashboard.png)

### Donor

#### Dashboard Overview
- **Profile**: View and edit your personal info and blood type.
- **Donation Stats**: See your total donations and last donation date.
- **Donation History**: Table of all your donations.
- **Edit Profile**: Update your details at any time.

#### Example
![Donor Dashboard Example](./screenshots/donor-dashboard.png)

### Staff

#### Dashboard Overview
- **Stats**: See total donors, requests, inventory, and pending actions.
- **Donor Management**: Add, edit, or remove donor records.
- **Request Management**: Approve, reject, or update blood requests.
- **Inventory Management**: Track and update blood stock by type.
- **Emergency Management**: Handle urgent blood requests with special workflows.
- **Recent Donors/Requests**: Tables showing latest activity.

#### Example
![Staff Dashboard Example](./screenshots/staff-dashboard.png)

### Admin

#### Dashboard Overview
- **System Stats**: Total users, donors, staff, requests, and inventory.
- **User Management**: Add, edit, or remove users.
- **Staff Management**: Manage staff accounts and permissions.
- **Inventory Management**: Oversee all blood stock.
- **System Settings**: Configure notifications, maintenance mode, and system name.
- **Recent Users/Requests**: Tables for latest activity.

#### Example
![Admin Dashboard Example](./screenshots/admin-dashboard.png)

---

## Key Features

### Home Page

- **Hero Section**: Large Vietnamese title, subtitle, blue call-to-action button, and blood bag image.
- **Blood Group Compatibility**: Interactive cards for each blood group. Click a card to open a modal with detailed compatibility info and advice.
- **Modern Design**: Red/white color scheme, soft shadows, and harmonious layout.

#### Example
![Home Page Example](./screenshots/home-hero.png)

### About Page

- **Mission Statement**: Learn about the app's purpose and values.
- **How It Works**: Step-by-step guide for donors and recipients.
- **Impact & Team**: Information about the team and the app's impact.
- **Contact**: Ways to reach out for support.

#### Example
![About Page Example](./screenshots/about.png)

### Blood Schedule

- **Schedule Page**: View upcoming donation events and available slots.
- **Date Range Picker**: Filter events by date.
- **Modern Card Design**: Consistent with the app's theme.
- **Book a Slot**: Click on an event to reserve your spot (if enabled).

#### Example
![Schedule Page Example](./screenshots/schedule.png)

### Blood Requests & Emergency

- **Request Blood**: Fill out a detailed form to request blood, including:
  - Blood type (with rare type option)
  - Units needed
  - Hospital/Clinic
  - Doctor's name and phone
  - Reason and urgency
  - Contact info
  - Required date
- **Emergency Request**: Special form for urgent needs, with phone and hospital verification steps. Immediate processing after verification.
- **Status Tracking**: See the status of your requests in your dashboard.
- **Tips**:
  - You must be logged in to submit a request.
  - For emergencies, fill in all required details accurately.

#### Example
![Blood Request Example](./screenshots/blood-request.png) 

### Blood Search

- **Search for Blood**: Find available blood by type and location.
- **Search Form**: Enter blood type, location, and distance.
- **Results**: View hospitals/centers with available units, distance, and last updated date.
- **Tip**: Use the search to find the nearest available blood quickly in emergencies.

#### Example
![Blood Search Example](./screenshots/blood-search.png)

---

## Account Management

### Registering
- Go to the Register page and fill in your details.
- Choose your role (User, Donor, Staff).
- If you're a donor, select your blood type.
- Submit the form and check your email for confirmation (if enabled).

### Logging In
- Go to the Login page and enter your credentials.
- If you forget your password, use the reset link.

### Profile Management
- Access your profile from the dashboard.
- Update your name, contact info, and (if donor) blood type.
- Save changes to update your account.

---

## Accessibility & Design

- **Responsive**: The app works on all devices—desktop, tablet, and mobile.
- **Accessible**: Uses clear typography, high color contrast, and ARIA labels for screen readers.
- **Modern UI**: Red/white theme, rounded corners, and soft shadows for a harmonious look.
- **Keyboard Navigation**: All interactive elements are accessible via keyboard.

---

## FAQ

### How do I change the language?
- Use the language switcher (🇬🇧/🇻🇳) in the header.
- The app will reload in your chosen language.

### How do I request blood?
- Go to the "Request Blood" page from your dashboard or the main navigation.
- Fill out the form and submit.
- Track your request status in your dashboard.

### How do I become a donor?
- Register as a donor or update your profile to include your blood type.
- Book a donation slot from your dashboard.

### Who can access the admin/staff features?
- Only users with the appropriate role can access these dashboards.
- If you need access, contact your system administrator.

### I see translation keys instead of text!
- Try reloading the page.
- If the issue persists, contact support.

### I can't log in or register
- Double-check your email and password.
- Use the "Forgot Password?" link if needed.
- If you still have trouble, contact support.

---

## Contact & Support

- **Contact Page**: Use the contact form for support or inquiries.
- **Footer**: Find email and phone contact information.
- **Troubleshooting**: For technical issues, try clearing your browser cache or using a different browser.
- **Feedback**: We welcome your suggestions to improve the app!

---

**Note:**  
This guide is a detailed draft and may be updated as new features are added or the UI evolves. For the latest information, always check the app or contact support.
