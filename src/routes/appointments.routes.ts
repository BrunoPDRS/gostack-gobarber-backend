import { Router } from "express";
import { startOfHour, parseISO } from "date-fns"; // parseISO converts string to date
import Appointment from "../models/Appointment";
import AppointmentsRepository from "../repositories/AppointmentsRepository";

const appointmentsRouter = Router();
const appointmentsRepository = new AppointmentsRepository();

const appointments: Appointment[] = [];

appointmentsRouter.post("/", (req, res) => {
  const { provider, date } = req.body;

  const parsedDate = startOfHour(parseISO(date));

  const checkAppointmentDateTaken = appointmentsRepository.findByDate(
    parsedDate
  );

  if (checkAppointmentDateTaken) {
    return res.status(400).json({ message: "Date already booked." });
  }

  const appointment = appointmentsRepository.create(provider, parsedDate);
});

export default appointmentsRouter;
