import AuthCard from "../_components/auth_card";
import SignUp from "../_components/signup";

type Props = {};

const SigninPage = (props: Props) => {
  return (
    <AuthCard
      title="Register to LVPS"
      description="Enter your email and other data to register to LVPS"
    >
      <SignUp />
    </AuthCard>
  );
};

export default SigninPage;
