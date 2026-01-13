import SignUp from "@/components/Auth/SignUp";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access | click.aiesec.my",
};

const SignupPage = () => {
  return (
    <>
      <Breadcrumb pageName="Access by invitation only" />

      <SignUp />
    </>
  );
};

export default SignupPage;
