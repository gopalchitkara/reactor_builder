import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Input, Button, Row, Col, Select, Typography, notification, Popconfirm, Tooltip } from 'antd';
import { LeftOutlined, RightOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { GlobalStateContext } from '../../contexts/GlobalStateContext';
import { getSuggestedFileProperty } from '../../helpers/getSuggestedFileProperty';
import Footer from './Footer';

const { Option } = Select;

function FolderStructure({ isMobile }) {
    const [selectedNode, setSelectedNode] = useState({});
    const [nodeTypeInit, setNodeTypeInit] = useState('folder')
    const { componentTree, setComponentTree, isFreshStart } = useContext(GlobalStateContext);

    const [form] = Form.useForm();
    const history = useHistory();

    if (isMobile) {
        history.push('/notavailable')
    }

    if (isFreshStart) {
        history.push('/');
    }

    useEffect(() => {
        if (componentTree && componentTree.length > 0) {
            let sourceNode = componentTree.find(x => x.description === 'components');
            if (sourceNode) {
                setSelectedNode(sourceNode);
            } else {
                sourceNode = componentTree.find(x => x.description === 'src');
                setSelectedNode(sourceNode);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (componentTree && componentTree.length > 0) {
            let rootul = document.querySelector('.root-ul');
            rootul.innerHTML = '';

            componentTree.forEach(element => {
                if (element.description === 'src') {
                    let rootli = document.createElement('li');
                    rootli.textContent = element.description;
                    rootli.classList.add('root-li');
                    rootli.classList.add('selectable');
                    rootli.classList.add('browser-default');
                    rootli.setAttribute('data-id', element.id);
                    let childul = document.createElement('ul');
                    childul.classList.add('browser-default');
                    rootli.appendChild(childul);
                    rootul.appendChild(rootli);
                }

                let targetElement = rootul.querySelector(`[data-id="${element.parentId}"]>ul`)
                if (targetElement) {
                    if (componentTree.find(x => x.parentId === element.id)) {
                        let li = document.createElement('li');
                        li.classList.add('browser-default');
                        li.setAttribute('data-id', element.id);
                        li.setAttribute('data-value', element.description);
                        li.setAttribute('data-parent-id', element.parentId);
                        li.setAttribute('data-type', element.type === 'folder' ? 1 : 0);
                        li.textContent = element.description;
                        li.setAttribute('data-id', element.id);
                        let ul = document.createElement('ul');
                        li.classList.add('selectable');
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
                        li.classList.add('selectable');
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
    }, [componentTree])

    useEffect(() => {
        if (componentTree && componentTree.length > 0) {
            let selectableElements = document.querySelectorAll('.selectable');
            selectableElements.forEach(function (element) {
                element.addEventListener('click', e => {
                    let targetId = e.target.getAttribute('data-id');
                    let targetNode = componentTree.find(x => x.id === parseInt(targetId));
                    if (targetNode) {
                        setSelectedNode(targetNode);
                    }
                }, false)
            })
        }
    }, [componentTree])

    const onFinish = values => {
        // if (values.relationType === 'sibling' && !selectedNode.parentId) {
        //     message.error('Cannot add sigbling to the source node.');
        //     return;
        // }

        if (componentTree.find(x => x.description === values.nodeName)) {
            notification['error']({
                message: `A node with name ${values.nodeName} already exists in the tree. Please enter a different name`,
            });
            return;
        }

        if (selectedNode.type === 'file' && values.relationType === 'child') {
            notification['error']({
                message: 'Cannot add child to a File node. Please select a folder node to add children.',
            });
            return;
        }

        let newNode;
        switch (values.relationType) {
            case 'child':
                let nodeChildren = componentTree.filter(x => x.parentId === selectedNode.id);
                if (values.nodeType === 'file' && values.nodeName.split('.').pop() === 'js') {
                    newNode = {
                        id: ((selectedNode.id * 10) + nodeChildren.length + 1),
                        description: values.nodeName,
                        type: values.nodeType,
                        propertyType: getSuggestedFileProperty({ componentTree, fileName: values.nodeName, parentId: selectedNode.id }),
                        parentId: selectedNode.id
                    }
                } else {
                    newNode = {
                        id: ((selectedNode.id * 10) + nodeChildren.length + 1),
                        description: values.nodeName,
                        type: values.nodeType,
                        parentId: selectedNode.id
                    }
                }
                break;
            // case 'sibling':
            //     newNode = {
            //         id: ((selectedNode.id * 100) + nodeChildren.length + 1),
            //         description: values.nodeName,
            //         type: values.nodeType,
            //         parentId: selectedNode.parentId
            //     }
            //     break;
            default:
                return;
        }
        // console.log('newNode', newNode)
        setComponentTree([...componentTree, newNode]);
        form.resetFields();
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const handleSelectedNodeNameChange = value => {

        if (value !== selectedNode.description && componentTree.find(x => x.description === value)) {
            notification['error']({
                message: 'Name already exists in the tree.',
            });
            return;
        }

        if (selectedNode.type === 'file' && (value.indexOf('.') <= 0)) {
            notification['error']({
                message: 'Selected Node is a File and cannot be saved without extension.',
            });
            return;
        }

        let resultNode = selectedNode;
        resultNode.description = value;

        let resultComponentTree = componentTree.filter(x => x.id !== selectedNode.id);
        resultComponentTree = [...resultComponentTree, resultNode];
        resultComponentTree.sort((a, b) => a.id - b.id);
        setComponentTree(resultComponentTree);
        setSelectedNode(resultNode);
    }

    const deleteNodeWithChildren = () => {
        if (componentTree.find(x => x.id === selectedNode.id)) {
            var result = componentTree.filter(x => x.id !== selectedNode.id && x.parentId !== selectedNode.id);
            setComponentTree(result);
            setSelectedNode(componentTree.find(x => x.description === 'src'));
        }
    }

    return (
        <Row>
            <Col xs={24}>
                <div className="node-options-heading">
                    <Row>
                        <Col xs={17}>
                            <Typography.Title level={2} style={{ marginBottom: 0 }}>
                                <span style={{ color: "#ffffff" }}>Build Your File/Component Tree.</span>
                            </Typography.Title>
                            {componentTree.length > 1 ? (
                                <h3 style={{ color: "#64ffda" }}>Click on a node in the tree to add its children.</h3>
                            ) : (
                                    <h3 style={{ color: "#64ffda" }}>Add new nodes to get started.</h3>
                                )}
                        </Col>
                        <Col xs={7} style={{ display: "flex", justifyContent: "center" }}>
                            <Button
                                type="primary"
                                size={'large'}
                                style={{ width: 180, fontWeight: 500 }}
                                onClick={() => history.push('/')}
                            >
                                <LeftOutlined />Edit Environemt
                                </Button>
                            <Button
                                type="primary"
                                size={'large'}
                                style={{ width: 180, fontWeight: 500 }}
                                onClick={() => history.push('/fileproperties')}
                            >
                                File Properties<RightOutlined />
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Col>
            <Col xs={12} className="node-options-wrapper">
                <div className="node-options">
                    <Form
                        name="nodeOptionsForm"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        colon={false}
                        hideRequiredMark
                        labelAlign={"left"}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        form={form}
                    >
                        <Form.Item
                            label={
                                <span>
                                    Selected Node&nbsp;&nbsp;
                                    <Tooltip
                                        placement="right"
                                        color="blue"
                                        title="Click on a node in the tree to select it and click on pen icon to edit node name."
                                    >
                                        <QuestionCircleOutlined />
                                    </Tooltip>
                                </span>
                            }
                            // name="selectedNode"
                            className="form-item-label-color"
                        >

                            {selectedNode.description === 'src' ? (
                                <h2 style={{ color: "#ffffff" }} className="m-0" >
                                    {selectedNode.description}
                                </h2>
                            ) : (
                                    <Typography.Text
                                        editable={{ onChange: handleSelectedNodeNameChange }}
                                        style={{ width: 180 }}
                                        className="source-node-description "
                                    >
                                        {selectedNode.description}
                                    </Typography.Text>
                                )}

                        </Form.Item>

                        <Form.Item
                            label="Add new Node as"
                            name="relationType"
                            className="form-item-label-color"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        if (value === 'sibling') {
                                            if ((componentTree.find(x => !x.parentId)).description === selectedNode.description) {
                                                return Promise.reject('cannot add a sibling to the Source Node');
                                            }
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                            initialValue="child"
                        >
                            <Select
                                style={{ width: "180px" }}
                            >
                                {/* <Option value="sibling">Sibling</Option> */}
                                <Option value="child">Child</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="of Type"
                            name="nodeType"
                            className="form-item-label-color"
                            rules={[
                                {
                                    required: true,
                                    message: 'Type is required',
                                },
                            ]}
                            initialValue={nodeTypeInit}
                        >
                            <Select
                                style={{ width: 180 }}
                                placeholder="Select Node Type"
                                onChange={(val) => setNodeTypeInit(val)}
                            >
                                <Option value="folder">Folder</Option>
                                <Option value="file">File</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={`and ${nodeTypeInit} Name`}
                            name="nodeName"
                            className="form-item-label-color"
                            rules={[
                                {
                                    required: true,
                                    message: 'Node Name is required',
                                    whitespace: true
                                },
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        if (getFieldValue('nodeType') === 'file') {
                                            if (value.indexOf(' ') > 0) {
                                                return Promise.reject('File name cannot have whitespace.');
                                            }
                                            if (value.lastIndexOf('.') <= 0) {
                                                return Promise.reject('Please prvide extension for the file');
                                            }
                                        }

                                        if (getFieldValue('nodeType') === 'folder' && value.lastIndexOf('.') >= 0) {
                                            return Promise.reject('Please remove period (.) from folder name');
                                        }

                                        if (componentTree.find(x => x.description === value)) {
                                            return Promise.reject('A node with this name already exists. Please select a different name');
                                        }

                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <Input
                                style={{ width: 180 }}
                                placeholder="Node Name"
                                autoFocus
                            />
                        </Form.Item>


                        {selectedNode.description === 'src' ? (
                            <Form.Item label=" ">
                                <Button type="primary" htmlType="submit"
                                    style={{ width: 180 }}
                                >
                                    Add
                                    </Button>
                            </Form.Item>
                        ) : (
                                <Form.Item>
                                    <Row align="middle">
                                        <Col xs={24} xl={11} style={{ marginBottom: 10 }}>
                                            <Popconfirm
                                                title="Are you sure delete this node and all its children?"
                                                onConfirm={deleteNodeWithChildren}
                                                okText="Yes"
                                                cancelText="Cancel"
                                                placement="right"
                                            >
                                                <Button
                                                    type="danger"
                                                    // style={{ width: 180, marginRight: 20 }}
                                                    style={{ width: "100%" }}
                                                >Delete Selected Node</Button>
                                            </Popconfirm>
                                        </Col>
                                        <Col xs={0} xl={1} style={{ marginBottom: 10 }}></Col>
                                        <Col xs={24} xl={11} style={{ marginBottom: 10 }}>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                style={{ width: "100%" }}
                                            // style={{ width: 180 }}
                                            >Add</Button>
                                        </Col>
                                    </Row>
                                </Form.Item>
                            )}
                    </Form>
                </div>
            </Col>
            <Col xs={12}>
                <div className="folder-structure-wrapper">
                    <div className="folder-structure">
                        <ul className="root-ul"></ul>
                    </div>
                </div>
            </Col>
            <Col xs={24} style={{ marginTop: "30vh" }}>
                <Footer />
            </Col>
        </Row>
    )
}

export default FolderStructure
