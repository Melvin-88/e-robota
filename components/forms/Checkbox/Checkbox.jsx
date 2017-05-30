import React, { Component } from 'react';
import s from './Checkbox.css';

class Checkbox extends Component {
  state = {
    isChecked: false,
  };

  toggleCheckboxChange = () => {
    const { handleCheckboxChange, label, name } = this.props;

    this.setState(({ isChecked }) => (
      {
        isChecked: !isChecked,
      }
    ));

    handleCheckboxChange(name, label);
  };

  render() {
    const { label, name , info, id } = this.props;
    const { isChecked } = this.props.isChecked == undefined ? this.state: this.props;

    return (
      <div className="subNavigationLink subNavigationLink_flex">
          <input
            id={id}
            className={s.Checkbox__checkbox}
            name={name}
            type="checkbox"
            value={label}
            checked={isChecked}
            onChange={this.toggleCheckboxChange}
          />
        <label className={s.Checkbox__label} htmlFor={id}>
          {label}
        </label>
        <span>{info}</span>
      </div>
    );
  }
}

export default Checkbox;