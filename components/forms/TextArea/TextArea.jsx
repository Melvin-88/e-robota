import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';

import s from './TextArea.css';

export default class TextInput extends Component {
    constructor(props){
        super(props);
        this.state={
            focus: false,
        };
        this._handleBlur = this._handleBlur.bind(this);
    }

    _handleBlur(){
        this.setState({focus: false});
        // if (!this.props.validation) return;
        // let fieldErrors = [];
        // let v;
        // this.props.validation.map((validation) => {
        //     switch(validation){
        //         case 'email':
        //             v = emailValidation(this.props.value);
        //             if (v.status == 'Fail') {
        //                 fieldErrors.push(v.message);
        //                 break;
        //             }
        //         default:
        //             return null;
        //     }
        // });
        // this.props.handleFieldErrors({field: this.props.name, errors: fieldErrors});
    }

    _handleKeyPress(e) {
        if(!this.props.handleEnterPressed) return;
        if(e.charCode==13){
            this.props.handleEnterPressed(e);
        }
    }


    render(){
        const { focus } = this.state;
        return (
            <div className={s.textAreaWrapper + (this.props.errors ? ' error' : '')}>
                <label className={'inputLabel ' + (focus ? 'inputLabel_focus' : 'inputLabel_default')}>
                    {this.props.label}
                </label>
                <Textarea
                    id={this.props.id || null}
                    className={s.textArea}
                    onFocus={()=>{this.setState({focus: true})}}
                    onBlur={this._handleBlur}
                    placeholder={this.props.placeholder || ''}
                    onChange={this.props.handleChange}
                    name={this.props.name || ""}
                    value={this.props.value}
                    onKeyPress={this._handleKeyPress.bind(this)}
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
