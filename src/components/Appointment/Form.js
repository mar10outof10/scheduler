import { action } from "@storybook/addon-actions";
import React, { useState } from "react";
import Button from "../Button"
import InterviewerList from "../InterviewerList"

export default function Form(props) {
  //name:string, interviewers:array, value:number, onSave:function, onCancel:fucntion
  const [name, setName] = useState(props.name || "");

  const [interviewer, setInterviewer] = useState(props.value || null);

  const reset = () => {
    setName("");
    setInterviewer(null);
  }

  const cancel = () => {
    reset();
    props.onCancel()
  }

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
          />
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
          onClick={props.onSave}
          confirm>Save</Button>
        </section>
      </section>
    </main>
  )
}