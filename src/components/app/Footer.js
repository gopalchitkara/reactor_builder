import React from 'react'
import { Row, Col } from 'antd';

function Footer({ bgColor }) {
    return (
        <Row align="middle" className="footer" style={{ backgroundColor: bgColor }}>
            <Col xs={24} style={{ textAlign: "center" }}>
                <div className="footer-content">
                    <p className="mb-5">
                        {`Built with ☕ by `}
                        <a href="https://gopalchitkara.in/" target="_blank" rel="noopener noreferrer">
                            <span className="footer-link-name">Gopal Chitkara </span>
                        </a>
                        | Facing issues? Raise them <a href="https://github.com/gopalchitkara/reactor-builder-issues/issues" target="_blank" rel="noopener noreferrer"
                        >here.</a>
                    </p>
                </div>
            </Col>
            <Col xs={24} style={{ textAlign: "center" }}>
                <a href="https://github.com/gopalchitkara/" target="_blank" rel="noopener noreferrer"
                    className="footer-link"
                >
                    <span className="footer-link-name">Github</span>
                </a>
                <a href="mailto:gopal.chitkara@gmail.com" target="_blank" rel="noopener noreferrer"
                    className="footer-link"
                >
                    <span className="footer-link-name">Email</span>
                </a>
                <a href="https://www.linkedin.com/in/gopalchitkara/" target="_blank" rel="noopener noreferrer"
                    className="footer-link"
                >
                    <span className="footer-link-name">LinkedIn</span>
                </a>
            </Col>
        </Row>
    )
}

export default Footer
