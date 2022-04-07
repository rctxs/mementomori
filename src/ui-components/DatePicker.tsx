import React, { ChangeEvent } from "react";

interface DatePickerPros {
  date: Date;
  label: String;
  onDateValueChange(date: Date): void;
}

interface DatePickerState {}

class DatePicker extends React.Component<DatePickerPros, DatePickerState> {
  dateToYYYMMDD = (date: Date) => {
    let offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - offset * 60 * 1000);
    return date.toISOString().split("T")[0];
  };

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    //e.preventDefault();
    let newDateValue = new Date(e.target.value);
    if (
      newDateValue >= new Date("1800-01-01") &&
      newDateValue <= new Date("2400-01-01")
    ) {
      this.props.onDateValueChange(newDateValue);
    }
  };

  render(): React.ReactNode {
    return (
      <div className="settings-component">
        <label>
          <i>{this.props.label}</i>
        </label>
        <input
          type="date"
          value={this.dateToYYYMMDD(this.props.date)}
          onChange={this.handleChange}
        ></input>
      </div>
    );
  }
}

export default DatePicker;
