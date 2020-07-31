import React, { useContext, useState, useEffect, Fragment } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Row, Col, Typography, Popover } from 'antd';
import { LeftOutlined, DownloadOutlined } from '@ant-design/icons'
import { GlobalStateContext } from '../../contexts/GlobalStateContext';
import shortid from 'shortid';
import { generateScriptText } from '../../helpers/scriptTextGenerator';
import { generateScriptFile } from '../../helpers/scriptFileGenerator';
import Footer from './Footer';

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
const { Text } = Typography;

function GenerateScript({ isMobile }) {
    const [isScriptLoading, setIsScriptLoading] = useState(false);
    const [finalAppTree, setFinalAppTree] = useState([]);

    const {
        projectName, environment,
        buildTool, packages,
        routingRequired, navigationComponent,
        routedComponents, appStructure,
        componentTree, resetAppState,
        isFreshStart, targetTerminal,
        scriptText, setScriptText,
        cleanupRequired
    } = useContext(GlobalStateContext);

    const history = useHistory();

    if (isMobile) {
        history.push('/notavailable')
    }

    if (isFreshStart) {
        history.push('/');
    }

    useEffect(() => {
        if (appStructure && appStructure.length > 0 && componentTree && componentTree.length > 0) {
            let result = [...appStructure, ...componentTree];
            result.sort(function (a, b) { return a.id - b.id });
            setFinalAppTree(result);
        }
    }, [appStructure, componentTree])

    useEffect(() => {
        if (finalAppTree && finalAppTree.length > 0) {
            let rootul = document.querySelector('.root-ul-final');
            rootul.innerHTML = '';

            finalAppTree.forEach(element => {
                if (!element.parentId) {
                    let rootli = document.createElement('li');
                    rootli.textContent = element.description;
                    rootli.classList.add('root-li');
                    rootli.classList.add('browser-default');
                    rootli.setAttribute('data-id', element.id);
                    let childul = document.createElement('ul');
                    childul.classList.add('browser-default');
                    rootli.appendChild(childul);
                    rootul.appendChild(rootli);
                }

                let targetElement = rootul.querySelector(`[data-id="${element.parentId}"]>ul`)
                if (targetElement) {
                    if (finalAppTree.find(x => x.parentId === element.id)) {
                        let li = document.createElement('li');
                        li.classList.add('browser-default');
                        li.setAttribute('data-id', element.id);
                        li.setAttribute('data-value', element.description);
                        li.setAttribute('data-parent-id', element.parentId);
                        li.setAttribute('data-type', element.type === 'folder' ? 1 : 0);
                        li.textContent = element.description;
                        li.setAttribute('data-id', element.id);
                        let ul = document.createElement('ul');
                        ul.classList.add('browser-default');
                        li.appendChild(ul);
                        targetElement.append(li);

                        [...targetElement.children]
                            .sort((a, b) => b.getAttribute('data-type') - a.getAttribute('data-type')
                                || a.getAttribute('data-value').localeCompare(b.getAttribute('data-value')))
                            .forEach(node => targetElement.appendChild(node))
                    }
                    else {
                        let li = document.createElement('li');
                        li.textContent = element.description;
                        li.classList.add('browser-default');
                        li.setAttribute('data-id', element.id);
                        li.setAttribute('data-value', element.description);
                        li.setAttribute('data-parent-id', element.parentId);
                        li.setAttribute('data-type', element.type === 'folder' ? 1 : 0);
                        targetElement.append(li);

                        [...targetElement.children]
                            .sort((a, b) => b.getAttribute('data-type') - a.getAttribute('data-type')
                                || a.getAttribute('data-value').localeCompare(b.getAttribute('data-value')))
                            .forEach(node => targetElement.appendChild(node))
                    }
                }
            });
        }
    }, [finalAppTree])

    const handleGenerateScriptClick = () => {
        let fileName;
        try {
            setIsScriptLoading(true);
            fileName = shortid.generate();
            generateScriptFile({
                fileName,
                projectName,
                componentTree,
                cleanupRequired,
                routingRequired,
                routedComponents,
                navigationComponent,
            })
            setScriptText(generateScriptText({ projectName, buildTool, packages, fileName }));
        } catch (error) {

        } finally {
            setIsScriptLoading(false);
        }
    }

    return (
        <Row>
            <Col xs={24}>
                <div className="generate-script-page-header">
                    <Row>
                        <Col xs={17}>
                            <Typography.Title level={2} style={{ marginBottom: 0 }}>
                                <span style={{ color: "#ffffff" }}>Review Your App variables.</span>
                            </Typography.Title>
                        </Col>
                        <Col xs={7} style={{ display: "flex", justifyContent: "center" }}>
                            <Button
                                type="primary"
                                size={'large'}
                                style={{ width: 210, fontWeight: 500 }}
                                onClick={() => history.push('/fileproperties')}
                            >
                                <LeftOutlined />File Properties
                                </Button>
                            <Button
                                type="primary"
                                danger
                                size={'large'}
                                style={{ width: 150, fontWeight: 500 }}
                                onClick={() => { resetAppState(); history.push('/') }}
                            >
                                Restart
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Col>
            <Col xs={12}>
                <div className="folder-structure-wrapper">
                    <div className="folder-structure folder-structure-final">
                        <ul className="root-ul-final"></ul>
                    </div>
                </div>
            </Col>
            <Col xs={12}>
                <Row>
                    <Col xs={24}>
                        <div className="environment-variables-final">
                            <div className="environment-variables-grid">
                                <div className="title">Project Name:</div>
                                <div className="value">{projectName}</div>
                                <div className="title">Environment:</div>
                                <div className="value">{environment}</div>
                                <div className="title">Build Tool:</div>
                                <div className="value">{buildTool}</div>
                                <div className="title">Target Terminal:</div>
                                <div className="value">{targetTerminal}</div>
                                <div className="title">Package(s) to import:</div>
                                <div className="value">
                                    {packages.length <= 0 ? (
                                        <span>
                                            none
                                        </span>
                                    ) : (
                                            <Popover
                                                content={
                                                    <div>
                                                        {packages.map(el => {
                                                            return <p className="m-0" key={Math.random()}>{el}</p>
                                                        })}
                                                    </div>
                                                }
                                                trigger="hover"
                                                placement="topLeft"
                                            >
                                                <span style={{ cursor: "pointer", paddingRight: 50, color: "blue" }}>{packages.length}</span>
                                            </Popover>
                                        )}
                                </div>
                                <div className="title">Routing Enabled</div>
                                <div className="value">{routingRequired ? 'yes' : 'no'}</div>
                                {routingRequired ? (
                                    <>
                                        <div className="title">Navigation Component:</div>
                                        <div className="value">
                                            {navigationComponent ? (navigationComponent.description) : 'none'}
                                        </div>
                                        <div className="title">Routed Components:</div>
                                        <div className="value">
                                            {routedComponents.length <= 0 ? (
                                                <span>none</span>
                                            ) : (
                                                    <Popover
                                                        content={
                                                            <div>
                                                                {routedComponents.map(x => {
                                                                    return <p className="m-0" key={Math.random()}>{x.description}</p>
                                                                })}
                                                            </div>
                                                        }
                                                        trigger="hover"
                                                        placement="topLeft"
                                                    >
                                                        <span style={{ cursor: "pointer", paddingRight: 50, color: "blue" }}>{routedComponents.length}</span>
                                                    </Popover>
                                                )}
                                        </div>
                                    </>
                                ) : (<></>)}
                                <div className="title">Clean Required</div>
                                <div className="value">{cleanupRequired ? 'yes' : 'no'}</div>
                            </div>
                        </div>
                    </Col>
                    <Col xs={24}>
                        {scriptText ? (
                            <Fragment>
                                <div className="script">
                                    <Text copyable className="script-text">{scriptText}</Text>
                                    {/* <code>{scriptText}</code> */}
                                </div>
                                <div style={{ margin: "10px 100px", textAlign: "center" }}>Move the downloaded file in the target location and run this command in cmd in the same location.</div>
                            </Fragment>
                        ) : (
                                <div className="generate-script">
                                    <Button
                                        className="record-generate-script-click"
                                        type="primary"
                                        icon={<DownloadOutlined />}
                                        size="large"
                                        style={{ width: 300, height: 50 }}
                                        loading={isScriptLoading}
                                        onClick={() => handleGenerateScriptClick()}
                                    >
                                        <span>{isScriptLoading ? "Generating Script" : "Generate Script"}</span>
                                    </Button>
                                </div>
                            )}
                    </Col>
                </Row>
            </Col>
            <Col xs={24}>
                <Footer bgColor={"#0a192f"} />
            </Col>
        </Row>
    )
}

export default GenerateScript
