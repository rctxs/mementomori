import { observer } from "mobx-react";
import { LifeWeek } from "../model/Life";
import DatePicker from "../components/DatePicker";
import NumberPicker from "../components/NumberPicker";
import WeekRangeDisplay from "../components/WeekRangeDisplay";

interface SettingsProps {
  birthday: Date;
  lifeExpectancy: number;
  currentLifeWeek: LifeWeek;
  currentCalendarWeekNumber: number;
  handleLifeExpectancyChnge(number: number): void;
  handleLifeWeekNumberChange(number: number): void;
  handleBirthdayChange(birthday: Date): void;
  handleSetToToday(): void;
  handleCalendarWeekNumberChange(number: number): void;
}

const SettingsView = observer((props: SettingsProps) => {
  return (
    <div className="settings-section">
      <form
        id="demographicSettings"
        className="settings-subsection settings-flex"
      >
        <DatePicker
          label="Your birthday"
          date={props.birthday}
          onDateValueChange={props.handleBirthdayChange}
        />
        <NumberPicker
          label="Life expectancy"
          number={props.lifeExpectancy}
          onNumberValueChange={props.handleLifeExpectancyChnge}
          numberRange={{ start: 1, end: 100 }}
        />
      </form>
      <form id="weekSettings" className="settings-subsection">
        <WeekRangeDisplay
          label="Days of current week of life"
          monday={props.currentLifeWeek.monday}
          sunday={props.currentLifeWeek.sunday}
        />
        <div className="settings-subsubsection settings-flex">
          <NumberPicker
            label="Week of life"
            prefix="N°"
            number={props.currentLifeWeek.number}
            numberRange={{ start: 0, end: 5216 }}
            onNumberValueChange={props.handleLifeWeekNumberChange}
          />
          <NumberPicker
            label="Calendar week"
            prefix="N°"
            number={props.currentCalendarWeekNumber}
            numberRange={{ start: 1, end: 52 }}
            onNumberValueChange={props.handleCalendarWeekNumberChange}
          />
          <div
            style={{
              alignSelf: "flex-end",
              paddingRight: "2px",
              paddingBottom: "2px",
            }}
          >
            <input
              type="button"
              value="Set to today"
              onClick={props.handleSetToToday}
            />
          </div>
        </div>
      </form>
    </div>
  );
});

export default SettingsView;
