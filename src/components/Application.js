import React from "react";
import "components/Application.scss";
import Appointment from "./Appointment";
import DayList from "./DayList";
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "helpers/selectors.js";
import useApplicationData from "../hooks/useApplicationData"

export default function Application() {
  // sets state and imports functions from useApplicationData()
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } =  useApplicationData();
  // retrieves arary of appointments for currently selected day (state)
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  // retrieves array of JSX Appointment objects from dailyAppointments array
  const appointmentsList = dailyAppointments.map((appointment => {
    const interview = getInterview(state, appointment.interview); // gets interview data for the day's appointment
    const interviewers = getInterviewersForDay(state, state.day); // gets interviewer data for the day's appointment

    return (
      <Appointment 
      key={appointment.id}
      {...appointment}
      interview={interview}
      interviewers={interviewers}
      bookInterview={bookInterview}
      cancelInterview={cancelInterview}
      />
    )
  }))

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentsList}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}

