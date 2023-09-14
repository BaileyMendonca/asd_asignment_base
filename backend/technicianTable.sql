CREATE TABLE technician (
    TechnicianID INTEGER PRIMARY KEY,
    Name TEXT NOT NULL,
    CurrentPoints FLOAT DEFAULT 0,
    AppointmentsToday INTEGER[],
    WorkingDays TEXT[]
);
