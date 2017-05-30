import React, { Component } from 'react';
import Headroom from 'react-headroom';
import Button from '../../forms/Button';
import HeaderUserBox from '../HeaderUserBox';
import HeaderNotificationBox from '../HeaderNotificationBox';

import s from './HeaderPanel.css';

const searchTypes = {
  CV: 'cv',
  VACANCY: 'vacancy'
};

export default class HeaderPanel extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchType: props.user && props.user.role == 'jobseeker' ? searchTypes.VACANCY : searchTypes.CV,
      searchQuery: '',
    }
  }

  render(){
    const { searchType } = this.state;
    const user = this.props.user || {};
    return (
      <Headroom disableInlineStyles={true}>
          <div className={s.headerPanel}>
            <div className={s.searchBox}>
              <div
                className={s.searchTypeBox}
                onClick={e => this.setState({
                  searchType: searchType == searchTypes.CV ? searchTypes.VACANCY : searchTypes.CV
                })}
              >
                <i className='icon-search'/>
                <p>
                  <a className={s.toggleLink}>
                    { searchType == searchTypes.VACANCY &&
                      gettext('Вакансії')
                    }
                    { searchType == searchTypes.CV &&
                      gettext('Резюме')
                    }
                    &nbsp;<i className='icon-angle-down' />
                  </a>
                </p>
              </div>
              <input
                type='text'
                className={s.searchInput}
                value={this.state.searchQuery}
                onChange={e => this.setState({searchQuery: e.target.value})}
                placeholder={ gettext('кухар, слюсар, сантехнiк') }
              />
            </div>
            <div className='searchBox_right'>
              <Button
                label={ gettext('Шукати') }
                className={'default_button ' + s.searchButton + ' ' + (!this.state.searchQuery && s.hidden)}
              />

            <div className={s.notificationBox}>
              <i
                className={'icon-paper-plane-empty ' + s.serviceIcon + ' ' + s.withBubble }
              />
              <HeaderNotificationBox />
            </div>

              <HeaderUserBox user={user} />
            </div>
          </div>
      </Headroom>
    )
  }
}

//
