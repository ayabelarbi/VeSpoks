import {Login} from "./Login";

interface LoginVerify extends Login {
    otp: string
}

export type { LoginVerify };
