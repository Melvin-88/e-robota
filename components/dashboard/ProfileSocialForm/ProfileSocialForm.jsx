import React, { Component } from 'react';
import TextInput from '../../forms/TextInput';
import Button from '../../forms/Button';
import FormFooter from '../../forms/FormFooter';

import s from './ProfileSocialForm.css';

export default class ProfileAddressForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      fetching: false,
      user: {}
    }
  }

  componentWillMount(){
    this.props.handleFormInit(gettext('Соцiальнi мережi')); //pass form title to parent component
  }

  componentDidMount() {
    this.inputElementFocus && this.inputElementFocus.focus();
  }

  render() {
    const { user } = this.state;
    return (
      <div>
        <TextInput
          label={gettext("Facebook")}
          value={typeof user.facebook === 'undefined' ? this.props.user.facebook : user.facebook}
          handleChange={(e) => {this.setState({user: {...user, facebook: e.target.value} })}}
          inputRef={el => this.inputElementFocus = el}
        />
        <TextInput
          label={gettext("VK")}
          value={typeof user.vk === 'undefined' ? this.props.user.vk : user.vk}
          handleChange={(e) => {this.setState({user: {...user, vk: e.target.value} })}}
        />
        <TextInput
          label={gettext("LinkedIn")}
          value={typeof user.linkedin === 'undefined' ? this.props.user.linkedin : user.linkedin}
          handleChange={(e) => {this.setState({user: {...user, linkedin: e.target.value} })}}
        />
        <TextInput
          label={gettext("Однокласники")}
          value={typeof user.ok === 'undefined' ? this.props.user.ok : user.ok}
          handleChange={(e) => {this.setState({user: {...user, ok: e.target.value} })}}
        />
        <TextInput
          label={gettext("Twitter")}
          value={typeof user.twitter === 'undefined' ? this.props.user.twitter : user.twitter}
          handleChange={(e) => {this.setState({user: {...user, twitter: e.target.value} })}}
        />
        <TextInput
          label={gettext("Google Plus")}
          value={typeof user.google_plus === 'undefined' ? this.props.user.google_plus : user.google_plus}
          handleChange={(e) => {this.setState({user: {...user, google_plus: e.target.value} })}}
        />
        <TextInput
          label={gettext("Instagram")}
          value={typeof user.instagram === 'undefined' ? this.props.user.instagram : user.instagram}
          handleChange={(e) => {this.setState({user: {...user, instagram: e.target.value} })}}
        />
          <FormFooter
            handleSubmit={() => {this.props.handleSubmit('social', user) }}
            handleCancel={() => {}}
            fetching={this.props.fetching}
          />
      </div>
    );
  }
}
