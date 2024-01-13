import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useLocation } from 'react-router-dom'; // Import useLocation from react-router-dom
import AdminSidebar from '../admin_partials/AdminSidebar';
import AdminHeader from '../admin_partials/AdminHeader';
import AdminFooter from '../admin_partials/AdminFooter';

import AdminRPView from '../admin_partials/admin_modals/AdminRPView';
import AdminRPExpired from '../admin_partials/admin_modals/AdminRPExpired';
import AdminRPProcess from '../admin_partials/admin_modals/AdminRPProcess';
import AdminRPReject from '../admin_partials/admin_modals/AdminRPReject';
import AdminRPDone from '../admin_partials/admin_modals/AdminRPDone';

import AdminRPTaxRequests from '../admin_partials/admin_cards/AdminRPTaxRequests';
import AdminRPTaxProcessing from '../admin_partials/admin_cards/AdminRPTaxProcessing';



const AdminRPTaxForm =()=>{
  
  const location = useLocation();
  const { pathname, state } = location;
  console.log("pathname", pathname);
  const admin_type = pathname.split("/")[2];

  console.log("userrole", admin_type)

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logoSrc = '../src/images/mnl_footer.svg';

  
  const [taxPayment, setTaxPayment] = useState([]);
  const [taxClearance, setTaxClearance] = useState([]);


  // DITO AKO NAG API REQUEST, AND KUNG MAKIKITA NIYO SA SERVER SIDE NG ADMINRPTAX, DALAWANG QUERY YUN AND INISTORE KO SA DALAWANG VARIABLE
  useEffect(() => {
    const fetchUserTransaction = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/adminrptax/`);
        setTaxPayment(res.data.taxpayment); // DITO KO NA SILA PINAGHIWALAY, ITO YUNG PANG PAYMENT
        setTaxClearance(res.data.taxclearance); // ITO YUNG PANG CLEARANCE
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserTransaction();
  }, []);

  

  

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
              <h1 className="font-medium text-center text-slate-700 dark:text-white">Real Property Tax</h1>
              <h1 className="mb-7 text-sm italic text-center text-slate-700 dark:text-gray-300">Transactions</h1>

              <div className="flex items-center justify-center space-x-6 text-xs">
                <div className="flex items-center">
                  <div className="w-4 h-1 mr-2 bg-blue-500"></div>
                  <p className="text-slate-700 dark:text-white">Tax Clearance</p>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-1 mr-2 bg-[#0057e7]"></div>
                  <p className="text-slate-700 dark:text-white">Tax Payment</p>
                </div>
              </div>
            </div>
          </div>

          {/*  Two Sections */}
          <div className="grid grid-cols-12 gap-4 mx-4 my-4">
            
            {/* THEN ITO YUNG COMPONENT NG REQUEST SECTION, IPINASA KO DITO YUNG VALUES NA NAKUHA KO SA API REQUEST */}
            <AdminRPTaxRequests
            taxPayment={taxPayment}
            taxClearance={taxClearance}
            />
            <AdminRPTaxProcessing
            // handleOpenModal={handleOpenModal}
            />

          </div>

          <AdminFooter logo={logoSrc} />
        </main>
        
      </div>
    </div>
  );
}

export default AdminRPTaxForm;