import { getDefaultDashboardRoute } from '@/lib/authUtils';
import { navItemsByRole } from '@/lib/navItems';
import { getUserInfo } from '@/services/auth.services';
import { NavSection } from '@/types/dashboard.types';

import DashboardNavbarContent from './DashboardNavbarContent';

async function DashboardNavbar() {
    const userInfo = await getUserInfo();
    const navItems: NavSection[] = navItemsByRole(userInfo?.role);
  
    const dashboardHome = getDefaultDashboardRoute(userInfo?.role);
  
  return (
    <DashboardNavbarContent userInfo={userInfo} navItems={navItems} dashboardHome={dashboardHome} />
  )
}

export default DashboardNavbar