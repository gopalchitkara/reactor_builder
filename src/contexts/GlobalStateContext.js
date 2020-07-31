import React, { useState, createContext, useEffect } from 'react'
import { initState } from '../helpers/initState'

export const GlobalStateContext = createContext();

export const GlobalStateContextProvider = props => {
    const [projectName, setProjectName] = useState('');
    const [environment, setEnvironment] = useState('');
    const [buildTool, setBuildTool] = useState('');
    const [packages, setPackages] = useState([]);
    const [routingRequired, setRoutingRequired] = useState(false);
    const [navigationComponent, setNavigationComponent] = useState({});
    const [routedComponents, setRoutedComponents] = useState([]);
    const [appStructure, setAppStructure] = useState([]);
    const [componentTree, setComponentTree] = useState([]);
    const [targetTerminal, setTargetTerminal] = useState('');
    const [cleanupRequired, setCleanupRequired] = useState(false);
    const [isFreshStart, setIsFreshStart] = useState(true);
    const [scriptText, setScriptText] = useState(null);

    useEffect(() => {
        if (initState) {
            setProjectName(initState.projectName);
            setEnvironment(initState.environment);
            setBuildTool(initState.buildTool);
            setPackages(initState.packages);
            setRoutingRequired(initState.routingRequired);
            setNavigationComponent(initState.navigationComponent);
            setRoutedComponents(initState.routedComponents);
            setAppStructure(initState.appStructure);
            setTargetTerminal(initState.targetTerminal);
            setComponentTree(initState.componentTree);
            setCleanupRequired(initState.cleanupRequired);
        }
    }, [])

    useEffect(() => {
        setScriptText(null);
    }, [projectName, environment, buildTool, packages, routingRequired, navigationComponent, componentTree])

    useEffect(() => {
        if (cleanupRequired) {
            setAppStructure(initState.appStructureClean);
        } else {
            setAppStructure(initState.appStructure);
        }
    }, [cleanupRequired])

    const resetAppState = () => {
        if (initState) {
            setProjectName(initState.projectName);
            setEnvironment(initState.environment);
            setBuildTool(initState.buildTool);
            setPackages(initState.packages);
            setRoutingRequired(initState.routingRequired);
            setNavigationComponent(initState.navigationComponent);
            setRoutedComponents(initState.routedComponents);
            setAppStructure(initState.appStructure);
            setComponentTree(initState.componentTree);
            setTargetTerminal(initState.targetTerminal);
            setCleanupRequired(initState.cleanupRequired);
            setIsFreshStart(true);
            setScriptText(null);
        }
    }

    return (
        <GlobalStateContext.Provider value={{
            projectName, setProjectName,
            environment, setEnvironment,
            buildTool, setBuildTool,
            packages, setPackages,
            routingRequired, setRoutingRequired,
            navigationComponent, setNavigationComponent,
            routedComponents, setRoutedComponents,
            appStructure, setAppStructure,
            componentTree, setComponentTree,
            isFreshStart, setIsFreshStart,
            scriptText, setScriptText,
            targetTerminal, setTargetTerminal,
            cleanupRequired, setCleanupRequired,
            resetAppState
        }}>
            {props.children}
        </GlobalStateContext.Provider>
    )
}
