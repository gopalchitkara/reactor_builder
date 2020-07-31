import React, { useState, useEffect, useContext, Fragment } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { notification, Radio, Button, Row, Col, Select, Typography, Popover, Switch, Empty } from 'antd';
import { LeftOutlined, RightOutlined, LoadingOutlined } from '@ant-design/icons'
import { GlobalStateContext } from '../../contexts/GlobalStateContext';
import { suggestions, filesToRemoveForCleanup } from '../../constants/constants';
import Footer from './Footer';

const { Option } = Select;

function FileProperties({ isMobile }) {
    const [projectFiles, setProjectFiles] = useState([]);
    const [loadingProjectFiles, setLoadingProjectFiles] = useState(true);
    const [routedComponentOptions, setRoutedComponentOptions] = useState([]);
    const [navigationComponentOptions, setNavigationComponentOptions] = useState([]);

    const {
        componentTree, setComponentTree,
        routingRequired, setRoutingRequired,
        packages, setPackages,
        navigationComponent, setNavigationComponent,
        routedComponents, setRoutedComponents,
        cleanupRequired, setCleanupRequired,
        isFreshStart,
    } = useContext(GlobalStateContext);

    const history = useHistory();

    if (isMobile) {
        history.push('/notavailable')
    }

    if (isFreshStart) {
        history.push('/');
    }

    useEffect(() => {
        try {
            let results = componentTree.filter(x => x.type === 'file' && x.description.split('.').pop() === 'js');
            results.sort((a, b) => a.id - b.id);
            setProjectFiles(results);
        } catch (error) {
        } finally {
            setLoadingProjectFiles(false);
        }
    }, [componentTree])

    useEffect(() => {
        if (navigationComponent && navigationComponent.id > 0) {
            setRoutedComponentOptions(componentTree.filter(x => x.type === 'file'
                && x.description !== navigationComponent.description
                && (x.propertyType === suggestions.classComponent
                    || x.propertyType === suggestions.functionalComponent)))
        } else {
            setRoutedComponentOptions(componentTree.filter(x => x.type === 'file'
                && (x.propertyType === suggestions.classComponent
                    || x.propertyType === suggestions.functionalComponent)))
        }
    }, [componentTree, navigationComponent])

    useEffect(() => {
        if (routedComponents.length > 0) {
            setNavigationComponentOptions(componentTree.filter(x => x.type === 'file'
                && (x.propertyType === suggestions.classComponent || x.propertyType === suggestions.functionalComponent)
                && (!(routedComponents.map(r => r.id)).includes(x.id))
            ))
        } else {
            setNavigationComponentOptions(componentTree.filter(x => x.type === 'file'
                && (x.propertyType === suggestions.classComponent || x.propertyType === suggestions.functionalComponent)))
        }
    }, [componentTree, routedComponents])

    const onFilePropertyChange = (e, el) => {
        el.propertyType = e.target.value;
        let results = componentTree.filter(x => x.id !== el.id);
        setComponentTree([...results, el])
    };

    const handleGenerateScriptNavClick = () => {
        let goodToGo = true;

        if (navigationComponent.id > 0 && (!(navigationComponent.propertyType === suggestions.classComponent || navigationComponent.propertyType === suggestions.functionalComponent))) {
            notification['error']({
                message: `Property Type of ${navigationComponent.description} should be a Component because it is selected as the Navigation Component.`,
            });
            // return;
            goodToGo = false;
        }

        if (routedComponents.length > 0) {
            routedComponents.forEach(rc => {
                if (!(rc.propertyType === suggestions.classComponent || rc.propertyType === suggestions.functionalComponent)) {
                    notification['error']({
                        message: `Property Type of ${rc.description} should be a Component because it is selected as a Routed Component.`,
                    });
                    // return;
                    goodToGo = false;
                }
            })
        }

        if (goodToGo) {
            history.push('/generatescript');
        }
    }

    const handleEnableRoutingChange = (checked) => {

        if (projectFiles.length <= 0) {
            notification['error']({
                message: 'Please add Components to the project to Enable Routing',
            });
            setRoutingRequired(checked);
            setTimeout(() => {
                setRoutingRequired(false);
            }, 1500);
            return;
        }

        if (checked) {
            if (!packages.find(x => x === 'react-router-dom')) {
                notification['info']({
                    message: 'Routing requires react-router-dom package. Addind it to the dependencies.',
                });
                setPackages([...packages, 'react-router-dom'])
            }
        }
        setRoutingRequired(checked);
    }

    return (
        <Row>
            <Col xs={24}>
                <div className="node-options-heading">
                    <Row>
                        <Col xs={17}>
                            <Typography.Title level={2} style={{ marginBottom: 0 }}>
                                <span style={{ color: "#ffffff" }}>Set app's File Properties.</span>
                            </Typography.Title>
                            <h3 style={{ color: "#64ffda" }}>Use this space to define if a file will contain a component with its type, <br />context or be an empty js file.</h3>
                        </Col>
                        <Col xs={7} style={{ display: "flex", justifyContent: "center" }}>
                            <Button
                                type="primary"
                                size={'large'}
                                style={{ width: 180, fontWeight: 500 }}
                                onClick={() => history.push('/folderstructure')}
                            >
                                <LeftOutlined />Edit Structure
                                </Button>
                            <Button
                                type="primary"
                                size={'large'}
                                style={{ width: 180, fontWeight: 500 }}
                                onClick={handleGenerateScriptNavClick}
                            >
                                Generate Script<RightOutlined />
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Col>
            <Col xs={24} className="file-properties-wrapper">
                {loadingProjectFiles ? (
                    <Row justify="center">
                        <Col style={{ marginTop: 100 }}>
                            <LoadingOutlined style={{ fontSize: "2.2rem", color: "#ffffff" }} />
                        </Col>
                    </Row>
                ) : (
                        <Row>
                            <Col xs={17}>
                                {projectFiles && projectFiles.length > 0 ? (
                                    <Fragment>
                                        <Row>
                                            <Col xs={8}><h2 className="white-text">File Name</h2></Col>
                                        </Row>
                                        {projectFiles.map(el => {
                                            return (
                                                <Row key={Math.random()}>
                                                    <Col xs={8}>
                                                        <h3 className="white-text">
                                                            {el.description}
                                                        </h3>
                                                    </Col>

                                                    <Radio.Group
                                                        defaultValue={el.propertyType}
                                                        buttonStyle="solid"
                                                        onChange={(e) => onFilePropertyChange(e, el)}
                                                    >
                                                        <Radio.Button value={suggestions.functionalComponent}>Functional Component</Radio.Button>
                                                        <Radio.Button value={suggestions.classComponent}>Class Component</Radio.Button>
                                                        <Radio.Button value={suggestions.contextFile}>Context File</Radio.Button>
                                                        <Radio.Button value={suggestions.emptyFile}>Empty File</Radio.Button>
                                                    </Radio.Group>

                                                </Row>
                                            )
                                        })}
                                    </Fragment>
                                ) : (
                                        <div>
                                            <Empty
                                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                                description={
                                                    <span className="white-text">
                                                        No File/Component has been added to the project.
                                                            <br />
                                                        <Link to='/folderstructure' className="green-text">Click Here</Link> to add components to define Routes.
                                                        </span>
                                                }
                                            />
                                        </div>
                                    )}
                            </Col>
                            <Col xs={7}>
                                <Row>
                                    <Col xs={{ span: 17, offset: 2 }}>
                                        <h2 className="white-text m-0">Enable Routing?</h2>
                                    </Col>
                                    <Col xs={4}>
                                        <Switch
                                            className="mt-5"
                                            checked={routingRequired}
                                            onChange={handleEnableRoutingChange}
                                        />
                                    </Col>
                                    <Col xs={{ span: 20, offset: 2 }}>
                                        <h3 className="white-text mt-20">Select Navigation Component</h3>
                                        <Select
                                            style={{ width: '100%' }}
                                            placeholder={routingRequired ? "Please select" : "Please enable Routing"}
                                            disabled={!routingRequired}
                                            onChange={(val) => { setNavigationComponent(componentTree.find(x => x.description === val)) }}
                                            allowClear
                                        >
                                            {navigationComponentOptions.map(el => {
                                                if (el.type === 'file' && (el.propertyType === suggestions.classComponent || el.propertyType === suggestions.functionalComponent)) {
                                                    return (
                                                        <Option key={el.description}>
                                                            {el.description.substring(0, el.description.lastIndexOf('.'))}
                                                        </Option>
                                                    )
                                                } else {
                                                    return <></>
                                                }
                                            })}
                                        </Select>
                                    </Col>
                                    <Col xs={{ span: 20, offset: 2 }}>
                                        <h3 className="white-text mt-20">Select Routed Components</h3>
                                        <Select
                                            mode="multiple"
                                            style={{ width: '100%' }}
                                            placeholder={routingRequired ? "Please select" : "Please enable Routing"}
                                            disabled={!routingRequired}
                                            allowClear
                                            value={routedComponents.length > 0 ? routedComponents.map(r => r.description) : []}
                                            onChange={(val) => { setRoutedComponents(componentTree.filter(x => val.includes(x.description))) }}
                                        >
                                            {routedComponentOptions.map(el => {
                                                return (
                                                    <Option key={el.description}>
                                                        {el.description.substring(0, el.description.lastIndexOf('.'))}
                                                    </Option>
                                                )
                                            })}
                                        </Select>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: 50 }}>
                                    <Col xs={{ span: 17, offset: 2 }}>
                                        <h2
                                            className="m-0"
                                            style={{ color: "red" }}
                                        >Cleanup Required?</h2>
                                    </Col>
                                    <Col xs={4}>
                                        <Switch
                                            className="mt-5"
                                            checked={cleanupRequired}
                                            onChange={(checked) => { setCleanupRequired(checked) }}
                                            style={{ backgroundColor: cleanupRequired ? "red" : "" }}
                                        />
                                    </Col>
                                    <Col xs={{ span: 21, offset: 2 }}>
                                        <h4
                                            className="m-0"
                                            style={{ color: "red" }}
                                        >
                                            Enable this option to remove the initial files like App.css, logo.svg, setupTests.js, etc.
                                            <br />
                                            <Popover
                                                content={
                                                    <div>
                                                        {filesToRemoveForCleanup.map(x => {
                                                            return <p className="m-0" key={Math.random()}>{x.path}/{x.name}</p>
                                                        })}
                                                    </div>
                                                }
                                                trigger="hover"
                                                placement="left"
                                            >
                                                <span style={{ cursor: "pointer" }}>Hover here to see the full list.</span>
                                            </Popover>
                                        </h4>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    )}
            </Col>
            <Col xs={24} style={{ marginTop: "15vh" }}>
                <Footer />
            </Col>
        </Row >
    )
}

export default FileProperties
