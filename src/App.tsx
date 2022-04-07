import React from "react";
import Settings from "./components/Settings";
import Calendar from "./components/Calendar";
import WeekRangeDisplay from "./ui-components/WeekRangeDisplay";
import "./css/App.css";
import {
  normalizeDate,
  computeCalendarWeek,
  LifeWeek,
  Life,
} from "./model/Life";

type AppProps = {
  initialBirthday: Date;
  initialLifeExpectancy: number;
};

type AppState = {
  birthday: Date;
  lifeExpectancy: number;
  life: Life;
  currentSelectedLifeWeek: LifeWeek;
  currentCalendarWeekNumber: number;
  today: Date;
};

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    const today = normalizeDate(new Date());

    const birthday = props.initialBirthday;
    const life = new Life(birthday);
    const currentSelectedLifeWeek: LifeWeek = life.getLifeWeekByDate(today);
    const currentCalendarWeekNumber: number = computeCalendarWeek(
      currentSelectedLifeWeek.monday
    );

    this.state = {
      birthday: birthday,
      lifeExpectancy: props.initialLifeExpectancy,
      life: life,
      currentSelectedLifeWeek: currentSelectedLifeWeek,
      currentCalendarWeekNumber: currentCalendarWeekNumber,
      today: today,
    };
  }

  handleSetToToday = () => {
    this.setState((state: AppState, props: AppProps) => {
      const today = normalizeDate(new Date());
      const currentSelectedLifeWeek: LifeWeek =
        state.life.getLifeWeekByDate(today);
      const currentCalendarWeekNumber: number = computeCalendarWeek(
        currentSelectedLifeWeek.monday
      );
      return { currentSelectedLifeWeek, currentCalendarWeekNumber };
    });
  };

  handleBirthdayChange = (birthday: Date) => {
    this.setState((state: AppState, props: AppProps) => {
      const today = normalizeDate(new Date());
      const life: Life = new Life(birthday);
      const currentSelectedLifeWeek: LifeWeek = life.getLifeWeekByDate(today);
      const currentCalendarWeekNumber: number = computeCalendarWeek(
        currentSelectedLifeWeek.monday
      );
      return {
        birthday,
        life,
        currentSelectedLifeWeek,
        today,
        currentCalendarWeekNumber,
      };
    });
  };

  handleLifeExpectancyChange = (lifeExpectancy: number) => {
    this.setState({ lifeExpectancy });
  };

  handleLifeWeekNrChange = (newLifeWeekNumber: number) => {
    this.setState((state: AppState, props: AppProps) => {
      const currentSelectedLifeWeek =
        state.life.getLifeWeekByNr(newLifeWeekNumber);
      const currentCalendarWeekNumber: number = computeCalendarWeek(
        currentSelectedLifeWeek.monday
      );
      return { currentSelectedLifeWeek, currentCalendarWeekNumber };
    });
  };

  handleCalendarWeekNrChange = (newCalenderWeekNumber: number) => {
    this.setState((prevState: AppState, props: AppProps) => {
      const newLifeWeekNumber =
        prevState.currentSelectedLifeWeek.number -
        (prevState.currentCalendarWeekNumber - newCalenderWeekNumber);
      const currentSelectedLifeWeek =
        prevState.life.getLifeWeekByNr(newLifeWeekNumber);
      return {
        currentCalendarWeekNumber: newCalenderWeekNumber,
        currentSelectedLifeWeek,
      };
    });
  };

  render(): React.ReactNode {
    return (
      <div className="app">
        <div></div>
        <h1>
          <span className="year-row-number" />
          Memento mori
        </h1>
        <Settings
          lifeExpectancy={this.state.lifeExpectancy}
          birthday={this.state.birthday}
          currentLifeWeek={this.state.currentSelectedLifeWeek}
          currentCalendarWeekNumber={this.state.currentCalendarWeekNumber}
          handleLifeExpecancyChnge={this.handleLifeExpectancyChange}
          handleLifeWeekNumberChange={this.handleLifeWeekNrChange}
          handleBirthdayChange={this.handleBirthdayChange}
          handleSetToToday={this.handleSetToToday}
          handleCalendarWeekNrChange={this.handleCalendarWeekNrChange}
        />
        <Calendar
          today={this.state.today}
          life={this.state.life}
          currentLifeWeek={this.state.currentSelectedLifeWeek}
          lifeExpectancy={this.state.lifeExpectancy}
          handleLifeWeekNrChange={this.handleLifeWeekNrChange}
        />
      </div>
    );
  }
}

export default App;
