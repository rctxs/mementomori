import React from 'react';
import { Life, LifeYear, LifeWeek } from '../model/Life'
import WeekCircle from '../ui-components/WeekCircle';


interface CalendarProps {
    today: Date,
    life: Life,
    lifeExpectancy: number,
    currentLifeWeek: LifeWeek
    handleLifeWeekNrChange(number: number): void
}

function Calendar(props: CalendarProps) {
    return (
        <div>
            <div><span className="year-row-number" /><i>Weeks of your life</i></div>
            <div className="calendar-part">
                <div >
                    {props.life.lifeYears.filter(lifeYear => lifeYear.number < 50).map(lifeYear => {
                        let isWithinLifeExpectancy = lifeYear.number < props.lifeExpectancy;
                        return (<CalendarYear
                            today={props.today}
                            lifeYear={lifeYear}
                            isWithinLifeExpectancy={isWithinLifeExpectancy}
                            currentLifeWeek={props.currentLifeWeek}
                            handleLifeWeekNrChange={props.handleLifeWeekNrChange}
                        />)
                    })}
                </div>
                <div>
                    {props.life.lifeYears.filter(lifeYear => lifeYear.number >= 50).map(lifeYear => {
                        let isWithinLifeExpectancy = lifeYear.number < props.lifeExpectancy;
                        return (<CalendarYear
                            today={props.today}
                            lifeYear={lifeYear}
                            isWithinLifeExpectancy={isWithinLifeExpectancy}
                            currentLifeWeek={props.currentLifeWeek}
                            handleLifeWeekNrChange={props.handleLifeWeekNrChange}
                        />)
                    })}
                </div>
            </div>

        </div>

    )
}

interface CalendarYearProps {
    today: Date;
    lifeYear: LifeYear;
    isWithinLifeExpectancy: boolean;
    currentLifeWeek: LifeWeek;
    handleLifeWeekNrChange(number: number): void;
}

function CalendarYear(props: CalendarYearProps) {
    return (
        <div key={"life-year-".concat(props.lifeYear.number.toString())}>
            <span className="year-row-number">{props.lifeYear.number + 1}</span>
            <div className="year-row-weeks">
                {props.lifeYear.weeks.map(lifeWeek => {
                    let weekNumber = lifeWeek.number;
                    let isTodayWithinWeek = lifeWeek.isDateWithin(props.today);
                    let isWithinPassedWeeks = weekNumber <= props.currentLifeWeek.number;
                    return (<WeekCircle weekNumber={weekNumber}
                        isTodayWithinWeek={isTodayWithinWeek}
                        isWithinPassedWeeks={isWithinPassedWeeks}
                        isWithinLifeExpectancy={props.isWithinLifeExpectancy}
                        handleLifeWeekNrChange={props.handleLifeWeekNrChange} />)
                })}
            </div>
        </div>
    );
}


export default Calendar;