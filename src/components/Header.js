import React, { useState } from 'react'
import './Header_style.css'
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { MapStylePicker } from '../controls';


const { Header } = Layout;



const items = [
    {
        label: (
            <Link to="/cluster">
                Cluster
            </Link>
        ),
        key: 'cluster'
    },
    {
        label: (
            <Link to="/heatmap">
                Heatmap
            </Link>
        ),
        key: 'heatmap',
    },
    {
        label: (
            <Link to="/about">
                About
            </Link>
        ),
        key: 'about',
    },
];

const Nav = () => {
    const [current, setCurrent] = useState('heart');
    const onClick = (e) => {
        setCurrent(e.key);
    };

    return (
        <Layout>
            <Header>
                
                <Menu
                    theme="dark"
                    mode="horizontal"
                    onClick={onClick}
                    selectedKeys={[current]}
                    items={items}

                />

            </Header>

        </Layout>

    )
};

export default Nav;
