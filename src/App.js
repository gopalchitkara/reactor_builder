import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './components/app/Home';
import FolderStructure from './components/app/FolderStructure';
import GenerateScript from './components/app/GenerateScript';
import AreYouLost from './components/navigation/AreYouLost';
import { GlobalStateContextProvider } from './contexts/GlobalStateContext';
import FileProperties from './components/app/FileProperties';
import { isMobile } from "react-device-detect";
import { LoadingOutlined } from '@ant-design/icons'

function App() {
    const [checkingDevice, setCheckingDevice] = useState(true);
    const [isDeviceMobile, setIsDeviceMobile] = useState(false);

    useEffect(() => {
        setIsDeviceMobile(isMobile);
        setCheckingDevice(false);
    }, [])

    return (
        <div className="App">
            {checkingDevice ? (
                <div style={{ display: "flex", marginTop: 200 }}>
                    <LoadingOutlined style={{ fontSize: "3rem", display: "inline-block", marginLeft: "auto", marginRight: "auto" }} />
                </div>
            ) : (
                    <BrowserRouter>
                        <GlobalStateContextProvider>
                            <Switch>
                                <Route exact path="/" component={() => <Home isMobile={isDeviceMobile} />} />
                                <Route exact path="/folderstructure" component={() => <FolderStructure isMobile={isDeviceMobile} />} />
                                <Route exact path="/fileproperties" component={() => <FileProperties isMobile={isDeviceMobile} />} />
                                <Route exact path="/generatescript" component={() => <GenerateScript isMobile={isDeviceMobile} />} />
                                <Route path="*" component={AreYouLost} />
                            </Switch>
                        </GlobalStateContextProvider >
                    </BrowserRouter >
                )
            }
        </div >
    );
}

export default App;
