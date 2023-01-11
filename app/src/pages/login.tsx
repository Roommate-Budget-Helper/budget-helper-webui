import Button from "@components/button";
import { ClearableFieldInput, VisibilityFieldInput } from "@components/fieldinput";
import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import React, { useState } from "react";
import { signIn, useSession, signOut } from 'next-auth/react';

const LoginPage: NextPage = () => {
    const session = useSession();
    const [errorState, setError] = useState(false);

    const onLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = (event.target as HTMLFormElement);
        await signIn("credentials", {
            username: form.elements["username"].value,
            password: form.elements["password"].value,
            redirect: false
        }).then(res => {
            setError(!res?.ok);
        })
    }
    return (<>
        <Head>
            <title>RBH Login</title>
            <meta
                name="description"
                content="Login page of Roommate Budget Helper" />
        </Head>
        <div>  
            <pre>{JSON.stringify(session, null, 2)}</pre>
            <Button value="logout" onClick={() => {
                signOut();
            }}/>
        </div>
        <div className="body flex flex-col text-center">
            <div className="headertext-center pt-4">
                <h1 className="text-5xl font-bold text-evergreen-100">Welcome Back 👋</h1>
                <p className="text-xl font-light">We are excited to have you back but to get started please login!</p>
                {errorState&&<p className="text-xl font-light text-red-600">Invalid Login Details Provided. Please try again!</p>}
            </div>
            <form method="post" onSubmit={onLogin}>
                <div className="form-area flex flex-col justify-between items-center ">
                    <ClearableFieldInput
                        type="text"
                        name="username"
                        placeholder="Username or Email" />
                     <VisibilityFieldInput
                        name="password"
                        placeholder="Password" />
                    <Button
                        classNames="bg-evergreen-80 text-dorian"
                        value="Login"
                        type="submit" />
                
                </div>
            </form>
            <div className="divider flex items-center">
                <div className="bg-black h-px flex-grow"></div>
                <span className="bg-white px-4">Or Sign In With</span>
                <div className="bg-black h-px flex-grow"></div>
            </div>
            <div className="providers">
                <Button
                    classNames="bg-dorian text-black"
                    value="Google"
                    type="button" 
                    onClick={() => signIn("google")}/>
            </div>
            <div className="actions">
                <p>Don&apos;t have an account? &nbsp;
                    <Link href="register"> 
                        <a className="text-evergreen-80">Sign Up</a>
                    </Link>
                </p>
                <p>Forgot your password? &nbsp;
                    <Link href="forgot_password">
                        <a className="text-evergreen-80">
                            Reset
                        </a>
                     </Link>
                </p>
            </div>
        </div>
    </>);
};

export default LoginPage;