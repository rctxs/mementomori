interface WeekRangeDisplayProps {
  monday: Date;
  sunday: Date;
  label: String;
}
function WeekRangeDisplay(props: WeekRangeDisplayProps) {
  return (
    <div className="settings-component">
      <label>
        <i>{props.label}</i>
      </label>
      <span>
        {props.monday.toDateString()} - {props.sunday.toDateString()}{" "}
      </span>
    </div>
  );
}

export default WeekRangeDisplay;
