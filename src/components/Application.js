import React, { useState, useEffect } from "react";
import "components/Application.scss";
import Appointment from "./Appointment";
import DayList from "./DayList";
import axios from "axios";

const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 3,
    time: "2pm",
    interview: {
      student: "Jim Bstevens",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 4,
    time: "1pm",
    interview: {
      student: "Eyyyyyy Jones",
      interviewer: {
        id: 4,
        name: "Cohana Roy",
        avatar: "https://i.imgur.com/FK8V841.jpg",
      }
    }
  }
];


export default function Application(props) {

  const [day, setDay] = useState("Monday");
  const [days, setDays] = useState([]);

  const appointmentsList = appointments.map((appointment => {
    return (
      <Appointment 
      key={appointment.id}
      {...appointment}
      />
    )
  }))

  useEffect(() => {
    axios.get("/api/days")
    .then((res) => {
      setDays(res.data);
    })
  }, [])

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
            days={days}
            day={day}
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

