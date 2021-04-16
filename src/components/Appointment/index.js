import React, { Fragment } from "react";
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import useVisualMode from "../../hooks/useVisualMode";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETING = "DELETING";
  //time:string??
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING)

    Promise.resolve(props.bookInterview(props.id, interview))
    .then(() => console.log('ahhh'))
    .then(() => transition(SHOW, true)); 
  }

  const onConfirm = () => {
    Promise.resolve(props.cancelInterview(props.id))
    .then(() => transition(EMPTY, true))
  };

  const onDelete = () => {
    transition(CONFIRM);
  }

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
        />
      )}
      {mode === CREATE && <Form 
        interviewers={props.interviewers} 
        onCancel={() => back()}
        onSave={save}
        />}
      {mode === SAVING && <Status message='Saving...' />}
      {mode === DELETING && <Status message='Deleting...' />}
      {mode === CONFIRM && <Confirm message='Are you sure you would like to delete?' onConfirm={onConfirm} onCancel={() => back()} />}
    </article>
    </Fragment>
  )
};