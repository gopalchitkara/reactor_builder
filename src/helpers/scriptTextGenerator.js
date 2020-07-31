export const generateScriptText = ({ projectName, buildTool, packages, fileName }) => {

    var dependencies = packages.join(' ');

    if (buildTool === "yarn") {
        return (`yarn create react-app ${projectName} && cd ${projectName} && yarn add ${dependencies} && cd .. && node ${fileName}.js`);
    } else {
        if (packages.length <= 0) {
            return (`npx create-react-app ${projectName} && cd ${projectName} && cd .. && node ${fileName}.js`);
        }
        return (`npx create-react-app ${projectName} && cd ${projectName} && npm install ${dependencies} && cd .. && node ${fileName}.js`);
    }
}