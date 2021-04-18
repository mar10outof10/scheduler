import { useState, useEffect } from "react";
import axios from "axios";

import { cloneDeep } from "lodash";

export default function useApplicationData() {
  //state.days.appointmentId.spots
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({...state, day});
  
  const dayIndex = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].indexOf(state.day);

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview}
    };
  
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    // state.days[dayIndex].spots

    // returns state.days copy where spots is reduced by 1 for target day
    const days = cloneDeep(state.days);
    days[dayIndex].spots--

    return axios.put(`/api/appointments/${id}`, { interview })
    .then(() => setState({...state, appointments, days }))
  }
  
  const cancelInterview = id => {
    const appointments = {
      ...state.appointments,
      [id]: { ...state.appointments[id], interview: null }
    }
  
    // returns state.days copy where spots is increased by 1 for target day
    const days = cloneDeep(state.days);
    days[dayIndex].spots++

    return axios.delete(`/api/appointments/${id}`)
    .then(() => setState({ ...state, appointments, days }));
  }

  const daysPromise = Promise.resolve(axios.get("/api/days"));
  const apptsPromise = Promise.resolve(axios.get("/api/appointments"));
  const interviewersPromise = Promise.resolve(axios.get("/api/interviewers"));
  useEffect(() => {
    Promise.all([daysPromise, apptsPromise, interviewersPromise])
      .then(all => {
        setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
      })
  }, [])

  return { state: state, setDay, bookInterview, cancelInterview}
}