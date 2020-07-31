import React from 'react'
import './Coverpage.css'
import { Row, Col } from 'antd'
import Footer from '../app/Footer'

function Coverpage({ isMobile }) {
    return (
        <Row>
            <Col xs={24} className="coverpage-container">
                <Row>
                    <Col xs={24} style={{ marginTop: isMobile ? 0 : 80 }}>
                        <h1 className="main-title mb-5" style={{ marginTop: 20 }}>Reactor Builder</h1>
                        <h3 className="main-subtitle mb-20">The only tool you need to accelerate your App Planning and Development in React JS.</h3>
                        <h3 className="secondary-title">How to use Reactor?</h3>
                    </Col>
                </Row>
                <Row align="middle" className="coverpage-row row-reverse align-left">
                    <Col xs={24} md={{ span: 20, offset: 2 }} lg={{ span: 16, offset: 0 }}>
                        <img className="coverpage-image" src="https://images.gopalchitkara.in/images/reactor-images/Configuration.png" alt="Configuration" />
                    </Col>
                    <Col xs={24} lg={{ span: 8, offset: 0 }}>
                        <h2 className="green-text step-title mt-20">Step 1</h2>
                        <h3 className="white-text step-text step-text-pr">Give your application a Name and set the variables shown on screen.</h3>
                    </Col>
                </Row>
                <Row align="middle" className="coverpage-row align-right">
                    <Col xs={24} md={{ span: 20, offset: 2 }} lg={{ span: 16, offset: 0 }}>
                        <img className="coverpage-image" src="https://images.gopalchitkara.in/images/reactor-images/ComponentTree.png" alt="ComponentTree" />
                    </Col>
                    <Col xs={24} lg={{ span: 8, offset: 0 }}>
                        <h2 className="green-text step-title mt-20">Step 2</h2>
                        <h3 className="white-text step-text step-text-pl">Plan and Build your component/files tree here. Click on a node in the tree to add its children.</h3>
                    </Col>
                </Row>
                <Row align="middle" className="coverpage-row row-reverse align-left" >
                    <Col xs={24} md={{ span: 20, offset: 2 }} lg={{ span: 16, offset: 0 }}>
                        <img className="coverpage-image" src="https://images.gopalchitkara.in/images/reactor-images/FileProperties.png" alt="FileProperties" />
                    </Col>
                    <Col xs={24} lg={{ span: 8, offset: 0 }}>
                        <h2 className="green-text step-title mt-20">Step 3</h2>
                        <h3 className="white-text step-text step-text-pr">Select if the js files you have added contains a component, context or is an empty file. You can also enable routing here and select the components which will be routed. These routes will be added to the App.js file.</h3>
                    </Col>
                </Row>
                <Row align="middle" className="coverpage-row align-right">
                    <Col xs={24} md={{ span: 20, offset: 2 }} lg={{ span: 16, offset: 0 }}>
                        <img className="coverpage-image" src="https://images.gopalchitkara.in/images/reactor-images/AppReview.png" alt="AppReview" />
                    </Col>
                    <Col xs={24} lg={{ span: 8, offset: 0 }}>
                        <h2 className="green-text step-title mt-20">Step 4</h2>
                        <h3 className="white-text step-text step-text-pl">Review your selections and go back to edit. Click on Generate Script button to generate the script and download the js file which will setup the applicaiton on your machine.</h3>
                    </Col>
                </Row>
                <Row align="middle" className="coverpage-row row-reverse align-left" >
                    <Col xs={24} md={{ span: 20, offset: 2 }} lg={{ span: 16, offset: 0 }}>
                        <img className="coverpage-image" src="https://images.gopalchitkara.in/images/reactor-images/ScriptGenerated.jpg" alt="ScriptGenerated" />
                    </Col>
                    <Col xs={24} lg={{ span: 8, offset: 0 }}>
                        <h2 className="green-text step-title mt-20">Step 5</h2>
                        <h3 className="white-text step-text step-text-pr">Move the downloaded file to the target folder and copy the script text from the screen.</h3>
                    </Col>
                </Row>
                <Row align="middle" className="coverpage-row align-right">
                    <Col xs={24} md={{ span: 20, offset: 2 }} lg={{ span: 16, offset: 0 }}>
                        <img className="coverpage-image" src="https://images.gopalchitkara.in/images/reactor-images/VSCode.jpg" alt="VSCode" />
                    </Col>
                    <Col xs={24} lg={{ span: 8, offset: 0 }}>
                        <h2 className="green-text step-title mt-20">Step 6</h2>
                        <h3 className="white-text step-text step-text-pl">Using cmd execute the copied script in the target folder and you are all set!</h3>
                    </Col>
                </Row>
                {isMobile ? (
                    <Row className="coverpage-row">
                        <Col xs={24} >
                            <h3 className="white-text" style={{ fontSize: "1rem" }}>Hey! Glad to see you interested in this project.<br />I am afraid that Reactor Builder is currently avaliable only for Desktop Devices.</h3>
                            <h3 className="white-text m-0" style={{ fontSize: "1rem" }}>Meanwhile, why not go <a href="https://gopalchitkara.in/" target="_blank" rel="noopener noreferrer">here</a> to check out my other work.</h3>
                        </Col>
                    </Row>
                ) : (<></>)}
                <Footer bgColor={"#172a45"} />
            </Col>
        </Row>
    )
}

export default Coverpage
