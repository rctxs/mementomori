export function normalizeDate(date: Date): Date {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setSeconds(0);
    return date;
}

/* Source: https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
 *
 * For a given date, get the ISO week number
 *
 * Based on information at:
 *
 *    http://www.merlyn.demon.co.uk/weekcalc.htm#WNR
 *
 * Algorithm is to find nearest thursday, it's year
 * is the year of the week number. Then get weeks
 * between that date and the first day of that year.
 *
 * Note that dates in one year can be weeks of previous
 * or next year, overlap is up to 3 days.
 *
 * e.g. 2014/12/29 is Monday in week  1 of 2015
 *      2012/1/1   is Sunday in week 52 of 2011
 */export function computeCalendarWeek(d: Date): number {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    let yearStart: Date= new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    let weekNo: number = Math.ceil(( ( (d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
    // Return array of year and week number
    return weekNo;
}

export class LifeWeek {
    // index starts at 0
    readonly number: number;
    readonly monday: Date;
    readonly sunday: Date;
    readonly nextMonday: Date;

    constructor(number: number, date: Date) {
        date = normalizeDate(date)
        this.number = number;
        this.monday = this.getMondayForDate(date);
        this.sunday = new Date(this.monday);
        this.sunday.setDate(this.sunday.getDate() + 6)
        this.nextMonday = new Date(this.monday);
        this.nextMonday.setDate(this.nextMonday.getDate() + 7);
    }

    private getMondayForDate(date: Date) {
        // number for weekdays in Date: Sunday - Saturday : 0 - 6
        // shift monday to 0
        let offset = (date.getDay() + (7 - 1)) % 7
        let monday = new Date(date);
        monday.setDate(monday.getDate() - offset)
        return monday;
    }

    isDateWithin(date: Date): boolean {
        return this.monday <= date && date < this.nextMonday;
    }

    getNextWeek(): LifeWeek {
        return new LifeWeek(this.number + 1, this.nextMonday)
    }
}

export class LifeYear {
    // index starts at 0
    readonly number: number;
    readonly weeks: LifeWeek[];

    constructor(birthday: Date, yearNumber: number, firstWeekNumber: number) {
        this.number = yearNumber;
        let thisYearsBirthday: Date = new Date(birthday);
        let nextYearsBirthday: Date = new Date(birthday);
        thisYearsBirthday.setFullYear(thisYearsBirthday.getFullYear() + yearNumber)
        nextYearsBirthday.setFullYear(nextYearsBirthday.getFullYear() + yearNumber + 1)
        this.weeks = []

        let nextWeek: LifeWeek = new LifeWeek(firstWeekNumber, thisYearsBirthday)
        let lastWeek: LifeWeek = nextWeek
        this.weeks.push(nextWeek)

        let yearFinished = false;
        while (!yearFinished) {
            nextWeek = lastWeek.getNextWeek()
            if (nextWeek.isDateWithin(nextYearsBirthday)) {
                yearFinished = true;
            } else {
                this.weeks.push(nextWeek)
                lastWeek = nextWeek
            }
        }

    }

    getFirstLifeWeekNr(): number {
        return this.weeks.slice(0)[0].number
    }

    getLastLifeWeekNr(): number {
        return this.weeks.slice(-1)[0].number
    }

    isDateWithin(date: Date): boolean {
        return this.weeks.slice(0)[0].monday <= date && date < this.weeks.slice(-1)[0].nextMonday;
    }

    isWeekNrWithin(weekNumber: number): boolean {
        return this.getFirstLifeWeekNr() <= weekNumber && weekNumber <= this.getLastLifeWeekNr() 
    }
}

export class Life {

    readonly birthday: Date;
    readonly lifeYears: LifeYear[];

    constructor(birthday: Date) {
        this.birthday = normalizeDate(birthday)
        let firstWeekNr = 0
        this.lifeYears = []

        let lifeYear: LifeYear
        for (let yearNr = 0; yearNr < 100; yearNr++) {
            lifeYear = new LifeYear(this.birthday, yearNr, firstWeekNr)
            this.lifeYears.push(lifeYear)
            firstWeekNr = lifeYear.getLastLifeWeekNr() + 1
        }
    }

    getLifeWeekByDate(date: Date): LifeWeek {
        let filteredLifeYears = this.lifeYears.filter(lifeYear => lifeYear.isDateWithin(date))
        if (filteredLifeYears.length === 1) {
            let filteredLifeWeeks = filteredLifeYears[0].weeks.filter(week => week.isDateWithin(date))
            if (filteredLifeWeeks.length === 1) {
                return filteredLifeWeeks[0]
            } else {
                // Fallback
                return filteredLifeYears[0].weeks[0]
            }
        } else {
            // Fallback
            return this.lifeYears[0].weeks[0]
        }
    }

    getLifeWeekByNr(number: number): LifeWeek {
        let filteredLifeYears = this.lifeYears.filter(lifeYear => lifeYear.isWeekNrWithin(number))
        if (filteredLifeYears.length === 1) {
            let filteredLifeWeeks = filteredLifeYears[0].weeks.filter(week => week.number === number)
            if (filteredLifeWeeks.length === 1) {
                return filteredLifeWeeks[0]
            } else {
                // Fallback
                return filteredLifeYears[0].weeks[0]
            }
        } else {
            // Fallback
            return this.lifeYears[0].weeks[0]
        }
    }
}


