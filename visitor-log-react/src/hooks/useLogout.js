import pb from "lib/pocketbase";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

export default function useLogout() {
    const qc = useQueryClient();
    let navigate = useNavigate();
    function logout() {
        qc.clear()
        qc.removeQueries()
        pb.authStore.clear();
        pb.collection("visitors").unsubscribe("*")
        navigate("/")
    }

    return logout
}