import React from "react";
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "components/Appointment";
import {
  getAppointmentsForDay,
  getInterviewersForDay,
  getInterview,
} from "helpers/selectors";
import { useApplicationData } from "hooks/useApplicationData";

export default function Application(props) {
  const {
    state,
    setDay,
    bookInterview,
    deleteInterview,
  } = useApplicationData();

  const interviewersByDay = getInterviewersForDay(state, state.day);
  const appointments = getAppointmentsForDay(state, state.day);
  const schedule = appointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);

    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewersByDay}
        bookInterview={bookInterview}
        deleteInterview={deleteInterview}
      />
    );
  });

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
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment
          bookInterview={bookInterview}
          deleteInterview={deleteInterview}
          key="last"
          time="5pm"
        />
      </section>
    </main>
  );
}
