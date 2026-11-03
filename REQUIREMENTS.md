# Salon & Spa Management ERP
## Complete Frontend Development Requirements
### Reference Platforms: Fresha & Mindbody

# 1. Project Overview

We need to develop a modern, professional, and interactive Salon & Spa Management ERP.

The application should be designed as a commercial SaaS product that can be presented to potential clients, including:

- Beauty Salons
- Hair Salons
- Beauty Parlours
- Spas
- Massage Centers
- Nail Studios
- Wellness Centers
- Skincare Clinics

**IMPORTANT: This is a frontend-only demo project.**

The objective is to demonstrate the complete functionality and user experience of a real Salon & Spa ERP without developing the backend at this stage.

No database, backend APIs, or actual payment gateway integration is required.

All modules should use realistic mock data, frontend state management, and localStorage for demo persistence.

The application must look like a fully developed commercial software product, not a static UI prototype.

# 2. USER ROLES & PORTALS

The application must have four separate portals:

1. Super Admin / Salon Owner
2. Receptionist / Front Desk
3. Staff / Beautician / Therapist
4. Customer / Client

Each portal must have its own dashboard, sidebar navigation, permissions, and features.

Provide demo login functionality so we can easily switch between different roles during client presentations.

# 3. ADMIN / SALON OWNER PORTAL

The Admin Portal is the main business management control center.

## A. Admin Dashboard

Create a professional dashboard showing:

### Business Overview
- Total Revenue
- Today's Revenue
- Monthly Revenue
- Total Appointments
- Today's Appointments
- Upcoming Appointments
- Completed Appointments
- Cancelled Appointments
- Total Customers
- New Customers
- Active Staff
- Total Services

### Dashboard Analytics
- Daily Revenue Chart
- Monthly Revenue Chart
- Appointment Statistics
- Service Popularity Chart
- Staff Performance Chart
- Customer Growth Chart
- Payment Method Statistics

### Dashboard Widgets
- Today's Appointment Schedule
- Upcoming Appointments
- Recent Transactions
- Top Performing Staff
- Most Popular Services
- Low Stock Products
- Recent Customer Registrations
- Pending Payments
- Recent Activities

Allow filtering by date range and branch.

## B. Branch Management

For businesses operating multiple locations:

- Add New Branch
- Edit Branch
- Delete Branch
- Branch Name
- Branch Address
- Contact Number
- Email
- Opening Hours
- Branch Manager
- Branch Status

Each branch should have its own:

- Staff
- Services
- Appointments
- Customers
- Inventory
- Revenue Reports

Include a branch selector in the Admin Dashboard.

For the demo, create at least three sample branches.

## C. Service Management

Admin should be able to create and manage salon and spa services.

### Service Categories

- Hair Services
- Facial Treatments
- Skincare
- Makeup
- Manicure
- Pedicure
- Nail Art
- Massage
- Body Treatments
- Spa Packages
- Hair Coloring
- Hair Treatments
- Bridal Services

### Add / Edit Service Form

Fields:

- Service Name
- Service Category
- Service Description
- Service Image
- Service Duration
- Service Price
- Discounted Price
- Assigned Staff
- Available Branches
- Required Resources
- Service Status

Example services:

| Service | Duration | Price |
|---|---:|---:|
| Haircut | 30 min | Rs. 1,500 |
| Hair Coloring | 120 min | Rs. 5,000 |
| Facial Treatment | 60 min | Rs. 3,000 |
| Manicure | 45 min | Rs. 1,800 |
| Pedicure | 60 min | Rs. 2,000 |
| Full Body Massage | 90 min | Rs. 6,000 |
| Bridal Makeup | 180 min | Rs. 15,000 |

Admin should be able to:

- Add services.
- Edit services.
- Delete services.
- Activate/deactivate services.
- Assign services to staff.
- Assign services to branches.
- Set service-specific durations.
- Set prices and discounts.

## D. Appointment Management

This is one of the most important modules.

Create a complete appointment management system.

### Appointment Calendar

Provide different calendar views:

- Daily View
- Weekly View
- Monthly View
- Staff-wise Calendar
- Branch-wise Calendar
- Service-wise Calendar

Display appointments with:

- Customer Name
- Service Name
- Assigned Staff
- Appointment Date
- Start Time
- End Time
- Appointment Status
- Payment Status

### Appointment Statuses

- Pending
- Confirmed
- Checked In
- In Progress
- Completed
- Cancelled
- No Show

### Appointment Management Features

Admin should be able to:

- Create new appointments.
- Select existing customers.
- Add walk-in customers.
- Select services.
- Select preferred staff.
- Select branch.
- Select appointment date.
- View available time slots.
- Confirm appointments.
- Reschedule appointments.
- Cancel appointments.
- Assign or change staff.
- Add internal notes.
- View appointment history.

### Appointment Booking Flow

1. Select Branch.
2. Select Service.
3. Select Staff or Any Available Staff.
4. Select Appointment Date.
5. Display Available Time Slots.
6. Select Time Slot.
7. Enter Customer Details.
8. Confirm Booking.
9. Generate Appointment Confirmation.

Prevent overlapping appointments for the same staff member in the frontend demo.

The available time slots should depend on:

- Staff working hours.
- Service duration.
- Existing appointments.
- Break times.

## E. Staff Management

Admin should be able to manage all salon employees.

### Staff Types

- Hair Stylists
- Beauticians
- Makeup Artists
- Massage Therapists
- Nail Technicians
- Skincare Specialists
- Receptionists
- Branch Managers

### Staff Profile

Each staff member should have:

- Profile Picture
- Full Name
- Email
- Phone Number
- Designation
- Assigned Branch
- Assigned Services
- Joining Date
- Working Hours
- Weekly Schedule
- Commission Percentage
- Salary Information
- Employment Status

### Staff Management Features

- Add Staff.
- Edit Staff.
- Delete Staff.
- Assign Services.
- Assign Branches.
- Manage Working Hours.
- Manage Break Times.
- Set Weekly Off Days.
- Manage Staff Leave.
- View Appointments.
- View Completed Services.
- View Performance.
- View Commission History.

## F. Staff Commission Management

Create a dedicated commission module.

Admin should be able to:

- Set individual staff commission percentages.
- Set service-specific commissions.
- View earned commissions.
- View monthly commissions.
- View pending commissions.
- View paid commissions.
- Generate commission reports.

Example:

Haircut Price: Rs. 1,500

Staff Commission: 20%

Staff Earnings: Rs. 300

Salon Revenue Before Other Expenses: Rs. 1,200

Show commission calculations automatically when a service is marked completed and paid.

## G. Customer / CRM Management

Create a complete customer management system.

### Customer Profile

- Customer Name
- Profile Picture
- Email
- Phone Number
- Date of Birth
- Gender
- Address
- Registration Date
- Preferred Branch
- Customer Notes

### Customer History

- Previous Appointments
- Upcoming Appointments
- Services Purchased
- Total Spending
- Payment History
- Membership Details
- Loyalty Points
- Customer Reviews
- Cancelled Appointments

### Additional Features

- Add New Customer.
- Edit Customer.
- Search Customers.
- Filter Customers.
- View Customer Details.
- Add Internal Notes.
- View Customer Preferences.
- Track Customer Visits.
- Identify Regular Customers.
- Identify Inactive Customers.

Include customer tags:

- New Customer
- Regular Customer
- VIP Customer
- Inactive Customer

## H. Billing & POS (Point of Sale)

Create a modern billing interface for receptionists and salon staff.

### POS Features

- Select Customer.
- Add Services.
- Add Products.
- Adjust Quantities.
- Apply Discounts.
- Apply Coupons.
- Add Tax.
- Calculate Total.
- Accept Payment.
- Generate Invoice.
- Print / Download Receipt.

### Payment Methods

- Cash
- Credit/Debit Card
- Bank Transfer
- JazzCash
- Easypaisa
- Wallet

### Invoice Information

- Invoice Number
- Customer Name
- Service Details
- Product Details
- Subtotal
- Discount
- Tax
- Total Amount
- Payment Method
- Payment Status
- Transaction Date

Allow partial payments and outstanding balances in the demo.

After successful payment:

- Update invoice status.
- Update customer payment history.
- Update business revenue.
- Update staff commission where applicable.
- Generate a printable receipt.

## I. Membership & Packages Management

Create a membership and prepaid package management module.

### Membership Types

- Basic Membership
- Silver Membership
- Gold Membership
- Platinum Membership
- VIP Membership

### Membership Features

- Create Membership Plans.
- Set Membership Prices.
- Define Validity.
- Set Discounts.
- Assign Benefits.
- Activate / Deactivate Memberships.
- View Membership Customers.
- Track Expiry Dates.
- Renew Memberships.

### Example Package

Gold Beauty Package:

- 3 Facial Sessions
- 2 Hair Treatments
- 2 Manicure Sessions
- 15% Discount on Additional Services
- Validity: 3 Months

Customers should be able to view their remaining sessions and membership expiry.

## J. Inventory & Product Management

Create a basic inventory management system.

### Product Categories

- Hair Care
- Skincare
- Cosmetics
- Massage Oils
- Nail Products
- Beauty Accessories
- Salon Equipment

### Product Management

- Add Product.
- Edit Product.
- Delete Product.
- Product Name.
- Product SKU.
- Barcode (display only).
- Category.
- Purchase Price.
- Selling Price.
- Available Quantity.
- Minimum Stock Level.
- Supplier.
- Product Image.

### Inventory Operations

- Stock In.
- Stock Out.
- Adjust Stock.
- Record Product Sales.
- View Stock History.
- View Low Stock Products.
- View Inventory Value.

Show a low-stock alert when product quantity falls below the minimum stock level.

## K. Supplier Management

- Add Suppliers.
- Edit Suppliers.
- Supplier Contact Information.
- Supplier Address.
- Supplier Email.
- Purchase History.
- Outstanding Supplier Payments.

## L. Expense Management

Admin should be able to record and manage business expenses.

Expense categories:

- Rent
- Salaries
- Utilities
- Product Purchases
- Equipment
- Marketing
- Maintenance
- Other Expenses

Features:

- Add Expense.
- Edit Expense.
- Delete Expense.
- Upload Expense Receipt.
- Select Expense Category.
- Enter Amount.
- Select Date.
- Add Description.
- View Expense History.

Display:

- Total Expenses.
- Monthly Expenses.
- Expense Categories.
- Expense Trends.

## M. Reports & Analytics

Create a comprehensive reporting section.

Reports should include:

- Daily Revenue Report.
- Weekly Revenue Report.
- Monthly Revenue Report.
- Appointment Report.
- Cancelled Appointment Report.
- No-Show Report.
- Customer Growth Report.
- Staff Performance Report.
- Staff Commission Report.
- Service Popularity Report.
- Product Sales Report.
- Inventory Report.
- Expense Report.
- Profit & Loss Summary.
- Branch Performance Report.

Provide date filters, branch filters, staff filters, charts, tables, and simulated CSV/PDF export actions.

# 4. RECEPTIONIST / FRONT DESK PORTAL

The Receptionist portal is designed for managing daily salon operations.

## A. Receptionist Dashboard

Display:

- Today's Appointments.
- Upcoming Appointments.
- Checked-In Customers.
- Walk-In Customers.
- Pending Payments.
- Completed Services.
- Available Staff.
- Daily Sales.

## B. Appointment Management

Receptionists should be able to:

- Create appointments.
- Book walk-in customers.
- Search customers.
- Register new customers.
- Select services.
- Select staff.
- Check available time slots.
- Confirm appointments.
- Reschedule appointments.
- Cancel appointments.
- Check in customers.
- Mark customers as no-show.

## C. Customer Check-In

When a customer arrives:

1. Search appointment.
2. Open customer details.
3. Confirm appointment.
4. Mark customer as Checked In.
5. Notify assigned staff through the demo interface.

## D. Billing & Checkout

Receptionists should be able to:

- Open customer appointment.
- Add additional services.
- Add products.
- Apply discounts.
- Generate invoice.
- Select payment method.
- Process simulated payment.
- Print receipt.
- Mark appointment as completed.

## E. Customer Registration

Allow receptionists to quickly register walk-in customers.

Fields:

- Customer Name.
- Phone Number.
- Email.
- Gender.
- Date of Birth.
- Address.

## F. Daily Activity

Display:

- Today's Bookings.
- New Customers.
- Walk-In Customers.
- Completed Appointments.
- Cancelled Appointments.
- Daily Collection.

# 5. STAFF / BEAUTICIAN / THERAPIST PORTAL

This portal is designed for salon employees.

## A. Staff Dashboard

Display:

- Today's Appointments.
- Upcoming Appointments.
- Completed Services.
- Pending Services.
- Working Hours.
- Monthly Earnings.
- Commission Earned.
- Upcoming Breaks.

## B. My Appointments

Staff should be able to:

- View daily appointments.
- View weekly appointments.
- View customer names.
- View booked services.
- View appointment timings.
- View customer notes.
- View appointment status.

## C. Service Management

Staff should be able to:

- View assigned services.
- View service durations.
- View service prices.
- View service instructions.
- View required products or equipment.

## D. Appointment Workflow

1. View upcoming appointment.
2. View customer details.
3. Mark customer as arrived.
4. Start service.
5. Mark service as completed.
6. Add service notes.

Staff should not have access to other staff members' private financial or salary information.

## E. Working Schedule

- View Weekly Schedule.
- View Daily Schedule.
- View Working Hours.
- View Break Times.
- Request Leave.
- View Approved Leave.

## F. Commission & Earnings

Staff should be able to view:

- Completed Services.
- Commission Percentage.
- Commission Earned.
- Pending Commission.
- Paid Commission.
- Monthly Earnings Summary.

## G. Customer History

Allow staff to view relevant customer information:

- Previous Services.
- Previous Visits.
- Customer Preferences.
- Relevant Service Notes.
- Allergies or Product Sensitivities (sample fields only).

Sensitive customer information should only be visible to authorized staff.

# 6. CUSTOMER PORTAL / ONLINE BOOKING

The Customer Portal is an important part of the product.

It should have an attractive, modern, mobile-friendly interface.

## A. Customer Dashboard

Display:

- Welcome Message.
- Upcoming Appointments.
- Previous Appointments.
- Membership Status.
- Available Loyalty Points.
- Total Visits.
- Total Spending.
- Special Offers.
- Recommended Services.

## B. Online Service Booking

Customers should be able to book appointments online without contacting the salon.

### Booking Process

Step 1: Select Salon Branch.

Step 2: Browse Services.

Step 3: Select Service Category.

Step 4: View Service Details.

Step 5: Select Preferred Staff or Any Available Staff.

Step 6: Select Appointment Date.

Step 7: View Available Time Slots.

Step 8: Select Time Slot.

Step 9: Confirm Customer Information.

Step 10: Select Payment Option.

Step 11: Confirm Booking.

Step 12: Display Booking Confirmation.

### Booking Details

Display:

- Booking Reference Number.
- Salon Branch.
- Service Name.
- Assigned Staff.
- Appointment Date.
- Appointment Time.
- Service Duration.
- Total Price.
- Payment Status.

## C. My Appointments

Customers should be able to:

- View Upcoming Appointments.
- View Past Appointments.
- Reschedule Appointments.
- Cancel Appointments.
- View Appointment Details.
- View Booking Status.
- Book Again.

## D. Online Payments

Customers should be able to simulate online payments.

Payment options:

- Credit/Debit Card.
- JazzCash.
- Easypaisa.
- Bank Transfer.
- Pay at Salon.

After payment:

- Show payment success screen.
- Generate dummy transaction ID.
- Update payment status.
- Display downloadable receipt.

No actual payment gateway integration is required.

## E. Membership & Packages

Customers can:

- Browse Membership Plans.
- View Package Details.
- Purchase Demo Memberships.
- View Remaining Sessions.
- View Membership Expiry.
- Renew Membership.

## F. Loyalty & Rewards

Create a basic loyalty points system.

Example:

- Rs. 1,000 Spending = 10 Loyalty Points.
- 100 Points = Rs. 100 Discount.

Customers should be able to:

- View Loyalty Points.
- View Points History.
- Redeem Points.
- View Available Rewards.

## G. Reviews & Ratings

Customers can:

- Rate Services.
- Rate Staff.
- Write Reviews.
- View Previous Reviews.

Use simulated ratings and feedback.

## H. Customer Profile

- Personal Details.
- Contact Information.
- Appointment History.
- Payment History.
- Membership.
- Loyalty Points.
- Preferences.

# 7. NOTIFICATIONS & COMMUNICATION

Create a common notification system across the application.

Notification examples:

### Customer Notifications

- Appointment Booked.
- Appointment Confirmed.
- Appointment Reminder.
- Appointment Rescheduled.
- Appointment Cancelled.
- Payment Successful.
- Membership Expiring.
- Special Offers.

### Staff Notifications

- New Appointment Assigned.
- Appointment Rescheduled.
- Appointment Cancelled.
- Customer Checked In.
- Leave Approved.
- Commission Updated.

### Admin Notifications

- New Customer Registration.
- New Appointment.
- Appointment Cancellation.
- Payment Received.
- Low Stock Alert.
- Membership Purchase.

For frontend demonstration, notifications should appear through an in-app notification center and toast messages.

# 8. DESIGN & USER EXPERIENCE REQUIREMENTS

The design must be premium, modern, elegant, and professional.

The product should feel like a commercial SaaS application.

### Design Direction

- Clean SaaS dashboard.
- Modern sidebar navigation.
- Elegant typography.
- Premium cards.
- Professional data tables.
- Beautiful charts.
- Calendar-based appointment management.
- Modern modal forms.
- Smooth transitions.
- Consistent spacing.
- Professional icons.
- High-quality empty states.

### Suggested Color Palette

Primary: Deep Navy / Charcoal.

Secondary: Soft Beige / Cream.

Accent: Rose Gold / Warm Gold.

Background: White / Light Grey.

The UI should reflect the premium beauty and wellness industry.

Avoid outdated administrative dashboard designs.

### Responsive Requirements

The application must work on:

- Desktop.
- Laptop.
- Tablet.
- Mobile.

Customer booking should be especially optimized for mobile devices.

# 9. DEMO LOGIN & ROLE SWITCHING

Create a professional login page.

Provide four demo accounts:

Admin:
admin@salondemo.com
Password: 123456

Receptionist:
reception@salondemo.com
Password: 123456

Staff:
staff@salondemo.com
Password: 123456

Customer:
customer@salondemo.com
Password: 123456

These are dummy credentials.

Also provide quick demo role switching so we can demonstrate different portals without repeatedly logging out.

# 10. FRONTEND-ONLY TECHNICAL REQUIREMENTS

This project is strictly frontend-only.

Do not develop:

- Backend.
- Database.
- Laravel APIs.
- Real Authentication.
- Real Payment Gateway.
- SMS Gateway.
- Email Server.
- External Notification Services.

Recommended technology stack:

- React.js.
- TypeScript.
- Tailwind CSS.
- React Router.
- Lucide Icons.
- Recharts.
- Zustand or Context API.
- LocalStorage.

Use reusable components and clean architecture.

### Suggested Folder Structure

src/
components/
common/
layout/
forms/
tables/
charts/
calendar/

layouts/
AdminLayout/
ReceptionistLayout/
StaffLayout/
CustomerLayout/

pages/
auth/
admin/
receptionist/
staff/
customer/

data/
branches.ts
services.ts
staff.ts
customers.ts
appointments.ts
payments.ts
inventory.ts
memberships.ts

hooks/
services/
utils/
types/

# 11. MOCK DATA REQUIREMENTS

The demo must not look empty.

Populate the application with realistic sample data:

- 3 Salon Branches.
- 20+ Staff Members.
- 50+ Services.
- 200+ Customers.
- 100+ Appointments.
- 50+ Products.
- 20+ Membership Plans or Package Records.
- 100+ Payment Transactions.
- 30+ Expense Records.

Use Pakistani business-oriented sample data.

Currency: PKR / Rs.

Use realistic Pakistani names, phone number formats, service prices, and branch locations.

# 12. IMPORTANT END-TO-END DEMO SCENARIOS

All portals should be interconnected through shared mock data.

### Scenario 1: Online Appointment Booking

1. Login as Customer.
2. Browse salon services.
3. Select Haircut.
4. Select preferred branch.
5. Select available beautician.
6. Select date and time.
7. Confirm appointment.
8. View booking confirmation.
9. Login as Admin.
10. View the newly created appointment.

### Scenario 2: Receptionist Check-In & Billing

1. Login as Receptionist.
2. View today's appointments.
3. Search customer.
4. Open appointment.
5. Mark customer as Checked In.
6. Add an additional service.
7. Generate invoice.
8. Complete simulated payment.
9. Generate receipt.
10. Mark appointment as Completed.

### Scenario 3: Staff Service Workflow

1. Login as Staff.
2. View today's assigned appointments.
3. Open customer details.
4. View booked services.
5. Start service.
6. Mark service as Completed.
7. View updated commission.

### Scenario 4: Admin Revenue Management

1. Login as Admin.
2. Open Dashboard.
3. View today's revenue.
4. Open appointment reports.
5. View completed appointments.
6. View payment transactions.
7. View staff commissions.
8. View monthly revenue chart.
9. View branch performance.

### Scenario 5: Membership Purchase

1. Login as Customer.
2. Browse membership plans.
3. Select Gold Membership.
4. View membership benefits.
5. Purchase through simulated payment.
6. Display membership confirmation.
7. View active membership.
8. Login as Admin.
9. View newly purchased membership.

### Scenario 6: Inventory Management

1. Login as Admin.
2. Open Inventory.
3. Add a new product.
4. Update stock quantity.
5. Open POS.
6. Sell a product.
7. Complete payment.
8. Verify inventory quantity has decreased.
9. View product sales report.

# 13. FUNCTIONAL INTERACTION REQUIREMENTS

Do not create static pages with non-functional buttons.

Major interactions must work.

Examples:

- Add Staff → Add staff to mock records.
- Add Service → Update service list.
- Book Appointment → Add appointment to calendar.
- Reschedule Appointment → Update date and time.
- Cancel Appointment → Update appointment status.
- Check In → Update customer status.
- Complete Service → Update appointment and commission.
- Generate Invoice → Create invoice.
- Process Payment → Update transaction and revenue.
- Purchase Membership → Activate membership.
- Sell Product → Reduce inventory quantity.
- Add Expense → Update expense records.
- Add Customer → Update customer records.

Use localStorage to preserve demo changes after refreshing the browser.

Use confirmation dialogs, success messages, and validation wherever appropriate.

# 14. FINAL DELIVERABLES

Developer must deliver:

1. Complete responsive frontend application.
2. Admin Portal.
3. Receptionist Portal.
4. Staff Portal.
5. Customer Portal.
6. Interactive dashboards.
7. Complete appointment booking system.
8. Service management.
9. Staff management.
10. Customer CRM.
11. Billing and POS.
12. Simulated online payment system.
13. Membership and packages management.
14. Inventory management.
15. Commission management.
16. Expense management.
17. Reports and analytics.
18. Notifications.
19. Realistic mock data.
20. Functional cross-portal interactions.
21. Demo login credentials.
22. Complete source code.
23. Instructions to run the application.

# 15. DEVELOPMENT PRIORITY

Develop the system in the following order.

Phase 1 – Foundation
- Login.
- Role Selection.
- Layouts.
- Navigation.
- Demo Data.
- Dashboard UI.

Phase 2 – Admin Portal
- Branch Management.
- Service Management.
- Staff Management.
- Customer Management.
- Appointment Management.

Phase 3 – Operations
- Receptionist Portal.
- Calendar.
- Customer Check-In.
- Billing & POS.
- Payments.
- Commission Management.

Phase 4 – Customer Portal
- Online Booking.
- Appointment History.
- Customer Profile.
- Membership.
- Loyalty Points.
- Payment History.

Phase 5 – Staff Portal
- Staff Dashboard.
- Appointments.
- Working Schedule.
- Service Workflow.
- Commission & Earnings.

Phase 6 – Business Management
- Inventory.
- Suppliers.
- Expenses.
- Reports.
- Analytics.
- Notifications.

Phase 7 – Final Polish
- Cross-portal interactions.
- LocalStorage persistence.
- Responsive testing.
- UI consistency.
- Complete demo scenario testing.

# FINAL EXPECTATION

We are building a complete frontend prototype of a commercial Salon & Spa Business Management ERP.

The application should demonstrate how a salon business operates from customer booking to service completion, billing, staff commission, inventory management, and business analytics.

The most important requirement is that all four portals must be interconnected.

For example:

- Customer books an appointment.
- Admin sees the appointment.
- Receptionist checks in the customer.
- Staff sees the assigned appointment.
- Staff starts and completes the service.
- Receptionist generates the invoice.
- Customer completes the simulated payment.
- Staff commission is calculated.
- Inventory is updated if products are consumed or sold.
- Admin dashboard reflects the updated revenue and business activity.

**The final product must feel like a complete, working commercial Salon & Spa ERP, not simply a collection of dashboard screens.**

The primary objective is to deliver an impressive, interactive demo that can be presented to salon owners, spa operators, and potential business clients.