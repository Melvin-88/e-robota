import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    fetchMyCVs,
    createCV,
    copyCV
} from '../../../actions/cvActions';
import {
    dispatchServiceMessage
} from '../../../actions/serviceMessagesActions';

import { updateBreadcrumbs } from '../../../actions/commonActions';

import { Route } from 'react-router';
import SubNavigation from '../SubNavigation';
import SubNavigationItem from '../SubNavigationItem';
import SubNavigationLink from '../SubNavigationLink';
import Collapsible from 'react-collapsible';
import Button from '../../forms/Button';
import ResumeFillStats from '../ResumeFillStats';
import ResumeContent from '../ResumeContent';
import DashboardContent from '../DashboardContent';
import NoteList from '../NoteList';
import DashboardContentNotSelected from '../DashboardContentNotSelected';


import s from './Resume.css';


const DUMMY_TIPS = [
    {tip: 'Cupcake ipsum dolor. Sit amet liquorice cake marzipan.'},
    {tip: 'Cake sweet cake biscuit caramels apple pie dessert. Marshmallow jelly-o lollipop. Dessert chocolate cake marzipan powder tootsie roll powder liquorice.'}
];


class Resume extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cvs: [],
            drafts: [],
            activeCVList: 'cvs'
        };
        this.baseUrl = props.match.url[props.match.url.length - 1] == '/' ? props.match.url : props.match.url + '/';
    }

    componentWillMount(){
        //fetch my CVs
        this.props.fetchMyCVs()
            .then(response => {
                //TODO preloader
            })
            .catch(error => {
                console.log(error);
            })
        this.props.updateBreadcrumbs([
          {
            link: '/dashboard/my_сv/',
            label: 'Мої резюме'
          }
        ])
    }

    _createCV(){
        this.props.createCV()
            .then(response => {
                if(!response.error)
                    this.props.history.push(`${this.baseUrl}${response.payload.data.id}`);
            })
    }

    _copyCV(cvId){
        this.props.copyCV(cvId)
            .then(response => {
                if(!response.error)
                    this.props.history.push(`${this.baseUrl}${response.payload.data.id}`);
                    this.props.dispatchServiceMessage({
                        show: true,
                        error: false,
                        text: gettext('Копiю створено.'),
                    });
                    setTimeout(() => {
                        this.props.dispatchServiceMessage({show: false});
                    }, 3000);
            })
    }

    render(){
        const { activeCVList } = this.state;
        const cvs = this.props.myCVs.filter(cv => {return cv.is_active});
        const drafts = this.props.myCVs.filter(cv => {return !cv.is_active});
        return (
        <div className="dashboardContentWrapper">
            <div className="dashboardContentWrapper__row">
                <div className="dashboardSidePanel sidepanel">

                    {/*LEFT SIDEBAR*/}

                    <div className="btnsWrapper">
                        <Button
                            label="Нове резюме"
                            handleClick={this._createCV.bind(this)}
                        />
                    </div>
                    <SubNavigation>
                        <Collapsible
                            trigger={
                                <SubNavigationItem
                                    label='Активні резюме'
                                    path="#"
                                />
                            }
                            open={true}
                            transitionTime={200}
                        >
                            {
                                cvs.length > 0 && cvs.map((cv, i) => {
                                    return (
                                        <div key={'cv-link-' + i}>
                                            <SubNavigationLink
                                                label={cv.header}
                                                path={`${this.baseUrl}${cv.id}`}
                                            />
                                            <i
                                                className="icon-pencil"
                                                onClick={() => this._copyCV(cv.id)}
                                                title={gettext("Створити копiю")}
                                            />
                                        </div>
                                    );
                                })
                            }
                            {
                                cvs.length < 1 &&
                                <p className="sidePanel__listEmptyLabel">
                                    {gettext('Немає активних резюме')}
                                </p>
                            }
                        </Collapsible>
                        <Collapsible
                            trigger={
                                <SubNavigationItem
                                    label='Мої чернетки'
                                    path="#"
                                />
                            }
                            transitionTime={200}
                        >
                            {
                                drafts.length > 0 && drafts.map((cv, i) => {
                                    return (
                                        <div key={'draft-link-' + i}>
                                            <SubNavigationLink
                                                label={cv.header || gettext('Чернетка без назви')}
                                                path={`${this.baseUrl}${cv.id}`}
                                            />
                                            <i
                                              className="icon-pencil"
                                              onClick={() => this._copyCV(cv.id)}
                                              title={gettext("Створити копiю")}
                                            />
                                        </div>
                                    );
                                })
                            }
                            {
                                drafts.length < 1 &&
                                <p className="sidepanel__listEmptyLabel">
                                    {gettext('Немає чернеток')}
                                </p>
                            }
                        </Collapsible>
                    </SubNavigation>
                </div>


                {/*CENTRAL CONTENT*/}

                <div className={s.dashboardContentWrapper__dashboardContent}>
                    <DashboardContent
                      title=""
                      breadcrumbs={this.props.breadcrumbs}
                    >
                        <Route
                            exact
                            path={`${this.baseUrl}:cvId/`}
                            baseUrl={this.baseUrl}
                            component={ResumeContent}
                        />
                    </DashboardContent>
                </div>

                {/*RIGHT SIDEPANEL*/}

                <div className="dashboardSidePanel sidepanel sidepanel_right">
                    <SubNavigation>
                        <Collapsible
                            trigger={
                                <SubNavigationItem
                                    label='Рівень заповнення'
                                    path="#"
                                    active
                                />
                            }
                            open={true}
                            transitionTime={200}
                            className="somename"
                        >
                            <ResumeFillStats score={'30'} />
                        </Collapsible>
                        <Collapsible
                            trigger={
                                <SubNavigationItem
                                    label='Підказки'
                                    path="#"
                                />
                            }
                            transitionTime={200}
                        >
                            <NoteList
                                tips={DUMMY_TIPS}
                            />
                        </Collapsible>
                        <Collapsible
                            trigger={
                                <SubNavigationItem
                                    label='Статистика переглядів'
                                    path="#"
                                />
                            }
                            transitionTime={200}
                        >
                            <div className="cvStatsCounterWrapper">
                                <p><span className="cvStatsCounterWrapper__numbers">11</span> сьогодні</p>
                                <p><span className="cvStatsCounterWrapper__numbers">57</span> усього</p>
                            </div>
                        </Collapsible>
                    </SubNavigation>
                </div>
            </div>
        </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        myCVs: state.myCVs,
        cv: state.cv,
        breadcrumbs: state.breadcrumbs
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        dispatchServiceMessage,
        fetchMyCVs,
        createCV,
        copyCV,
        updateBreadcrumbs
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Resume);
