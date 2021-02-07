import { startOfHour } from "date-fns";
import { getCustomRepository } from "typeorm";

import AppError from "@shared/errors/AppError";

import Appointment from "../infra/typeorm/entities/Appointment";
import AppointmentsRepository from "@modules/appointments/infra/typeorm/repositories/AppointmentsRepository";

interface RequestDTO {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ provider_id, date }: RequestDTO): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const checkAppointmentDateTaken = await appointmentsRepository.findByDate(
      appointmentDate
    );

    if (checkAppointmentDateTaken) {
      throw new AppError("Date already booked.");
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
