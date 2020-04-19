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

  function findSpots(appointmentId, type) {
    //Loop through the appointment key and find the matching id

    let dayFound = {};

    for (let item of state.days) {
      if (item.appointments.includes(appointmentId)) {
        dayFound = item;
      }
    }
    //Find the index of each day in the days object
    //Once found update the spots count (Book removes a spot, Delete adds a spot)
    let dayIndex = dayFound.id - 1;

    let spotResult = dayFound.spots;
    if (type === "Book") {
      spotResult -= 1;
    }

    if (type === "Delete") {
      spotResult += 1;
    }

    //Update the spots value with the new spot count
    let newDaysArray = state.days;
    newDaysArray[dayIndex].spots = spotResult;

    //SetState with the new days information
    setState({ ...state, days: newDaysArray });
  }

  function bookInterview(id, interview) {
    const putRequest = axios
      .put(`/api/appointments/${id}`, {
        interview,
      })
      .then(() => {
        const appointment = {
          ...state.appointments[id],
          interview: { ...interview },
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment,
        };
        setState({ ...state, appointments });
      })
      .then(findSpots(id, "Book"));

    return putRequest;
  }

  function deleteInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const deleteRequest = axios
      .delete(`/api/appointments/${id}`)
      .then(() => {
        setState({ ...state, appointments });
      })
      .then(findSpots(id, "Delete"));

    return deleteRequest;
  }

  return { state, setDay, bookInterview, deleteInterview };
}
