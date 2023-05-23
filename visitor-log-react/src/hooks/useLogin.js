import pb from "lib/pocketbase";
import { useMutation } from "react-query";
import { checkOnline } from "lib/visitors";

export default function useLogin() {
    async function login({email, password}) {
        //if (checkOnline()) {
            await pb.collection("users").authWithPassword(email, password);
        //}
    }

    return useMutation(login);
}