import React, { Fragment } from 'react'
import { Row, Col, Typography } from 'antd';
import Configuration from './Configuration';
import Coverpage from '../coverpage/Coverpage';

function Home({ isMobile }) {

    return (
        <Fragment>
            {isMobile ? (
                <Coverpage isMobile={isMobile} />
            ) : (
                    <Fragment>
                        <Row>
                            <Col xs={10} className="introduction white hide-on-medium-and-down">
                                <div className="introduction-container ">
                                    <Row className="header">
                                        <Col xs={24}>
                                            <Typography.Title className="m-0">
                                                <span className="app-title">REACTor</span>
                                            </Typography.Title>
                                        </Col>
                                        <Col xs={24}>
                                            <h3>
                                                <span className="slate-text">Want to create React apps blazingly fast?</span>
                                            </h3>
                                        </Col>
                                        <Col xs={24}>
                                            <h3>Use this simple tool to define your application's environment variables and component structure, then run the generated script on your machine to create your applicaiton.</h3>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={24}>
                                            <div className="instructions-pane">
                                                <Typography.Title level={2}>
                                                    <span className="instructions-heading">Instructions</span>
                                                </Typography.Title>
                                                <ul className="instructions">
                                                    <li style={{ marginBottom: 10 }}>
                                                        <span style={{ fontWeight: "bold" }}>Step 1: </span>
                                                        <span>Select the app's environment variables in the right section.</span>
                                                    </li>
                                                    <li style={{ marginBottom: 10 }}>
                                                        <span style={{ fontWeight: "bold" }}>Step 2: </span>
                                                        <span>Define the folder structure in the next window and click on Generate.</span>
                                                    </li>
                                                    <li style={{ marginBottom: 10 }}>
                                                        <span style={{ fontWeight: "bold" }}>Step 3: </span>
                                                        <span>Move the downloaded js file in the desired folder.</span>
                                                    </li>
                                                    <li >
                                                        <span style={{ fontWeight: "bold" }}>Step 4: </span>
                                                        <span>Copy the generated script and run it in cmd in the same folder.</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                            <Col xs={14} className="configuration-wrapper hide-on-medium-and-down">
                                <Configuration />
                            </Col>
                        </Row>
                        <Coverpage isMobile={isMobile} />
                    </Fragment>
                )}
        </Fragment>
    )
}

export default Home
