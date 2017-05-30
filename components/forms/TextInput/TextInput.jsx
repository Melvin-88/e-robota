import React, { Component } from 'react';
import {
  emailValidation,
  onlyNumbersValidation,
  phoneNumberValidation,
  urlValidation
} from '../../../utils/validation';
import s from './TextInput.css';

export default class TextInput extends Component {
  constructor(props){
    super(props);
    this.state={
      focus: false,
    }
    this._handleBlur = this._handleBlur.bind(this);
  }

  _handleBlur(){
    this.setState({focus: false});
    if (!this.props.validation) return;
    let fieldErrors = [];
    let v;
    this.props.validation.map((validation) => {
      switch(validation){
        case 'email':
          v = emailValidation(this.props.value);
          if (v.status == 'Fail') {
            fieldErrors.push(v.message);
          }
          break;
        case 'onlyNumbers':
          v = onlyNumbersValidation(this.props.value);
          if (v.status == 'Fail') {
              fieldErrors.push(v.message);
          }
          break;
        case 'phoneNumber':
            v = phoneNumberValidation(this.props.value);
            if (v.status == 'Fail') {
                fieldErrors.push(v.message);
            }
            break;
        case 'url':
            v = urlValidation(this.props.value);
            if (v.status == 'Fail') {
                fieldErrors.push(v.message);
            }
            break;
        default:
            return null;
      }
    });
    this.props.handleFieldErrors({field: this.props.name, errors: fieldErrors});
  }

  _handleKeyPress(e) {
    if(!this.props.handleEnterPressed) return;
    if(e.charCode==13){
      this.props.handleEnterPressed(e);
    }
  }


  render(){
    const { focus } = this.state;
    let error = typeof this.props.errors != 'undefined' && this.props.errors.length > 0;
    return (
      <div className={s.textInputWrapper + ' ' + (this.props.className || '') + (error ? ' error' : '')}>
        <label className={'inputLabel ' + (focus ? 'inputLabel_focus' : 'inputLabel_default')}>
          {this.props.label}
        </label>
        <input
          id={this.props.id || null}
          type={this.props.type || "text"}
          className={s.textInput}
          onFocus={()=>{this.setState({focus: true})}}
          onBlur={this._handleBlur}
          placeholder={this.props.placeholder || ''}
          value={this.props.value || ''}
          onChange={this.props.handleChange}
          name={this.props.name || ""}
          onKeyPress={this._handleKeyPress.bind(this)}
          ref={this.props.inputRef}
        />
        {
          !this.state.fieldErrors && this.props.errors &&
            <ul className={s.errorList}>
              {
                this.props.errors.map((error, i) => {
                  return (
                      <li key={"error-" + i}>{error}</li>
                  )
                })
              }
            </ul>
        }
      </div>
    );
  }
}
