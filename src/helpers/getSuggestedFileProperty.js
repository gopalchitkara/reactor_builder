import { suggestions } from '../constants/constants';

const checkNameOfAllParents = (componentTree, parentId, compareTo) => {
    if (componentTree.find(x => x.id === parentId && x.type === 'folder' && (x.description.toLowerCase().includes(compareTo)))) {
        return true;
    } else if (parentId && parentId !== 4) {
        return checkNameOfAllParents(componentTree, componentTree.find(x => x.id === parentId).parentId, compareTo);
    }
    return false;
}

export const getSuggestedFileProperty = ({ componentTree, fileName, parentId }) => {
    console.log(fileName, parentId);
    if (fileName !== '') {
        if (fileName.toLowerCase().indexOf('context') > 0) {
            return suggestions.contextFile;
        } else if (checkNameOfAllParents(componentTree, parentId, 'context')) {
            return suggestions.contextFile;
        } else if (checkNameOfAllParents(componentTree, parentId, 'component')) {
            return suggestions.functionalComponent;
        }
    }
    return suggestions.emptyFile;
}