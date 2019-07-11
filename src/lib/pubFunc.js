let pubFunc = {
    pathFunc() {
        let curRequestPath = window.document.location.href;
        let pathName = window.document.location.pathname;
        let ipAndPort = curRequestPath.indexOf(pathName);
        let localhostPath = curRequestPath.substring(0, ipAndPort);
        let projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        let basePath = localhostPath + projectName;
        let projectPath = {
            basePath_f: basePath,
            projectName_f: projectName,
            localhostPath_f: localhostPath,
        };
        return projectPath
    },
    getArrDifference(arr1, arr2) {
        return arr1.concat(arr2).filter(function (v, i, arr) {
            return arr.indexOf(v) === arr.lastIndexOf(v);
        });
    }
};


export default pubFunc;
