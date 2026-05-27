import React from "react";
import AuthCard from "../_components/auth_card";
import SignIn from "../_components/signin";

type Props = {};

const SigninPage = (props: Props) => {
  return (
    <AuthCard
      title="Login to your account"
      description="Enter your email below to login to your account"
    >
      <SignIn />
    </AuthCard>
  );
};

export default SigninPage;
