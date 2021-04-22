import React from "react";
import InterviewerListItem from "./InterviewerListItem";
import "./InterviewerList.scss"
import PropTypes from 'prop-types';

function InterviewerList(props) {
  // maps the interviewers list given in the props to give a list of InterviewerListItem 's
  const interviewers = props.interviewers.map((interviewer) => {
    return (
      <InterviewerListItem 
      key={interviewer.id}
      name={interviewer.name}
      avatar={interviewer.avatar}
      selected={props.value === interviewer.id}
      setInterviewer={() => props.onChange(interviewer.id)}
      />
    )
  })
  // returns a section with a list of interview icons beneath the the header
  return (

      <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewers}</ul>
      </section>
  )

}
// validates props
InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired
};

export default InterviewerList;