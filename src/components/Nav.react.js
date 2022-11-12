import React from 'react';
import logo from '../images/logo.png';

export const Nav = () => {
    return (
        <nav className="navbar">
        <div className="brand-header px-2">
            <img id="logo" src={logo} alt="logo"/>
            Spotification
        </div>
        </nav>
    );
}

