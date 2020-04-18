import { useState, useEffect } from "react";
import axios from "axios";

export function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day });

  useEffect(() => {
    const daysRequest = axios.get("/api/days");

    const apptRequest = axios.get("/api/appointments");

    const intRequest = axios.get("/api/interviewers");

    Promise.all([
      Promise.resolve(daysRequest),
      Promise.resolve(apptRequest),
      Promise.resolve(intRequest),
    ]).then((all) => {
      console.log("Day and Appointment requests", all);
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  function bookInterview(id, interview) {
    console.log(id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const putRequest = axios
      .put(`/api/appointments/${id}`, {
        interview,
      })
      .then(() => {
        setState({ ...state, appointments });
      });

    return putRequest;
  }

  function deleteInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const deleteRequest = axios.delete(`/api/appointments/${id}`).then(() => {
      setState({ ...state, appointments });
    });

    return deleteRequest;
  }

  return { state, setDay, bookInterview, deleteInterview };
}
