import React from "react";
import classNames from "classnames"
import "./InterviewerListItem.scss"

export default function InterviewerListItem(props) {
  const listClass = classNames("interviewers__item", {
    // adds to class if this item is selected
    "interviewers__item--selected": props.selected
  });

  return (
    <li className={listClass}
        onClick={props.setInterviewer}>
        <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  )
}