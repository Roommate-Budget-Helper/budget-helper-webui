import type { NextPage } from "next";
import React, { useState } from "react";
import FieldInput from "@components/fieldinput";
import Button from "@components/button";
import Head from "next/head";

const ForgotPasswordPage: NextPage = () => {
    const [email, setEmail] = useState<string>("");
    return (
        <>
            <Head>
                <title>RBH Forgot Password</title>
                <meta
                    name="description"
                    content="Forgot Password page of Roommate Budget Helper"
                />
            </Head>
            <div className="body flex flex-col text-center">
                <div className="headertext-center pt-4">
                    <h1 className="text-5xl font-bold text-evergreen-100">
                        Forgot Password?
                    </h1>
                    <p className="text-xl py-4 font-light">
                        Forgot your password? No worries, we can help you out!
                    </p>
                </div>
            </div>
            <div className="form-area flex flex-col justify-between items-center ">
                <FieldInput
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    placeholder="Email"
                />
                <div className="py-5"></div>
                <Button
                    classNames="bg-evergreen-80 text-dorian"
                    value="Send Email Notification"
                    type="button"
                />
            </div>
        </>
    );
};

export default ForgotPasswordPage;
