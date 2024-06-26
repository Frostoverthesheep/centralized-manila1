import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useParams } from 'react-router-dom'; // Import useLocation from react-router-dom
import AdminSidebar from '../admin_partials/AdminSidebar';
import AdminHeader from '../admin_partials/AdminHeader';
import AdminFooter from '../admin_partials/AdminFooter';

import AdminAllArchives from '../admin_partials/admin_cards/AdminAllArchives';


const AdminArchivesForm = () => {

  const { admin_type, admin_uname } = useParams();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  

  const [taxPayment, setTaxPayment] = useState([]);
  const [taxClearance, setTaxClearance] = useState([]);
  const [businessPermit, setBusinessPermit] = useState([]);
  const [businessData, setBusinessData] = useState([]);
  const [busOffice, setBusOffice] = useState(null);
  const [ctcCedula, setctcCedula] = useState([]);
  const [birthCert, setBirthCert] = useState([]);
  const [deathCert, setDeathCert] = useState([]);
  const [marriageCert, setMarriageCert] = useState([]);
  const [fetchData, setIsFetchedData] = useState(false)
  const [Reload, setReload] = useState(true)

  const Base_Url = process.env.Base_Url;

  // console.log("userrole", admin_type)
  useEffect(() => {
    const token = localStorage.getItem('Admin_token');
    
    const checkToken = async (token) => {
      try{
            const response = await axios.get(`${Base_Url}admintoken/protect-token-admin/${admin_type}/${admin_uname}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const adminType = response.data.admin_type;
            const tokenType = response.data.tokenAdmin;

            if (adminType === tokenType) {
                setReload(false);
            } else {
                window.location.href = '/indexadmin';
            }
          }catch{
            window.location.href = `/indexadmin`;
          }
    };

    if (token) {
        checkToken(token);
    } else {
        // Redirect to indexadmin if token is not present
        window.location.href = '/indexadmin';
    }
}, []);

  const fetchUserTransaction = async (endpoint) => {
    try {
      const res = await axios.get(`${Base_Url}adminarchives/${endpoint}`);
      console.log('Response:', res.data);
  
      switch (endpoint) {
        case 'rptax':
          setTaxPayment(res.data.taxpayment);
          setTaxClearance(res.data.taxclearance);
          break;
        case 'buspermit':
          const { businesspermit, businesspermit1 } = res.data;
          const busOfficeArray = [];
          const businessDataArray = [];
  
          Object.keys(businesspermit1).forEach(transactionId => {
            const busOffice = businesspermit1[transactionId].bus_office;
            const busActivity = businesspermit1[transactionId].bus_activity;
  
            busOfficeArray.push({ transaction_id: transactionId, bus_office: busOffice });
            businessDataArray.push({ transaction_id: transactionId, ...busActivity });
          });
  
          setBusinessPermit(businesspermit);
          setBusOffice(busOfficeArray);
          setBusinessData(businessDataArray);
          break;
        case 'cedulacert':
          setctcCedula(res.data.cedulacert);
          break;
        case 'lcr':
          setBirthCert(res.data.birthcert);
          setDeathCert(res.data.deathcert);
          setMarriageCert(res.data.marriagecert);
          break;
        default:
          break;
      }
  
      setIsFetchedData(true);
    } catch (err) {
      console.log('Fetch error:', err);
    }
  };
  
  const handleUpdateData = () => {
    fetchUserTransaction();
  };
  
  useEffect(() => {
    fetchUserTransaction('rptax');
    fetchUserTransaction('buspermit');
    fetchUserTransaction('cedulacert');
    fetchUserTransaction('lcr');
  }, []);
  

if(Reload){
  return;
}
  

  return (
    <div className="flex h-screen overflow-hidden dark:bg-[#212121]">

      {/* AdminSidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/*  Contents Area */}
        <main className="overflow-y-auto">
          {/*  Banner */}
          <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-[#2b2b2b] dark:border-[#3d3d3d] shadow-sm rounded-sm border border-slate-200 mx-4 my-4">
            <div className="px-5 py-5">
              <h1 className="font-medium text-center text-slate-700 dark:text-white">Archives</h1>
              <h1 className="mb-7 text-sm italic text-center text-slate-700 dark:text-gray-300">Transactions</h1>

              <div className="flex items-center justify-center space-x-6 text-xs">
                {admin_type === 'rptax_admin' && (
                  <>
                  <div className="flex items-center">
                    <div className="w-4 h-1 mr-2 bg-blue-500"></div>
                    <p className="text-slate-700 dark:text-white">Tax Clearance</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-1 mr-2 bg-[#0057e7]"></div>
                    <p className="text-slate-700 dark:text-white">Tax Payment</p>
                  </div>
                  </>
                )}
                {admin_type === 'business_admin' && (
                  <div className="flex items-center">
                    <div className="w-4 h-1 mr-2 bg-[#d62d20]"></div>
                    <p className="text-slate-700 dark:text-white">Business Permit</p>
                  </div>
                )}
                {admin_type === 'cedula_admin' && (
                  <div className="flex items-center">
                    <div className="w-4 h-1 mr-2 bg-[#ffa700]"></div>
                    <p className="text-slate-700 dark:text-white">CTC/Cedula</p>
                  </div>
                )}
                {admin_type === 'lcr_admin' && (
                  <>
                  <div className="flex items-center">
                    <div className="w-4 h-1 mr-2 bg-[#008744] dark:bg-[#026b37]"></div>
                    <p className="text-slate-700 dark:text-white">Birth Certificate</p>
                  </div>
                
                  <div className="flex items-center">
                    <div className="w-4 h-1 mr-2 bg-[#17bf6c]"></div>
                    <p className="text-slate-700 dark:text-white">Death Certificate</p>
                  </div>
                
                  <div className="flex items-center">
                    <div className="w-4 h-1 mr-2 bg-[#78ffbc]"></div>
                    <p className="text-slate-700 dark:text-white">Marriage Certificate</p>
                  </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/*  Two Sections */}
          <div className="grid grid-cols-1 gap-4 mx-4 my-4">
            <AdminAllArchives
            taxPayment={taxPayment}
            taxClearance={taxClearance}
            busOffice={busOffice}
            businessData={businessData}
            businessPermit = {businessPermit}
            ctcCedula={ctcCedula} 
            birthCert={birthCert}
            deathCert={deathCert}
            marriageCert={marriageCert}
            handleUpdateData={handleUpdateData}
            />

          </div>

          <AdminFooter />
        </main>
        
      </div>
    </div>
  );
}

export default AdminArchivesForm;