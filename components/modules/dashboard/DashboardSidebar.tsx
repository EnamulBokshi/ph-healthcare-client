import { getDefaultDashboardRoute } from '@/lib/authUtils';
import { navItemsByRole } from '@/lib/navItems';
import { getUserInfo } from '@/services/auth.services';
import { NavSection } from '@/types/dashboard.types';
import DashbordSidebarContent from './DashbordSidebarContent';


 const DashboardSidebar = async() => {

  const userInfo = await getUserInfo();
  const navItems: NavSection[] = navItemsByRole(userInfo?.role);

  const dashboardHome = getDefaultDashboardRoute(userInfo?.role);

  return (
    <DashbordSidebarContent userInfo={userInfo} navItems={navItems} dashboardHome={dashboardHome}/>
  )
}


export default DashboardSidebar;
