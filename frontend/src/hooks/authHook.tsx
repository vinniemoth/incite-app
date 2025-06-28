import { useRouter } from "next/navigation";

export default function authHook() {
  const router = useRouter();
  const token = localStorage.getItem("authToken");

  if (!token) {
    router.push("/");
  } else {
    return token;
  }
}
