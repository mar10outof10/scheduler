import React, { Fragment } from "react";
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "../../hooks/useVisualMode";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETING = "DELETING";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";
  
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = (name, interviewer, edit) => {
    if (!name || !interviewer) {
      return
    }
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);

    props.bookInterview(props.id, interview, edit)
    .then(() => transition(SHOW))
    .catch(() => transition(ERROR_SAVE, true))
  };

  const onConfirm = () => {
    transition(DELETING, true)
    props.cancelInterview(props.id)
    .then(() => transition(EMPTY))
    .catch(() => transition(ERROR_DELETE, true));
  };

  const onDelete = () => {
    transition(CONFIRM);
  };

  const onEdit = () => {
    transition(EDIT);
  };

  return (
    <Fragment>
    <Header time={props.time} />
    <article data-testid="appointment" className="appointment">
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete = {onDelete}
          onEdit = {onEdit}
        />
      )}
      {mode === CREATE && <Form 
        interviewers={props.interviewers} 
        onCancel={() => back()}
        onSave={save}
        />}
      {mode === EDIT && <Form 
        value={props.interview.interviewer.id}
        name={props.interview.student}
        interviewers={props.interviewers} 
        onCancel={() => back()}
        onSave={save}
        edit={true}
        />}
      {mode === CONFIRM && <Confirm message='Are you sure you would like to delete?' onConfirm={onConfirm} onCancel={() => back()} />}
      {mode === SAVING && <Status message='Saving...' />}
      {mode === DELETING && <Status message='Deleting...' />}
      {mode === ERROR_SAVE && <Error message='Error saving appointment' onClose={() => back()} />}
      {mode === ERROR_DELETE && <Error message='Error deleting appointment' onClose={()=> back()} />}
    </article>
    </Fragment>
  )
};