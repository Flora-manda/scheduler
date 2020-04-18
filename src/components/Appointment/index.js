import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import useVisualMode from "hooks/useVisualMode";
import Form from "components/Appointment/Form";
import Saving from "components/Appointment/Saving";
import Deleting from "components/Appointment/Deleting";
import Confirm from "components/Appointment/Confirm";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  //------- TRANSITION FUNCTIONS ----------//
  function onAdd() {
    transition(CREATE);
  }

  function onCancel() {
    back(EMPTY);
  }

  function onCancelOnEdit() {
    transition(SHOW);
  }

  function onDelete() {
    transition(CONFIRM);
  }

  function onEdit() {
    transition(EDIT);
  }

  //------- FUNCTION TO IMPLEMENT SAVE BUTTON ON FORM ----------//
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };
    transition(SAVING);
    props.bookInterview(props.id, interview).then(() => transition(SHOW));
  }

  //------- FUNCTION TO IMPLEMENT DELETE BUTTON ON SHOW ----------//
  function onConfirm(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };
    transition(DELETING);
    props.deleteInterview(props.id, interview).then(() => transition(EMPTY));
  }

  //------- RENDER APPOINTMENT VIEW ----------//
  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={onDelete}
          onEdit={onEdit} // same as () => transition(EDIT)
        />
      )}
      {mode === EMPTY && <Empty onAdd={onAdd} />}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={onCancel}
          onSave={save}
        />
      )}
      {mode === EDIT && (
        <Form
          interviewers={props.interviewers}
          onCancel={onCancel}
          onSave={save}
          name={props.interview.student}
          interviewer={props.interview.interviewer.name}
        />
      )}
      {mode === SAVING && <Saving message="Saving" />}
      {mode === DELETING && <Deleting message="Deleting" />}
      {mode === CONFIRM && (
        <Confirm
          onCancel={onCancelOnEdit}
          onConfirm={onConfirm}
          message="Are you sure you would like to delete?"
        />
      )}
    </article>
  );
}
