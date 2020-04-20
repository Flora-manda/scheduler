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
import ErrorSaving from "components/Appointment/Error Saving";
import ErrorDeleting from "components/Appointment/Error Deleting";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

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

  function onCancelOnEditAndError() {
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
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch((error) => transition(ERROR_SAVE, true));
  }

  //------- FUNCTION TO IMPLEMENT DELETE BUTTON ON SHOW ----------//
  function onConfirm(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };
    transition(DELETING, true);
    props
      .deleteInterview(props.id, interview)
      .then(() => transition(EMPTY))
      .catch((error) => transition(ERROR_DELETE, true));
  }

  //------- RENDER APPOINTMENT VIEW ----------//
  return (
    <article className="appointment" data-testid="appointment">
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
          interviewer={props.interview.interviewer.id}
        />
      )}
      {mode === SAVING && <Saving message="Saving" />}
      {mode === DELETING && <Deleting message="Deleting" />}
      {mode === CONFIRM && (
        <Confirm
          onCancel={onCancelOnEditAndError}
          onConfirm={onConfirm}
          message="Are you sure you would like to delete?"
        />
      )}
      {mode === ERROR_SAVE && (
        <ErrorSaving
          onClose={() => transition(EMPTY)}
          message="Could not save appointment"
        />
      )}
      {mode === ERROR_DELETE && (
        <ErrorDeleting
          onClose={onCancelOnEditAndError}
          message="Could not cancel appointment"
        />
      )}
    </article>
  );
}
