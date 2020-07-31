import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Input, Button, Tooltip, Row, Col, Select, Typography } from 'antd';
import { QuestionCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { GlobalStateContext } from '../../contexts/GlobalStateContext';

const layout = {
    labelCol: {
        span: 8,
        offset: 0
    },
    wrapperCol: {
        span: 10,
        offset: 6
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 6,
        span: 12,
    },
};

const packageChildren = [
    // <Select.Option key={'custom'} disabled style={{ fontWeight: "bold" }}>{'type to add a custom package'}</Select.Option>,
    <Select.Option key={'react-router-dom'}>react-router-dom</Select.Option>,
    <Select.Option key={'framer-motion'}>framer-motion</Select.Option>,
    <Select.Option key={'antd'}>antd</Select.Option>,
    <Select.Option key={'material-ui'}>material-ui</Select.Option>,
];


function Configuration() {
    const {
        projectName, setProjectName,
        environment, setEnvironment,
        buildTool, setBuildTool,
        packages, setPackages,
        targetTerminal, setTargetTerminal,
        setIsFreshStart
    } = useContext(GlobalStateContext);

    const history = useHistory();

    const onFinish = values => {
        try {
            setProjectName(values.projectName);
            setEnvironment(values.environment);
            setBuildTool(values.buildTool);
            setPackages(values.packages);
            setTargetTerminal(values.targetTerminal);
            setIsFreshStart(false);
        } catch (error) {
            console.log(error)
        } finally {
            history.push('/folderstructure')
        }
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Row className="environment-form">
            <Col xs={24} style={{ marginTop: 20 }}>
                <Typography.Title level={2} style={{ marginBottom: 40 }}>
                    <span style={{ color: "#ffffff" }}>Select Env. Variables</span>
                </Typography.Title>
            </Col>
            <Col xs={24}>
                {projectName && environment && buildTool ? (
                    < Form
                        {...layout}
                        name="configurationForm"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        colon={false}
                        hideRequiredMark
                        labelAlign={"left"}
                        initialValues={
                            {
                                projectName: projectName,
                                environment: environment,
                                buildTool: buildTool,
                                packages: packages,
                                targetTerminal: targetTerminal
                            }
                        }
                    >
                        <Form.Item
                            label={
                                <span>
                                    Project Name&nbsp;&nbsp;
                                <Tooltip color="blue" placement="right" title="Small letters with no spaces.">
                                        <QuestionCircleOutlined />
                                    </Tooltip>
                                </span>
                            }
                            name="projectName"
                            className="form-item-label-color"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input Project Name',
                                },
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        if (value.indexOf(' ') > 0) {
                                            return Promise.reject('Name cannot contain whitespaces.');
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Environment"
                            name="environment"
                            className="form-item-label-color"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select an environment',
                                },
                            ]}
                        >
                            <Select
                                style={{ width: "100%" }}
                            >
                                <Select.Option value="create-react-app">Create React App</Select.Option>
                                <Select.Option disabled value="more">More Coming Soon</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Build Tool"
                            name="buildTool"
                            className="form-item-label-color"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select Build Tool',
                                },
                            ]}
                        >
                            <Select
                                style={{ width: "100%" }}
                            >
                                <Select.Option value="npx">npx</Select.Option>
                                {/* <Select.Option value="yarn">yarn</Select.Option> */}
                                <Select.Option disabled value="more">More Coming Soon</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Packages to be installed"
                            name="packages"
                            className="form-item-label-color"
                        >
                            <Select
                                mode="tags"
                                style={{ width: '100%' }}
                                placeholder="Type package name or Select below"
                            >
                                {packageChildren}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Target Terminal"
                            name="targetTerminal"
                            className="form-item-label-color"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select a Target Terminal',
                                },
                            ]}
                        >
                            <Select
                                style={{ width: "100%" }}
                            >
                                <Select.Option value="windowsCmd">Windows cmd</Select.Option>
                                {/* <Select.Option value="vsCodePowershell">VS Code Powershell</Select.Option> */}
                                <Select.Option disabled value="more">More Coming Soon</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item {...tailLayout}>
                            <Button
                                type="primary"
                                shape="round"
                                size={'large'}
                                style={{ width: "100%", height: 50, marginTop: 20 }}
                                htmlType="submit"
                            >
                                Set Component Structure <ArrowRightOutlined />
                            </Button>
                        </Form.Item>
                    </Form>
                ) : (<></>)}
            </Col>
            <Col xs={24}>
                <div className="mouse"></div>
                <p className="m-0" style={{ textAlign: "right", userSelect: "none" }}>Scroll</p>
            </Col>
        </Row >
    )
}

export default Configuration
