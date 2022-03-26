import React, { ChangeEvent } from 'react';

interface NumberRange {
    start: number,
    end: number
}

interface NumberPickerPros {
    number: Number;
    label: String;
    prefix?: String;
    numberRange: NumberRange;
    onNumberValueChange(number: number): void;
}

interface NumberPickerState {
}

class NumberPicker extends React.Component<NumberPickerPros, NumberPickerState> {

    handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        //e.preventDefault();
        let newNumberValue = parseInt(e.target.value);
        this.props.onNumberValueChange(newNumberValue);
    }

    render(): React.ReactNode {
        return (
            <div className="settings-component">
                <label><i>{this.props.label}</i></label>
                <div className="settings-component-part">
                    {this.props.prefix && <span>{this.props.prefix} </span>}
                    <input style={{width: "100%"}} type="number" min={this.props.numberRange.start.toString()}
                        max={this.props.numberRange.end.toString()} value={this.props.number.toString()}
                        onChange={this.handleChange}></input>
                </div>
                <input type="range"
                    min={this.props.numberRange.start.toString()}
                    max={this.props.numberRange.end.toString()}
                    value={this.props.number.toString()}
                    onChange={this.handleChange}
                />
            </div>
        )
    }
}

export default NumberPicker;