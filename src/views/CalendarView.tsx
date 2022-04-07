import { observer } from "mobx-react";
import { Life, LifeYear, LifeWeek } from "../model/Life";
import WeekCircle from "../components/WeekCircle";

interface CalendarProps {
  today: Date;
  life: Life;
  lifeExpectancy: number;
  currentLifeWeek: LifeWeek;
  handleLifeWeekNrChange(number: number): void;
}

const CalendarView = observer((props: CalendarProps) => {
  return (
    <div>
      <div>
        <span className="year-row-number" />
        <i>Weeks of your life</i>
      </div>
      <div className="calendar-part">
        <div>
          {props.life.lifeYears
            .filter((lifeYear) => lifeYear.yearNumber < 50)
            .map((lifeYear) => {
              let isWithinLifeExpectancy =
                lifeYear.yearNumber < props.lifeExpectancy;
              return (
                <CalendarYearView
                  today={props.today}
                  lifeYear={lifeYear}
                  isWithinLifeExpectancy={isWithinLifeExpectancy}
                  currentLifeWeek={props.currentLifeWeek}
                  handleLifeWeekNrChange={props.handleLifeWeekNrChange}
                />
              );
            })}
        </div>
        <div>
          {props.life.lifeYears
            .filter((lifeYear) => lifeYear.yearNumber >= 50)
            .map((lifeYear) => {
              let isWithinLifeExpectancy =
                lifeYear.yearNumber < props.lifeExpectancy;
              return (
                <CalendarYearView
                  today={props.today}
                  lifeYear={lifeYear}
                  isWithinLifeExpectancy={isWithinLifeExpectancy}
                  currentLifeWeek={props.currentLifeWeek}
                  handleLifeWeekNrChange={props.handleLifeWeekNrChange}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
});

interface CalendarYearProps {
  today: Date;
  lifeYear: LifeYear;
  isWithinLifeExpectancy: boolean;
  currentLifeWeek: LifeWeek;
  handleLifeWeekNrChange(number: number): void;
}

const CalendarYearView = observer((props: CalendarYearProps) => {
  return (
    <div key={"life-year-".concat(props.lifeYear.yearNumber.toString())}>
      <span className="year-row-number">{props.lifeYear.yearNumber + 1}</span>
      <div className="year-row-weeks">
        {props.lifeYear.lifeWeeks.map((lifeWeek) => {
          let weekNumber = lifeWeek.number;
          let isTodayWithinWeek = lifeWeek.isDateWithin(props.today);
          let isWithinPassedWeeks = weekNumber <= props.currentLifeWeek.number;
          return (
            <WeekCircle
              weekNumber={weekNumber}
              isTodayWithinWeek={isTodayWithinWeek}
              isWithinPassedWeeks={isWithinPassedWeeks}
              isWithinLifeExpectancy={props.isWithinLifeExpectancy}
              handleLifeWeekNrChange={props.handleLifeWeekNrChange}
            />
          );
        })}
      </div>
    </div>
  );
});

export default CalendarView;
