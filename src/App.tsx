import { observer } from "mobx-react";
import { registerRootStore } from "mobx-keystone";
import SettingsView from "./views/SettingsView";
import CalendarView from "./views/CalendarView";

import "./css/App.css";
import { Life } from "./model/Life";

const rootModel = new Life({});
registerRootStore(rootModel);

const App = observer(() => {
  const life: Life = rootModel;
  const today: Date = new Date();

  const handleLifeExpectancyChnge = (lifeExpectancy: number) =>
    life.setLifeExpectancy(lifeExpectancy);
  const handleLifeWeekNumberChange = (lifeWeekNumber: number) =>
    life.setCurrentSelectedLifeWeekNumber(lifeWeekNumber);
  const handleBirthdayChange = (birthday: Date) =>
    life.setBirthdayAndUpdateSelectedWeek(birthday);
  const handleSetToToday = () => life.selectLifeWeekOfToday();
  const handleCalendarWeekNumberChange = (calendarWeekNumber: number) =>
    life.selectLifeWeekByCalenderWeekNumber(calendarWeekNumber);

  return (
    <div className="app">
      <div></div>
      <h1>
        <span className="year-row-number" />
        Memento mori
      </h1>
      <SettingsView
        lifeExpectancy={life.lifeExpectancy}
        birthday={life.birthday}
        currentLifeWeek={life.currentSelectedLifeWeek}
        currentCalendarWeekNumber={life.currentCalendarWeekNumber}
        handleLifeExpectancyChnge={handleLifeExpectancyChnge}
        handleLifeWeekNumberChange={handleLifeWeekNumberChange}
        handleBirthdayChange={handleBirthdayChange}
        handleSetToToday={handleSetToToday}
        handleCalendarWeekNumberChange={handleCalendarWeekNumberChange}
      />
      <CalendarView
        today={today}
        life={life}
        currentLifeWeek={life.currentSelectedLifeWeek}
        lifeExpectancy={life.lifeExpectancy}
        handleLifeWeekNrChange={handleLifeWeekNumberChange}
      />
    </div>
  );
});

export default App;
