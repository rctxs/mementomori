import React from 'react';

interface WeekCircleProps {
    weekNumber: number,
    isWithinLifeExpectancy: boolean,
    isWithinPassedWeeks: boolean,
    isTodayWithinWeek: boolean,
    handleLifeWeekNrChange(number: number): void,
}

interface WeekCircleState {
}

class WeekCircle extends React.Component<WeekCircleProps, WeekCircleState> {

    handleClick = () => {
        this.props.handleLifeWeekNrChange(this.props.weekNumber);
    }

    getClassNames = () => {
        let classNames = "week-circle";
        if (this.props.isWithinPassedWeeks) {
            classNames = classNames.concat(" week-circle-passed");
        } else if (this.props.isWithinLifeExpectancy){
            classNames = classNames.concat(" week-circle-life-expectancy");
        }
        if (this.props.isTodayWithinWeek) {
            classNames = classNames.concat(" week-circle-today");
        }
        return classNames;
    }

    getKey = () => {
        return "life-week-".concat(this.props.weekNumber.toString())
    }

    render(): React.ReactNode {
        return (
            <div key={this.getKey()} className={this.getClassNames()} onClick={this.handleClick}>
            </div>
        )
    }
}

export default WeekCircle;