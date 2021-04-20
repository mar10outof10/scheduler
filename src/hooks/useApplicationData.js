import { useEffect, useReducer } from "react";
import axios from "axios";

import { cloneDeep } from "lodash";

export default function useApplicationData() {
  const defaultState = {
    day: "Monday",
    days: [],
    interviewers: {},
    appointments: {}
  }
  
  const reducers = {
    setDay(state, action) {
      return {
        ...state,
        day: action.day
    }
    },
    setApplicationData(state, action) {
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers
      }
    },
    setInterview(state, action) {
      return {
        ...state,
        appointments: action.appointments,
        days: action.days
      }
    }
  };
  
  function reducer(state, action) {
    return reducers[action.type](state, action) || state
  }



  const [state, dispatch] = useReducer(reducer, defaultState); 

  const setDay = day => dispatch({ type: 'setDay', day});
  
  const dayIndex = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].indexOf(state.day);

  const bookInterview = (id, interview, edit=false) => {
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
    if (!edit) {
      days[dayIndex].spots--
    }

    return axios.put(`/api/appointments/${id}`, { interview })
    .then(() => dispatch({ type: 'setInterview', appointments, days }))
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
    .then(() => dispatch({ type: 'setInterview', appointments, id, days }));
  }

  const daysPromise = Promise.resolve(axios.get("/api/days"));
  const apptsPromise = Promise.resolve(axios.get("/api/appointments"));
  const interviewersPromise = Promise.resolve(axios.get("/api/interviewers"));
  useEffect(() => {
    Promise.all([daysPromise, apptsPromise, interviewersPromise])
      .then(all => {
        dispatch({ type: 'setApplicationData', days: all[0].data, appointments: all[1].data, interviewers: all[2].data})
      })
  }, [])

  return { state: state, setDay, bookInterview, cancelInterview}
}