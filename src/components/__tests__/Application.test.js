import React from "react";

import { getByText, getAllByTestId, getByAltText, getByPlaceholderText, prettyDOM, render, cleanup, waitForElement, fireEvent, act, queryByText } from "@testing-library/react";

import Application from "components/Application";

import axios from "axios";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday"));
  });

  it("updates the names when a new day is clicked", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();

  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1 ", async () => {
    const { container } = render(<Application />);
    
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Student Name" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))
    fireEvent.click(getByText(appointment, "Save"))

    await waitForElement(() => getByText(appointment, "Saving..."));

    await waitForElement(() => getByText(appointment, "Student Name"))

    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
    
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Delete"));

    await waitForElement(() => getByText(appointment, "Are you sure you would like to delete?"))
    fireEvent.click(getByText(appointment, "Confirm"))

    await waitForElement(() => getByText(appointment, "Deleting..."));

    await waitForElement(() => getByAltText(appointment, "Add"))

    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Edit"));

    await waitForElement(() => getByPlaceholderText(appointment, "Enter Student Name"))

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Edited Pseudonym" }
    });
    fireEvent.click(getByText(appointment, "Save"));

    await waitForElement(() => getByText(appointment, "Saving..."));
    
    await waitForElement(() => getByText(appointment, "Edited Pseudonym"));

    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Edit"));

    await waitForElement(() => getByPlaceholderText(appointment, "Enter Student Name"))

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Edited Pseudonym" }
    });
    fireEvent.click(getByText(appointment, "Save"));

    await waitForElement(() => getByText(appointment, "Error saving appointment"));
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Delete"));

    await waitForElement(() => getByText(appointment, "Are you sure you would like to delete?"))
    fireEvent.click(getByText(appointment, "Confirm"))

    await waitForElement(() => getByText(appointment, "Error deleting appointment"));
  });
});