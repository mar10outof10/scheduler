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
  const ERROR = "ERROR";
  
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = (name, interviewer) => {
    if (!name || !interviewer) {
      return
    }
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);

    Promise.resolve(props.bookInterview(props.id, interview))
    .then(() => transition(SHOW, true)); 
  };

  const onConfirm = () => {
    transition(DELETING)
    Promise.resolve(props.cancelInterview(props.id))
    .then(() => transition(EMPTY, true));
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
    <article className="appointment">
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
        />}
      {mode === CONFIRM && <Confirm message='Are you sure you would like to delete?' onConfirm={onConfirm} onCancel={() => back()} />}
      {mode === SAVING && <Status message='Saving...' />}
      {mode === DELETING && <Status message='Deleting...' />}
      {mode === ERROR && <Error message='Error: Placeholder' />}
    </article>
    </Fragment>
  )
};