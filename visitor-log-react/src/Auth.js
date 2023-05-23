import useLogin from "hooks/useLogin";
import pb from "lib/pocketbase";
import {useForm} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Auth() {
    const {register, handleSubmit, reset} = useForm();
    const {mutate: login, isLoading, error} = useLogin();
    const isLoggedIn = pb.authStore.isValid;
    let navigate = useNavigate();

    async function onSubmit(data) {
        login({email: data.email, password: data.password});
        reset();
    }

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/home")
        }
    },[isLoggedIn, navigate])

    return (
    <>
        {isLoading && <p>Loading...</p>}
        {String(error).includes("ClientResponseError 0") && <p style={{color: "red"}}>Database not reachable! Check your internet connection or report outage to developers.</p>}
        {String(error).includes("Failed to authenticate.") && <p style={{color: "red"}}>Invalid email or password.</p>}
        <h1>Please Log In</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="email" placeholder="email" {...register("email")}/>
            <input type="password" placeholder="password"{...register("password")}/>

            <button type="submit" disabled={isLoading}>{isLoading ? "Loading" : "Login"}</button>
        </form>
    </>
    );
}