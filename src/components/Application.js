import React, { useState, useEffect } from "react";
import "components/Application.scss";
import Appointment from "./Appointment";
import DayList from "./DayList";
import axios from "axios";
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "helpers/selectors.js";


// const appointments = [
//   {
//     id: 1,
//     time: "12pm",
//   },
//   {
//     id: 2,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       }
//     }
//   },
//   {
//     id: 3,
//     time: "2pm",
//     interview: {
//       student: "Jim Bstevens",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       }
//     }
//   };

export default function Application(props) {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  const setDay = day => setState({...state, day});

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview}
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, { interview })
    .then(() => setState({...state, appointments }))
  }

  const cancelInterview = id => {
    const appointments = {
      ...state.appointments,
      [id]: { ...state.appointments[id], interview: null }
    }

    return axios.delete(`/api/appointments/${id}`)
    .then(() => setState({ ...state, appointments}));
  }

  const dailyAppointments = getAppointmentsForDay(state, state.day);

  const appointmentsList = dailyAppointments.map((appointment => {
    const interview = getInterview(state, appointment.interview);
    const interviewers = getInterviewersForDay(state, state.day);

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

  const daysPromise = Promise.resolve(axios.get("/api/days"));
  const apptsPromise = Promise.resolve(axios.get("/api/appointments"));
  const interviewersPromise = Promise.resolve(axios.get("/api/interviewers"));
  useEffect(() => {
    Promise.all([daysPromise, apptsPromise, interviewersPromise])
      .then(all => {
        setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
      })
  }, [])

  // useEffect(() => {
  //   axios.get("/api/days")
  //   .then((res) => {
  //     setDays(res.data);
  //   })
  // }, [])

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
        {<Appointment key="last" time="5pm" />}
      </section>
    </main>
  );
}

