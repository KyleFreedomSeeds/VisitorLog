import React from "react";
import ReactDOM from "react-dom/client"
import Auth from "Auth";
import Home from "Home";
import { QueryClientProvider, QueryClient } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient();

export default function App() {
    return (
        <>
        <BrowserRouter>
            <Routes>
                <Route index element={<Auth />}></Route>
                <Route path="/home" element={<Home />}></Route>
            </Routes>
        </BrowserRouter>
        </>
    );
}

root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </React.StrictMode>
);