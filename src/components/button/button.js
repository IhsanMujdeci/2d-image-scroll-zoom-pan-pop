import React from 'react'
import './button.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const Button = ({className, text, onClick, icon}) => (
    <button className={className} onClick={onClick}>
        {text && <p className='text'>{text}</p>}
        {icon && <FontAwesomeIcon icon={icon}/>}
    </button>
);