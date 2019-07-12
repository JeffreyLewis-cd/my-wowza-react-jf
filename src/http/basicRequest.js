import baseMethods from "./baseMethods";
import md5 from "md5";


let basicRequest = {};

let loginAuth = 'Digest username="admin", realm="Wowza", nonce="MTU1OTExMjA3NDE3NzoxODQzZmZjOTdmNjllMzc5MTkwMjk3MmE2ZjY4YWYwYQ==", uri="/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications", algorithm=MD5, response="27da854cc7022c2314fbd9afc8c44902", qop=auth, nc=00000002, cnonce="56993b7c00f965c6"'

const headers = {
    "Accept": "application/json; charset=utf-8",
    "Content-Type": "application/json; charset=utf-8",
};

/*获取 IncomingStreams list*/
basicRequest.getIncomingStreams = (activeId) => {
    let activeStream = activeId + "/instances/_definst_";
    let url02 = baseMethods.wowzaURL +
        ":8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/" + activeStream;

    return new Promise((resolve, reject) => {
        baseMethods.get(url02, headers).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
};

/*获取 allApps list*/
basicRequest.getAllApps = () => {
    let url = baseMethods.wowzaURL + ':8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications';

    return new Promise((resolve, reject) => {
        baseMethods.get(url, headers).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
};

/*添加应用*/
basicRequest.addApp = (addApp_param) => {
    let app_name = addApp_param.appName;
    let app_type = addApp_param.appType;

    let param_a = {
        "restURI": baseMethods.wowzaURL + ":8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/" + app_name,
        "name": app_name,
        "appType": 'Live',
        "clientStreamReadAccess": "*",
        "clientStreamWriteAccess": "*",
        "httpCORSHeadersEnabled": "true",
        "_httpCORSHeadersEnabled": "on",
        "description": "A basic " + app_type + " application",
        "streamConfig": {
            "restURI": baseMethods.wowzaURL + ":8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/" + app_name + "/streamconfiguration",
            "streamType": app_type,
            "liveStreamPacketizer": [
                "cupertinostreamingpacketizer",
                "smoothstreamingpacketizer",
                "sanjosestreamingpacketizer"
            ]
        },
        "securityConfig": {
            "restURI": baseMethods.wowzaURL + ":8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/testlive/security",
            "secureTokenVersion": 0,
            "clientStreamWriteAccess": "*",
            "publishRequirePassword": false,
            "publishPasswordFile": "",
            "publishRTMPSecureURL": "",
            "publishIPBlackList": "",
            "publishIPWhiteList": "",
            "publishBlockDuplicateStreamNames": false,
            "publishValidEncoders": "",
            "publishAuthenticationMethod": "none",  //digest
            "playMaximumConnections": 0,
            "playRequireSecureConnection": false,
            "secureTokenSharedSecret": "",
            "secureTokenUseTEAForRTMP": false,
            "secureTokenIncludeClientIPInHash": false,
            "secureTokenHashAlgorithm": "",
            "secureTokenQueryParametersPrefix": "",
            "secureTokenOriginSharedSecret": "",
            "playIPBlackList": "",
            "playIPWhiteList": "",
            "playAuthenticationMethod": "none"
        },
        "modules": {
            "restURI": baseMethods.wowzaURL + ":8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/testlive/modules",
            "moduleList": [{
                "order": 0,
                "name": "base",
                "description": "Base",
                "class": "com.wowza.wms.module.ModuleCore"
            }, {
                "order": 1,
                "name": "logging",
                "description": "Client Logging",
                "class": "com.wowza.wms.module.ModuleClientLogging"
            }, {
                "order": 2,
                "name": "flvplayback",
                "description": "FLVPlayback",
                "class": "com.wowza.wms.module.ModuleFLVPlayback"
            }, {
                "order": 3,
                "name": "ModuleCoreSecurity",
                "description": "Core Security Module for Applications",
                "class": "com.wowza.wms.security.ModuleCoreSecurity"
            }]
        }


    };

    let param_b = {
        "restURI": baseMethods.wowzaURL + ":8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/" + app_name,
        "name": app_name,
        "appType": app_type,
        "clientStreamReadAccess": "*",
        "clientStreamWriteAccess": "*",
        "description": "A basic " + app_type + " application",
    };
    let param = param_a;
    if ('live' !== app_type) {
        param = param_b;
    }

    let url02 = baseMethods.wowzaURL +
        ":8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/" + app_name;

    return new Promise((resolve, reject) => {
        baseMethods.post(url02, param, headers).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
};

/*创建流文件*/
basicRequest.addStream = (streamParam) => {
    let param = {
        "name": streamParam.streamName,
        "serverName": "_defaultServer_",
        "uri": "udp://1.2.3.4:10000"
    };
    let url02 = baseMethods.wowzaURL +
        ":8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/" +
        streamParam.appName + "/streamfiles";

    return new Promise((resolve, reject) => {
        baseMethods.post(url02, param, headers).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
};

/*删除流文件*/
basicRequest.deleteStream = (streamParam) => {
    let url = baseMethods.wowzaURL +
        ":8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/" +
        streamParam.app +
        "/streamfiles/" +
        streamParam.streamname;

    return new Promise((resolve, reject) => {
        baseMethods.delete(url, "", headers).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
};

/*获取流文件列表*/
basicRequest.getStreamList = (streamParam) => {
    let url02 = baseMethods.wowzaURL +
        ":8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/" +
        streamParam.appName + "/streamfiles";

    return new Promise((resolve, reject) => {
        baseMethods.get(url02, headers).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
};

/*连接流文件*/
basicRequest.connectStream = (streamParam) => {
    let connectURL = baseMethods.wowzaURL +
        ":8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/streamfiles/" +
        streamParam.streamname +
        "/actions/connect?connectAppName=" +
        streamParam.app +
        "&appInstance=_definst_&mediaCasterType=rtp";

    return new Promise((resolve, reject) => {
        baseMethods.put(connectURL, '', headers).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
};

/*断开某个流文件连接*/
basicRequest.disconnectStream = (streamParam) => {
    let disConnectURL = baseMethods.wowzaURL +
        ':8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/' +
        streamParam.app +
        '/instances/_definst_/incomingstreams/' +
        streamParam.streamname +
        '/actions/disconnectStream';

    return new Promise((resolve, reject) => {
        baseMethods.put(disConnectURL, '', headers).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })

};

/*录制直播流-停止*/
basicRequest.recordLiveStream = (recordParam) => {
    let url = baseMethods.wowzaURL +
        `:8086/livestreamrecord?` +
        `app=${recordParam.app}` +
        `&streamname=${recordParam.streamname}` +
        `&action=${recordParam.action}`;

    console.log('录制地址-101');
    console.log(url);
    return new Promise((resolve, reject) => {
        baseMethods.get(url, headers).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
};

/*开始录制直播流*/
basicRequest.startRecordStream = (startParam) => {
    let param = {
        "instanceName": "",
        "fileVersionDelegateName": "",
        "serverName": "",
        "recorderName": startParam.streamName,
        "currentSize": 0,
        "segmentSchedule": "",
        "startOnKeyFrame": true,
        "outputPath": "",
        "currentFile": "",
        "saveFieldList": [
            ""
        ],
        "recordData": false,
        "applicationName": "",
        "moveFirstVideoFrameToZero": false,
        "recorderErrorString": "",
        "segmentSize": 0,
        "defaultRecorder": false,
        "splitOnTcDiscontinuity": false,
        "version": "",
        "baseFile": "",
        "segmentDuration": 0,
        "recordingStartTime": "",
        "fileTemplate": "",
        "backBufferTime": 0,
        "segmentationType": "",
        "currentDuration": 0,
        "fileFormat": "",
        "recorderState": "",
        "option": ""
    };
    let url02 = baseMethods.wowzaURL +
        ":8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/" +
        startParam.appName + "/instances/_definst_/streamrecorders/" + startParam.streamName;

    console.log('开始录制直播流');
    console.log(url02);
    console.log(startParam.appName);
    return new Promise((resolve, reject) => {
        baseMethods.post(url02, param, headers).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
};

/*停止一个应用*/
basicRequest.stopOneApp = (appParam) => {
    let stopOneAppURL = baseMethods.wowzaURL +
        ':8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/' +
        appParam.app +
        '/actions/stop';

    return new Promise((resolve, reject) => {
        baseMethods.put(stopOneAppURL, '', headers).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })

};

/*删除一个应用*/
basicRequest.deleteOneApp = (appParam) => {
    let deleteAppURL = baseMethods.wowzaURL +
        ":8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/" +
        appParam.app;

    return new Promise((resolve, reject) => {
        baseMethods.delete(deleteAppURL, '', headers).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })

};

/*获取应用的高级设置*/
basicRequest.appAdvancedSettings = (streamParam) => {
    let urlAdvanced = baseMethods.wowzaURL +
        ":8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/" +
        streamParam.app +
        "/adv";

    return new Promise((resolve, reject) => {
        baseMethods.get(urlAdvanced, headers).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
};

/*激活流文件转发功能*/
basicRequest.enableAppTarget = (streamParam) => {

    let enabelURL = baseMethods.wowzaURL +
        ":8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/" +
        streamParam.app +
        "/adv";

    return new Promise((resolve, reject) => {
        baseMethods.put(enabelURL, streamParam.enableParam, headers).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
};

/*重启应用*/
basicRequest.restartApp = (streamParam) => {
    let restartURL = baseMethods.wowzaURL +
        ":8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/" +
        streamParam.app +
        "/actions/restart";

    return new Promise((resolve, reject) => {
        baseMethods.put(restartURL, '', headers).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
};

/*获取stream targets*/
basicRequest.getAppStreamTargetList = (streamParam) => {
    let targetListURL = baseMethods.wowzaURL +
        ":8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/" +
        streamParam.app +
        "/pushpublish/mapentries";

    return new Promise((resolve, reject) => {
        baseMethods.get(targetListURL, headers).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
};


/*创建stream targets*/
basicRequest.addAppStreamTarget = (streamParam) => {
    let param = {
        "serverName": "_defaultServer_",
        "sourceStreamName": streamParam.sourceStreamName,
        "entryName": streamParam.entryName,
        "profile": "rtmp",
        "host": streamParam.host,
        "application": streamParam.application,
        "userName": streamParam.userName,
        "password": streamParam.password,
        "streamName": streamParam.entryName
    };

    let addURL = baseMethods.wowzaURL +
        ':8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/' +
        streamParam.app + '/pushpublish/mapentries/' + streamParam.entryName;

    return new Promise((resolve, reject) => {
        baseMethods.post(addURL, param, headers).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
};

/*删除stream targets*/
basicRequest.deleteAppStreamTarget = (streamParam) => {
    let deleteURL = baseMethods.wowzaURL +
        ":8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/" +
        streamParam.app +
        "/pushpublish/mapentries/" +
        streamParam.entryName;

    return new Promise((resolve, reject) => {
        baseMethods.delete(deleteURL, '', headers).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
};

/*登录四川经济统计平台*/
basicRequest.sichuan_login = () => {
    let param = {
        "name": "admin",
        "password": md5('admin'),
    };

    let addURL = "http://localhost:8080/SiChuanMarket_SSM/person/login";

    return new Promise((resolve, reject) => {
        baseMethods.post(addURL, param, headers).then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        })
    })
};


export default basicRequest;
