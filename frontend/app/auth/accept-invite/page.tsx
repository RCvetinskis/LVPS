import { getUserByInvitationTOken } from "@/services/user-services";
import AuthCard from "../_components/auth_card";
import AcceptInvitation from "../_components/acceptInvitation";

type Props = {
  searchParams: Promise<{
    token: string;
  }>;
};

const AcceptInvitePage = async (props: Props) => {
  const params = await props.searchParams;
  const user = await getUserByInvitationTOken(params.token);

  if (!user) return <div>No user found</div>;
  console.log(user);
  return (
    <AuthCard
      title="You have received invitation to join company"
      description="Enter your password below to login to your account"
      email={user?.email}
    >
      <AcceptInvitation
        email={user?.email}
        invitationToken={user.invitation_token ?? ""}
      />
    </AuthCard>
  );
};

export default AcceptInvitePage;
