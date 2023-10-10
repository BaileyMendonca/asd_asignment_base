-- AlterTable
CREATE SEQUENCE appointment_appointmentid_seq;
ALTER TABLE "Appointment" ALTER COLUMN "AppointmentID" SET DEFAULT nextval('appointment_appointmentid_seq');
ALTER SEQUENCE appointment_appointmentid_seq OWNED BY "Appointment"."AppointmentID";
