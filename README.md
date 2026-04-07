# TeamTask
full-stack web application for quarterly project & overtime management with the following features. Use React for the frontend, Node.js/Express for the backend, and MongoDB or PostgreSQL for the database. Include authentication (manager login + team member login).

Part 1 – Project & Task Management (Quarterly)
Manager can:

Create, edit, delete a quarterly project (Q1, Q2, Q3, Q4).

Create team members (name, email, role).

Assign tasks to team members with:

Task name

Task category

Task description

Due date

Progress tracker (0–100%, or Not Started / In Progress / Completed)

Filter tasks by:

Team member name

Time range (due date)

Progress status

Export to Excel with columns:

Task category

Task description

Assigned member

Current status (progress)

Due date

Ad-hoc Task Section (outside quarterly planning):

Manager can create ad-hoc tasks anytime (not tied to quarters).

Same fields as regular tasks.

Displayed separately but exportable together.

Part 2 – Overtime & Attendance Dashboard (Sequential Shift System)
Shift logic:

Morning = 1 person, Afternoon = 1 person.

Monday to Saturday.

Team total = e.g., 4 people.

Rotation is sequential:

Monday morning: Person A, Monday afternoon: Person B

Tuesday morning: Person C, Tuesday afternoon: Person D

Wednesday morning: Person A, Wednesday afternoon: Person B (repeat cycle)

If team size changes, the sequence auto-adjusts.

Overtime calculation:

Only count overtime for people who actually worked that shift.

Overtime = extra hours beyond normal shift (manager can set daily normal hours, e.g., 8 hours).

Manager can deduct overtime when a person is absent (absence log).

Overtime balance = earned overtime - deducted overtime.

Dashboard shows:

Available team members (number + names).

Daily shift assignment (Monday–Saturday morning/afternoon).

Overtime earned per person.

Overtime deducted per person (with reason: absence).

Net overtime balance.

Export to Excel:

Export overtime log (name, shift date, shift type, overtime earned, deducted, net).

Part 3 – Extra Requirements
Role-based view:

Manager sees all (projects, tasks, ad-hoc, overtime, deductions).

Team member sees only their own tasks + their overtime balance.

Responsive UI (mobile/desktop).

Search & sort on all tables.

Use a clean dashboard layout with charts (progress, overtime trends).
