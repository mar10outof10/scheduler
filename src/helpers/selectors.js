export const getAppointmentsForDay = (state, day) => {
  const { days, appointments } = state;
  const filteredAppts = days.filter(date => date.name === day);
  if (!filteredAppts.length) {
    return [];
  }
  const appts = filteredAppts[0].appointments;
  return Object.values(appointments).filter((app) => appts.includes(app.id));
};

export const getInterview = (state, interview) => {
  if (!interview) {
    return null;
  }
  const filterInterview = Object.values(state.interviewers).filter(interviewer => interviewer.id === interview.interviewer)
  const resInterview = { interviewer: filterInterview[0], student: interview.student };
  return resInterview;
}