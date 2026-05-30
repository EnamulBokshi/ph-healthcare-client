import { getUserInfo } from "@/services/auth.services";
import PublicHeaderContent from "./PublicHeaderContent";

export default async function PublicHeader() {
  const userInfo = await getUserInfo();

  return <PublicHeaderContent userInfo={userInfo} />;
}
