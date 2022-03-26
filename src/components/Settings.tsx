import React, { ChangeEvent, MouseEventHandler } from 'react';
import { LifeWeek, computeCalendarWeek } from '../model/Life';
import DatePicker from '../ui-components/DatePicker';
import NumberPicker from '../ui-components/NumberPicker';
import WeekRangeDisplay from '../ui-components/WeekRangeDisplay';


interface SettingsProps {
  birthday: Date,
  lifeExpectancy: number,
  currentLifeWeek: LifeWeek
  currentCalendarWeekNumber: number,
  handleLifeExpecancyChnge(number: number): void,
  handleLifeWeekNumberChange(number: number): void,
  handleBirthdayChange(birthday: Date): void
  handleSetToToday(): void,
  handleCalendarWeekNrChange(number: number): void,
}

interface SettingsState {
}

class Settings extends React.Component<SettingsProps, SettingsState> {

  handleClickSetToToday = () => {
    this.props.handleSetToToday();
  }

  render(): React.ReactNode {
    return (
      <div className='settings-section'>
        <form id="demographicSettings" className="settings-subsection settings-flex">
          <DatePicker label="Your birthday"
            date={this.props.birthday}
            onDateValueChange={this.props.handleBirthdayChange} />
          <NumberPicker label="Life expectancy"
            number={this.props.lifeExpectancy} onNumberValueChange={this.props.handleLifeExpecancyChnge}
            numberRange={{ start: 1, end: 100 }} />
        </form>
        <form id="weekSettings" className="settings-subsection">
          <WeekRangeDisplay label="Days of current week of life"
            monday={this.props.currentLifeWeek.monday}
            sunday={this.props.currentLifeWeek.sunday} />
          <div className='settings-subsubsection settings-flex' > 
            <NumberPicker label="Week of life"
              prefix="N°"
              number={this.props.currentLifeWeek.number}
              numberRange={{ start: 0, end: 5216 }}
              onNumberValueChange={this.props.handleLifeWeekNumberChange} />
            <NumberPicker label="Calendar week"
              prefix="N°"
              number={this.props.currentCalendarWeekNumber}
              numberRange={{ start: 1, end: 52 }}
              onNumberValueChange={this.props.handleCalendarWeekNrChange} />  
          <div style={{alignSelf: "flex-end", paddingRight: "2px", paddingBottom: "2px"}}>
              <input type="button" value="Set to today" onClick={this.handleClickSetToToday} />
            </div>          
          </div>
          
        </form>
      </div>
    )
  }
}

export default Settings;
