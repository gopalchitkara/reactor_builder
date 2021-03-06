export const initState = {
    projectName: 'my_app',
    environment: 'create-react-app',
    buildTool: 'npx',
    // targetTerminal: 'vsCodePowershell',
    targetTerminal: 'windowsCmd',
    packages: ['react-router-dom'],
    routingRequired: false,
    cleanupRequired: false,
    navigationComponent: { id: -1 },
    routedComponents: [],
    appStructure: [
        { id: 1, description: 'my_app', type: 'folder' },
        { id: 2, description: 'node_modules', type: 'folder', parentId: 1 },
        { id: 3, description: 'public', type: 'folder', parentId: 1 },
        { id: 5, description: '.gitignore', type: 'file', parentId: 1 },
        { id: 6, description: 'package.json', type: 'file', parentId: 1 },
        { id: 7, description: 'package-lock.json', type: 'file', parentId: 1 },
        { id: 8, description: 'README.md', type: 'file', parentId: 1 },
        { id: 9, description: 'App.css', type: 'file', parentId: 4 },
        { id: 10, description: 'App.js', type: 'file', parentId: 4 },
        { id: 11, description: 'App.test.js', type: 'file', parentId: 4 },
        { id: 12, description: 'index.css', type: 'file', parentId: 4 },
        { id: 13, description: 'index.js', type: 'file', parentId: 4 },
        { id: 14, description: 'logo.svg', type: 'file', parentId: 4 },
        { id: 15, description: 'serviceWorker.js', type: 'file', parentId: 4 },
        { id: 16, description: 'setupTests.js', type: 'file', parentId: 4 },
    ],
    appStructureClean: [
        { id: 1, description: 'my_app', type: 'folder' },
        { id: 2, description: 'node_modules', type: 'folder', parentId: 1 },
        { id: 3, description: 'public', type: 'folder', parentId: 1 },
        { id: 5, description: '.gitignore', type: 'file', parentId: 1 },
        { id: 6, description: 'package.json', type: 'file', parentId: 1 },
        { id: 7, description: 'package-lock.json', type: 'file', parentId: 1 },
        { id: 8, description: 'README.md', type: 'file', parentId: 1 },
        { id: 10, description: 'App.js', type: 'file', parentId: 4 },
        { id: 12, description: 'index.css', type: 'file', parentId: 4 },
        { id: 13, description: 'index.js', type: 'file', parentId: 4 },
        { id: 15, description: 'serviceWorker.js', type: 'file', parentId: 4 },
    ],
    componentTree: [
        { id: 4, description: "src", type: "folder", parentId: 1 },
        { id: 41, description: "components", type: "folder", parentId: 4 },
        { id: 411, description: "navigation", type: "folder", parentId: 41 },
        { id: 4111, description: "Navbar.js", type: "file", propertyType: "FunctionalComponent", parentId: 411 },
    ],
}