type Props = {
  children: React.ReactNode;
};
const AuthPage = ({ children }: Props) => {
  return (
    <div className="flex flex-1  justify-center items-center">{children}</div>
  );
};

export default AuthPage;
