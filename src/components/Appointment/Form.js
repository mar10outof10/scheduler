import React, { useState } from "react";
import Button from "../Button";
import InterviewerList from "../InterviewerList";

export default function Form(props) {

  const [name, setName] = useState(props.name || "");
  const [error, setError] = useState("");

  const [interviewer, setInterviewer] = useState(props.value || null);
  // resets form state if submission is cancelled
  const reset = () => {
    setName("");
    setInterviewer(null);
  };
  const cancel = () => {
    // function called when cancel button is clicked. Resets form, onCancel() causes mode to go back in history
    reset();
    props.onCancel();
  };
  // function validates form entry to make sure it's not empty
  const validate = () => {
    if (name === "") {
      setError("Student name cannot be blank");
      return;
    }
    
    setError("");
    // if form is being edited passes true to onSave to avoid spot counter decrementing
    props.edit ? props.onSave(name, interviewer, true) : props.onSave(name, interviewer, false);
  };

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form 
          autoComplete="off"
          onSubmit={event => event.preventDefault()}
        >
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            data-testid="student-name-input"
            />
            <section className="appointment__validation">{error}</section>
        </form>
        <InterviewerList interviewers={props.interviewers} value={interviewer} onChange={setInterviewer} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button 
          onClick={() => cancel()}
          danger
          >Cancel</Button>
          <Button 
          onClick={() => validate()}
          confirm>Save</Button>
        </section>
      </section>
    </main>
  )
}