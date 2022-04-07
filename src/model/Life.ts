import { computed } from "mobx";
import { model, Model, modelAction, prop } from "mobx-keystone";

export function normalizeDate(date: Date): Date {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setSeconds(0);
  return date;
}

export function computeCalendarWeek(d: Date): number {
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
   */

  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  let yearStart: Date = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  let weekNo: number = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
  // Return array of year and week number
  return weekNo;
}

const LifeWeekSchema = {
  number: prop<number>(),
  dayInWeekTimeStamp: prop<number>(),
};

@model("mementomori/lifeweek")
export class LifeWeek extends Model(LifeWeekSchema) {
  @computed
  get monday(): Date {
    let date = normalizeDate(new Date(this.dayInWeekTimeStamp));
    return this.getMondayForDate(date);
  }

  @computed
  get sunday(): Date {
    let sunday = new Date(this.monday);
    sunday.setDate(sunday.getDate() + 6);
    return sunday;
  }

  @computed
  get nextMonday(): Date {
    let nextMonday = new Date(this.monday);
    nextMonday.setDate(nextMonday.getDate() + 7);
    return nextMonday;
  }

  getMondayForDate(date: Date) {
    // number for weekdays in Date: Sunday - Saturday : 0 - 6
    // shift monday to 0
    let offset = (date.getDay() + (7 - 1)) % 7;
    let monday = new Date(date);
    monday.setDate(monday.getDate() - offset);
    return monday;
  }

  isDateWithin(date: Date): boolean {
    return this.monday <= date && date < this.nextMonday;
  }

  getNextWeek(): LifeWeek {
    return new LifeWeek({
      number: this.number + 1,
      dayInWeekTimeStamp: this.nextMonday.getTime(),
    });
  }
}

const LifeYearSchema = {
  // index starts at 0
  birthdayTimeStamp: prop<number>(),
  yearNumber: prop<number>(),
  firstWeekNumber: prop<number>(),
};

@model("mementomori/lifeyear")
export class LifeYear extends Model(LifeYearSchema) {
  @computed
  get lifeWeeks(): LifeWeek[] {
    let thisYearsBirthday: Date = new Date(this.birthdayTimeStamp);
    let nextYearsBirthday: Date = new Date(this.birthdayTimeStamp);
    thisYearsBirthday.setFullYear(
      thisYearsBirthday.getFullYear() + this.yearNumber
    );
    nextYearsBirthday.setFullYear(
      nextYearsBirthday.getFullYear() + this.yearNumber + 1
    );
    let weeks = [];

    let nextWeek: LifeWeek = new LifeWeek({
      number: this.firstWeekNumber,
      dayInWeekTimeStamp: thisYearsBirthday.getTime(),
    });
    let lastWeek: LifeWeek = nextWeek;
    weeks.push(nextWeek);

    let yearFinished = false;
    while (!yearFinished) {
      nextWeek = lastWeek.getNextWeek();
      if (nextWeek.isDateWithin(nextYearsBirthday)) {
        yearFinished = true;
      } else {
        weeks.push(nextWeek);
        lastWeek = nextWeek;
      }
    }
    return weeks;
  }

  @computed
  get firstLifeWeekNr(): number {
    return this.lifeWeeks.slice(0)[0].number;
  }

  @computed
  get lastLifeWeekNr(): number {
    return this.lifeWeeks.slice(-1)[0].number;
  }

  isDateWithin(date: Date): boolean {
    return (
      this.lifeWeeks.slice(0)[0].monday <= date &&
      date < this.lifeWeeks.slice(-1)[0].nextMonday
    );
  }

  isWeekNrWithin(weekNumber: number): boolean {
    return (
      this.firstLifeWeekNr <= weekNumber && weekNumber <= this.lastLifeWeekNr
    );
  }
}

const LifeSchema = {
  birthdayTimeStamp: prop<number>(() => new Date("2000-01-01").getTime()),
  lifeExpectancy: prop<number>(80).withSetter(),
  currentSelectedLifeWeekNumber: prop<number>(0).withSetter(),
};

@model("mementomori/life")
export class Life extends Model(LifeSchema) {
  onInit() {
    this.selectLifeWeekOfToday();
  }

  @computed
  get lifeYears() {
    let firstWeekNr = 0;
    let lifeYears = [];

    let lifeYear: LifeYear;
    for (let yearNr = 0; yearNr < 100; yearNr++) {
      lifeYear = new LifeYear({
        birthdayTimeStamp: this.birthdayTimeStamp,
        yearNumber: yearNr,
        firstWeekNumber: firstWeekNr,
      });
      lifeYears.push(lifeYear);
      firstWeekNr = lifeYear.lastLifeWeekNr + 1;
    }
    return lifeYears;
  }

  @computed
  get currentSelectedLifeWeek(): LifeWeek {
    return this.getLifeWeekByNr(this.currentSelectedLifeWeekNumber);
  }

  @modelAction
  public selectLifeWeekByDate(date: Date) {
    date = normalizeDate(date);
    let currentSelectedLifeWeek = this.getLifeWeekByDate(date);
    this.currentSelectedLifeWeekNumber = currentSelectedLifeWeek.number;
  }

  @modelAction
  public selectLifeWeekOfToday() {
    let today = normalizeDate(new Date());
    this.selectLifeWeekByDate(today);
  }

  @computed
  get currentCalendarWeekNumber(): number {
    return computeCalendarWeek(this.currentSelectedLifeWeek.monday);
  }

  @modelAction
  public selectLifeWeekByCalenderWeekNumber(newCalenderWeekNumber: number) {
    const newLifeWeekNumber =
      this.currentSelectedLifeWeekNumber -
      (this.currentCalendarWeekNumber - newCalenderWeekNumber);
    this.setCurrentSelectedLifeWeekNumber(newLifeWeekNumber);
  }

  @modelAction
  public setBirthday(date: Date) {
    this.birthdayTimeStamp = date.getTime();
  }

  public setBirthdayAndUpdateSelectedWeek(date: Date) {
    this.setBirthday(date);
    this.selectLifeWeekOfToday();
  }

  @computed
  get birthday(): Date {
    return new Date(this.birthdayTimeStamp);
  }

  getLifeWeekByDate(date: Date): LifeWeek {
    let filteredLifeYears = this.lifeYears.filter((lifeYear) =>
      lifeYear.isDateWithin(date)
    );
    if (filteredLifeYears.length === 1) {
      let filteredLifeWeeks = filteredLifeYears[0].lifeWeeks.filter((week) =>
        week.isDateWithin(date)
      );
      if (filteredLifeWeeks.length === 1) {
        return filteredLifeWeeks[0];
      } else {
        // Fallback
        return filteredLifeYears[0].lifeWeeks[0];
      }
    } else {
      // Fallback
      return this.lifeYears[0].lifeWeeks[0];
    }
  }

  getLifeWeekByNr(number: number): LifeWeek {
    let filteredLifeYears = this.lifeYears.filter((lifeYear) =>
      lifeYear.isWeekNrWithin(number)
    );
    if (filteredLifeYears.length === 1) {
      let filteredLifeWeeks = filteredLifeYears[0].lifeWeeks.filter(
        (week) => week.number === number
      );
      if (filteredLifeWeeks.length === 1) {
        return filteredLifeWeeks[0];
      } else {
        // Fallback
        return filteredLifeYears[0].lifeWeeks[0];
      }
    } else {
      // Fallback
      return this.lifeYears[0].lifeWeeks[0];
    }
  }
}
