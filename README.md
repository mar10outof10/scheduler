# Interview Scheduler

## Setup

Install dependencies with `npm install`.

# Interview Scheduler

Interview Scheduler is a simple, single-page Interview Scheduling App. Tweeter is built primarily using React with HTML, CSS, and javascript along with axios to access a database and save the appointment data. Interview Scheduler features robust testing using Jest, Cypress, and Storybook 

## Screenshots
!["Interviews with day list"](https://github.com/mar10outof10/scheduler/blob/master/blob/main/docs/schedulerUI.png?raw=true)

!["Various appointment states to be rendered"](https://github.com/mar10outof10/scheduler/blob/master/blob/main/docs/schedulerAppts.png?raw=true)

## Getting Started

1. Fork this repository, then clone your fork of this repository.
2. Install dependencies using the `npm install` command.
3. Fork the [scheduler api](https://github.com/lighthouse-labs/scheduler-api) and run the database yourself following the readme instructions there to setup the database.
4. Start the web server using the `npm start` command. The app will be served at <http://localhost:8000/>. The database must also be started. It will run at <http://localhost:8001> and will be proxied to the scheduler app.
5. Go to <http://localhost:8000/> in your browser.

## Dependencies
- Axios
- React
- Babel
- testing-library, Jest, Cypress, Storybook

## Stretch/future additions

- Support for running on websocket
- Personalize CSS

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```

## Running Cypress Testing

- Note: for cypress to work the interview-scheduler AND the scheduler-api servers must be running off the test db.
```sh
npm run cypress
```
