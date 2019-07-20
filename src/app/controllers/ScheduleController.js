import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController {
  async index(req, res) {
    /**
     * Check if user is provider
     */
    const isUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!isUserProvider) {
      return res.status(401).json({ error: 'You are not a provider' });
    }

    const { date } = req.query;
    /**
     * Check if date was provided
     */
    if (!date) {
      return res.status(400).json({ error: 'Date must be informed' });
    }

    const parsedDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
    });

    return res.json(appointments);
  }
}
export default new ScheduleController();
