import Profile from "app/components/Pages/Profile";

export default function Page({ params }: { params: { userName: string } }) {
  return <Profile userNameProp={params.userName} />;
}
