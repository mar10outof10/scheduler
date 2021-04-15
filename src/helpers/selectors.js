export const getAppointmentsForDay = (state, day) => {
  const { days, appointments } = state;
  const filteredAppts = days.filter(date => date.name === day);
  if (!filteredAppts.length) {
    return [];
  }
  const appts = filteredAppts[0].appointments;
  return Object.values(appointments).filter((app) => appts.includes(app.id));
};