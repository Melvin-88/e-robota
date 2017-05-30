import React from 'react';
import { Link } from 'react-router-dom';
import s from './Breadcrumbs.css';

export default function(props) {
  return (
    <ul className={s.breadcrumbs}>
      {
        props.items && props.items.map((item, i) => {
          return (
            <li key={'breadcrumb-' + i}>
              <Link to={ item.link }>
                { gettext(item.label) }
              </Link>
            </li>
          )
        })
      }
    </ul>
  )
}
