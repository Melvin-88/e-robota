import React from 'react';
import Breadcrumbs from '../../common/Breadcrumbs';
import s from './DashboardContent.css';

export default function(props) {
    return (
        <div className={ s.singleBox }>
            <Breadcrumbs items={props.breadcrumbs} />
            <h2>{props.title}</h2>
            <div className={ s.singleBox__page}>
                { props.children }
            </div>
        </div>
    );
}
