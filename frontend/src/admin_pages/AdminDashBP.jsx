import AdminDashBPForm from "../admin_components/AdminDashBPForm";
import { useDashboard } from '../DashboardContext';


function AdminDashBP() {
  const { businessPermit, topRegions, topProvinces, topCities, revenue, totalBP } = useDashboard();

  return (
    <AdminDashBPForm 
    revenue={revenue}
    totalBP={totalBP}
    businessPermit={businessPermit}
    topRegions={topRegions}
    topProvinces={topProvinces}
    topCities={topCities}
    />
  );
}

export default AdminDashBP;