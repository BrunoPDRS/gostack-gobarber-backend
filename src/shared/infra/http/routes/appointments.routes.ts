import { Router } from "express";
import { getCustomRepository } from "typeorm";
import { parseISO } from "date-fns"; // parseISO converts string to date

import AppointmentsRepository from "../../../../modules/appointments/repositories/AppointmentsRepository";
import CreateAppointmentService from "../modules/users/services/CreateAppointmentService";

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);
// Route: get request, call a method from other file to treat data, return a response

appointmentsRouter.get("/", async (req, res) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);

  const appointments = await appointmentsRepository.find();

  return res.json(appointments);
});

appointmentsRouter.post("/", async (req, res) => {
  const { provider_id, date } = req.body;

  const parsedDate = parseISO(date);

  const createAppointment = new CreateAppointmentService();

  const appointment = await createAppointment.execute({
    provider_id,
    date: parsedDate,
  });

  return res.json(appointment);
});

export default appointmentsRouter;
