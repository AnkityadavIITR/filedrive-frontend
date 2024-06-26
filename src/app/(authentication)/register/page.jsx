"use client";
import React, { useState } from "react";
import { auth, provider } from "@/config/firebase";
import { FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { signInWithPopup } from "firebase/auth";
import { useToast } from "@/components/ui/use-toast";
import { setLocalStorage } from "@/lib/utils";
import Link from "next/link";
import Form from "@/components/auth/signupForm";
import { createUserWithEmail } from "../../../services/createuserwithemailandpassword";
import { useRouter } from "next/navigation";
import useAuth from "@/context/useAuth";
import useRegister from "@/context/useRegister";

const SignUpPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { setCurrentUser, currentUser } = useAuth();
  const { setUserName } = useRegister();

  const router = useRouter();
  const [showEmailModal, setShowEmailModal] = useState(false);

  const signInWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const { user } = userCredential;
      // const { email, uid, displayName, photoURL } = user;
      console.log("user from register", user);
      toast({
        title: "success",
        description: "logged in",
      });
      setLocalStorage("token", user.accessToken);
      setCurrentUser(user);
      router.replace("/dashboard");
    } catch (error) {
      console.log(error);
      toast({
        title: "error",
        description: "logged in",
      });
    }
  };

  const handleEmailRegistration = async (name, email, password, setLoading) => {
    console.log(name, email, password);
    try {
      const response = await createUserWithEmail(
        email,
        password,
        setLoading,
        setCurrentUser
      );
      if (response) {
        const userRegister = {
          name: name,
          email: email,
        };
        console.log(userRegister);
        localStorage.setItem("userRegistration", JSON.stringify(userRegister));
        setUserName(name);
        router.replace("/dashboard");
      } else {
        toast({
          title: "error",
          variant: "destructive",
          description: "Your account is not created, try again",
        });
        setLoading(false);
      }
    } catch (e) {
      toast({
        title: "error",
        variant: "destructive",
        description: "Your account is not created, try again",
      });
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="w-[90%] md:w-[400px] p-4 flex-col border rounded-md justify-center border-gray-600 shadow-md">
        <h1 className="text-[24px] text-semibold">Create an account</h1>
        <h2 className="text-[14px] text-gray-500 text-md mt-2">
          Enter your email below to create your account
        </h2>
        <div className="flex justify-between items-center gap-2 mt-3">
          <Button onClick={signInWithGoogle} className="w-full">
            <FaGoogle className="mr-2 h-4 w-4" /> SignUp with Google
          </Button>
        </div>

        <div className="flex w-full justify-center mt-3 gap-x-1">
          <hr className="h-px my-3 bg-slate-400 border-0 dark:bg-gray-700 w-2/5" />
          <p>OR</p>
          <hr className="h-px my-3 bg-slate-400 border-0 dark:bg-gray-700 w-2/5" />
        </div>

        <Form
          onSubmit={handleEmailRegistration}
          loading={loading}
          setLoading={setLoading}
        />
        <div className=" flex justify-end gap-x-1">
          <p className="text-[14px] text-gray-500 text-md">
            already signed in ?
          </p>

          <Link
            href={"/login"}
            className="text-[14px] text-md text-blue-500 hover:underline"
          >
            login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
