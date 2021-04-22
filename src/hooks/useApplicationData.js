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

  /**
   * Function called to book an interview object to state.appointments[id] and write it to the database
   * @param {*} id str, one digit from 0-4 corresponding to a DayListItem
   * @param {*} interview object, interview object with paramaters completed in form
   * @param {*} edit boolean, optional parameter. Prevent spots from decrementing when editing existing appointment. Default is false.
   * @returns 
   */
  const bookInterview = (id, interview, edit=false) => {
    // appointment object, copy of state.appointments of day with interview parameter added
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview}
    };
  
    // copy of state.appointments with our appointment object added to it
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    // returns state.days copy where spots is reduced by 1 for target day unless edit flag is true in which case spots do not change
    const days = cloneDeep(state.days);
    if (!edit) {
      days[dayIndex].spots--
    }
    //axios call writes appointment in database, then if it succeeds dispatch adds the interview to the state
    return axios.put(`/api/appointments/${id}`, { interview })
    .then(() => dispatch({ type: 'setInterview', appointments, days }))
  }
  /**
   * Deletes appointment of given id from database and state
   * @param {*} id str, any 1 of the digits 1-25 corresponding to one of the appointments in the state.
   * @returns 
   */
  const cancelInterview = id => {
    // Creates appointment object where appointment corresponding to id has interview property set to null
    const appointments = {
      ...state.appointments,
      [id]: { ...state.appointments[id], interview: null }
    }
  
    // returns state.days copy where spots is increased by 1 for target day
    const days = cloneDeep(state.days);
    days[dayIndex].spots++
    // removes appointment from database. If succeeds, sets state accordingly.
    return axios.delete(`/api/appointments/${id}`)
    .then(() => dispatch({ type: 'setInterview', appointments, id, days }));
  }
  // axios calls to database to generate state from scheduler_api data.
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