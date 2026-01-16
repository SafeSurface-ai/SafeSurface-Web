import { App as AntApp } from "antd";

import Router from "./router";

export default function App() {
    return (
        <AntApp>
            <Router />
        </AntApp>
    );
}