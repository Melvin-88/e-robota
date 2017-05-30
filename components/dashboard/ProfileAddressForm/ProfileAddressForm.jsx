import React, { Component } from 'react';
import TextInput from '../../forms/TextInput';
import Button from '../../forms/Button';
import FormFooter from '../../forms/FormFooter';

import s from './ProfileAddressForm.css';

export default class ProfileAddressForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      fetching: false,
      user: {}
    };
    this._handleSubmit = this._handleSubmit.bind(this);
    this._selectSuggestView = this._selectSuggestView.bind(this);
    ymaps.load(this._onLoad.bind(this))
  }

  componentDidMount() {
    this.inputElementFocus && this.inputElementFocus.focus();
  }

  _onLoad() {
    this.suggestView = new window.ymaps.SuggestView('suggest-profile-address');
    this.suggestView.events.add('select', this._selectSuggestView);
  }

  _selectSuggestView (e) {
    const { user } = this.state;
    let displayName = e.get('item').displayName;
    this.setState({user: {...user, address: displayName}})
  }

  _handleSubmit(){
    const { user } = this.state;
    let data = {
      address: typeof user.address === 'undefined' ? this.props.user.address : user.address
    };
    this.props.handleSubmit('address', data);
  }

  componentWillMount(){
    this.props.handleFormInit(gettext('Адреса')); //pass form title to parent component
  }

  render() {
    const { user } = this.state;
    return (
      <div>
        <TextInput
          id="suggest-profile-address"
          label={gettext("Мiсце проживання")}
          value={typeof user.address === 'undefined' ? this.props.user.address : user.address}
          handleChange={(e) => {this.setState({user: {...user, address: e.target.value} })}}
          handleEnterPressed={(e) => {this.setState({user: {...user, address: e.target.value} })}}
          errors={this.props.errors.address}
          inputRef={el => this.inputElementFocus = el}
        />
        <FormFooter
          handleSubmit={this._handleSubmit}
          handleCancel={() => {}}
          fetching={this.props.fetching}
        />
      </div>
    );
  }
}
