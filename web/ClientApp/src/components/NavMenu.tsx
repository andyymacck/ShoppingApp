import React, { Component, useState, useEffect } from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import Libs from './Libs';
import { useAuth } from './auth-context';


export const NavMenu = () => {
    const { isLoggedIn, userRole } = useAuth();

    let activeItem = " ";

    return (
        <Menu stackable color='violet'>
            <Menu.Item>
                <img alt="logo" src='/logo.png' />
            </Menu.Item>

            {!isLoggedIn ? (
                <>
                    <Menu.Item
                        name='Login'
                        active={activeItem === 'Login'}
                        as={Link}
                        to="/login"
                    />
                    <Menu.Item
                        name='Registration'
                        active={activeItem === 'Registration'}
                        as={Link}
                        to="/register"
                    >
                        Register
                    </Menu.Item>
                </>
            ) : (
                    <>
                        {userRole === 'WebAdmin' && (
                            <Menu.Item
                                name='Manage'
                                active={activeItem === 'Manage'}
                                as={Link}
                                to="/manage"
                            >
                                Manage
                            </Menu.Item>
                        )}
                        <Menu.Item
                            name='Cart'
                            className='Cart'
                            active={activeItem === 'Cart'}
                            as={Link}
                            to="/cart"
                        >
                            Cart
                        </Menu.Item>

                        <Menu.Item
                            name='Logout'
                            className='Logout'
                            active={activeItem === 'Logout'}
                            as={Link}
                            to="/logout"
                        >
                            Logout
                        </Menu.Item>
                </>
            )}
            <Menu.Item
                name='Products'
                className='Products'
                active={activeItem === 'Products'}
                as={Link}
                to="/products"
            >
            Products
            </Menu.Item>

            <Menu.Item
                name='About'
                active={activeItem === 'About'}
                as={Link}
                to="/about"
            >
                About
            </Menu.Item>

            <Menu.Item
                name='Contact'
                active={activeItem === 'Contact'}
                as={Link}
                to="/contact"
            >
                Contact
            </Menu.Item>


        </Menu>


    );
}
