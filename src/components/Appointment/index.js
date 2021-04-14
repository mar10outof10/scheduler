import React, { Fragment } from "react";
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";

export default function Appointment(props) {
  //time:string??
  return (
    <Fragment>
    <Header time={props.time} />
    <article className="appointment">{ props.interview ? <Show {...props.interview}/> : <Empty />}</article>
    </Fragment>
  )
};