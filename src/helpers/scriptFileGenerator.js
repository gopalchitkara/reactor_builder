import { suggestions, filesToRemoveForCleanup } from '../constants/constants';

//code to download the script file.
const downloadNodeFile = (MainFile, thisFileName) => {
    const element = document.createElement("a");
    const file = new Blob([MainFile], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${thisFileName}.js`;
    document.body.appendChild(element);
    element.click();
}

export const generateScriptFile = ({ fileName, projectName, componentTree, cleanupRequired, routingRequired, routedComponents, navigationComponent, }) => {
    let linesOfCode = [
        `const fs = require('fs');`,
    ];
    let componentTreeFolders = componentTree.filter(x => x.type === 'folder');
    let componentTreeFiles = componentTree.filter(x => x.type === 'file');
    componentTreeFolders.sort((a, b) => a.id - b.id);
    componentTreeFiles.sort((a, b) => a.id - b.id)

    //Create Empty Folders from the tree
    componentTreeFolders.forEach(el => {
        if (!(el.description === 'src')) {
            linesOfCode.push("fs.mkdirSync('" + projectName + "/src" + getPathWithParentInfo(componentTreeFolders, el) + "');");
        }
    });

    //Create Files and set the content as per config.
    componentTreeFiles.forEach((el) => {
        console.log('el', el);
        let fileFullPath = getPathWithParentInfo(componentTreeFolders, el);
        if (el.description.split('.').pop() === 'js') {
            let data = getJSFileContent(el);
            linesOfCode.push(`fs.writeFileSync("${projectName}/src${fileFullPath}", "${data}");`)
        } else {
            linesOfCode.push(`fs.writeFileSync("${projectName}/src${fileFullPath}", " ");`)
        }
    })

    let contextFiles = componentTree.filter(x => x.type === 'file' && x.description.split('.').pop() === 'js' && x.propertyType === suggestions.contextFile)
    //add routes and context to app.js
    if (routingRequired || contextFiles.length > 0) {
        let AppJsContent = getAppJsContent(routingRequired, routedComponents, navigationComponent, componentTreeFolders, contextFiles);
        // console.log(AppJsContent);
        linesOfCode.push(`fs.writeFileSync("${projectName}/src/App.js", "${AppJsContent}");`)
    }

    //perform cleanup if requied
    if (cleanupRequired && filesToRemoveForCleanup.length > 0) {
        filesToRemoveForCleanup.forEach(file => {
            linesOfCode.push(`fs.unlinkSync("${projectName}${file.path}/${file.name}");`)
        })
    }

    // console.log(linesOfCode);
    let MainFile = linesOfCode.join('');
    downloadNodeFile(MainFile, fileName)
}

// generate content for app js if routing is enabled or context is present
const getAppJsContent = (routingRequired, routedComponents, navigationComponent, componentTreeFolders, contextFiles) => {
    let appJsLines = [];
    appJsLines.push(`import React from 'react';`);

    if (routingRequired) {
        appJsLines.push(`import { BrowserRouter, Switch, Route } from 'react-router-dom';`);
    }

    //import context providers
    if (contextFiles && contextFiles.length > 0) {
        contextFiles.forEach(el => {
            let name = el.description.substring(0, el.description.lastIndexOf('.'));
            let contextName = name.toLowerCase().indexOf('context') > 0 ? name : name + 'Context';
            let path = getPathWithParentInfo(componentTreeFolders, el);
            appJsLines.push(`import { ${contextName}Provider } from '.${path.substring(0, path.lastIndexOf('.'))}';`)
        })
    }

    //import navigation components
    if (navigationComponent.id > -1) {
        let path = '.' + getPathWithParentInfo(componentTreeFolders, navigationComponent)
        let compName = navigationComponent.description.substring(0, navigationComponent.description.lastIndexOf('.'))
        appJsLines.push(`import ${compName} from '${path.substring(0, path.lastIndexOf('.'))}';`)
    }

    //import navigated components
    if (routedComponents && routedComponents.length > 0) {
        routedComponents.forEach(el => {
            let path = '.' + getPathWithParentInfo(componentTreeFolders, el)
            let compName = el.description.substring(0, el.description.lastIndexOf('.'))
            appJsLines.push(`import ${compName} from '${path.substring(0, path.lastIndexOf('.'))}';`)
        })
    }

    appJsLines.push(`function App() {`);
    appJsLines.push(`   return (`);
    appJsLines.push(`       <div className='App'>`);

    if (routingRequired) {
        appJsLines.push(`           <BrowserRouter>`);
    }

    //generate context tags
    if (contextFiles && contextFiles.length > 0) {
        contextFiles.forEach(el => {
            let name = el.description.substring(0, el.description.lastIndexOf('.'));
            let contextName = name.toLowerCase().indexOf('context') > 0 ? name : name + 'Context';
            appJsLines.push(`               <${contextName}Provider>`)
        })
    }

    //navigation component
    if (navigationComponent.id > -1) {
        let compName = navigationComponent.description.substring(0, navigationComponent.description.lastIndexOf('.'));
        appJsLines.push(`                   <${compName} />`)
    }

    if (routingRequired) {
        appJsLines.push(`                   <Switch>`);
    }

    //create routed for the routed components
    if (routedComponents && routedComponents.length > 0) {
        routedComponents.forEach(comp => {
            let compName = comp.description.substring(0, comp.description.lastIndexOf('.'))
            appJsLines.push(`                       <Route exact path='/${compName.toLowerCase()}' component={${compName}} />`)
        })
    }

    if (routingRequired) {
        appJsLines.push(`                   </Switch>`);
    }

    //close context tags
    if (contextFiles && contextFiles.length > 0) {
        contextFiles.reverse().forEach(el => {
            let name = el.description.substring(0, el.description.lastIndexOf('.'));
            let contextName = name.toLowerCase().indexOf('context') > 0 ? name : name + 'Context';
            appJsLines.push(`               </${contextName}Provider>`)
        })
    }

    if (routingRequired) {
        appJsLines.push(`           </BrowserRouter>`);
    }

    appJsLines.push(`       </div>`);
    appJsLines.push(`   );`);
    appJsLines.push(`}`);
    appJsLines.push(`\\n`);
    appJsLines.push(`export default App;`);

    // console.log('appJsLines', appJsLines);
    return (appJsLines.join('\\n'));
}

//generate current file full path
const getPathWithParentInfo = (componentTreeFolders, currentNode, fullpath = '') => {
    if (currentNode && componentTreeFolders.find(x => x.id === currentNode.parentId)) {
        fullpath = '/' + currentNode.description + fullpath;
        return getPathWithParentInfo(componentTreeFolders, componentTreeFolders.find(x => x.id === currentNode.parentId), fullpath)
    } else {
        return fullpath;
    }
}

//Generate content for Components, contexts or empty files.
const getJSFileContent = (el) => {
    let name = el.description.substring(0, el.description.lastIndexOf('.'));
    switch (el.propertyType) {
        case suggestions.functionalComponent:
            return (
                `import React from 'react';\\n\\nfunction ${name}() {\\n    return (\\n     <div>\\n            <h1>${name} Component</h1>\\n     </div>\\n   )\\n}\\n\\nexport default ${name};`
            );
        case suggestions.classComponent:
            return (
                `import React from 'react';\\n\\nexport default class ${name} extends React.Component {\\n  constructor(props) {\\n     super(props);\\n        this.state = {};\\n }\\n\\n render() {\\n       return (\\n         <div>\\n                <h1>${name} Component</h1>\\n           </div>\\n       );\\n   }\\n}`
            );
        case suggestions.contextFile:
            let contextName = name.toLowerCase().indexOf('context') > 0 ? name : name + 'Context';
            return (
                `import React, { createContext } from 'react';\\n\\nexport const ${contextName} = createContext();\\n\\nexport const ${contextName}Provider = props => {\\n    return (\\n        <${contextName}.Provider>\\n            {props.children}\\n        </${contextName}.Provider>\\n    )\\n}`
            )
        default:
            return (' ');
    }
}