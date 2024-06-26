import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

import AdminSidebar from '../admin_partials/AdminSidebar';
import AdminHeader from '../admin_partials/AdminHeader';
import AdminFooter from '../admin_partials/AdminFooter';
import Loading from '../partials/Loading';

const AdminAddAdminForm = () => {
  const Base_Url = process.env.Base_Url;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileNo, setMobileNo] = useState(""); // Alternative for ADMIN ID
  const [password, setPassword] = useState("");
  const [adminType, setAdminType] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCompleteConfirm, setIsCompleteConfirm] = useState(false);
  const [warning, setWarning] = useState(false);
  const [adminExists, setAdminExists] = useState(false);

  const { admin_type, admin_uname } = useParams();

  const handleAdminTypeChange = (e) => {
    const adminType = e.target.value;
    setAdminType(e.target.value);
    console.log("Admin Type:", adminType);
  };

  console.log("admin_type", admin_type);
  const [Reload, setReload] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('Admin_token');

    const checkToken = async (token) => {
      const response = await axios.get(`${Base_Url}admintoken/protect-token-admin/${admin_type}/${admin_uname}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const adminType = response.data.admin_type;
      if (adminType === 'chief_admin') {
        // Allow access to the audit page
        setReload(false);
      } else {
        window.location.href = '/indexadmin';
      }
    };

    if (token) {
      checkToken(token);
    } else {
      // Redirect to indexadmin if token is not present
      window.location.href = '/indexadmin';
    }
  }, []);

  const generatePassword = () => {
    const length = 14;
    const charset = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&+?/=~`;

    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }

    setPassword(generatedPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mobileNo || !password || !adminType) {
      setWarning(true);
      setTimeout(() => {
        setWarning(false);
      }, 3000);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`${Base_Url}login/admin/add`, {
        mobile_no: mobileNo,
        password: password,
        adminType: adminType,
        admin_name: name
      });

      if (response.status === 201) {
        setIsCompleteConfirm(true);
      } else {
        // Handle other response status if necessary
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setAdminExists(true);
        setTimeout(() => {
          setAdminExists(false);
        }, 3000);
      } else {
        console.error('There was an error adding the admin!', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    setIsCompleteConfirm(false);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setMobileNo("");
      setPassword("");
      setName("");
      setAdminType("");
    }, 3000);
  };

  const handleConfirmClose = () => {
    setIsCompleteConfirm(false);
  };

  if (Reload) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden dark:bg-[#212121]">

      {/* AdminSidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="overflow-y-auto">
          <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-[#2b2b2b] dark:border-[#3d3d3d] shadow-lg rounded-sm border border-slate-200 mx-4 mt-4 mb-2">
            <div className="px-5 py-5">
              <h1 className='font-medium text-center text-slate-700 dark:text-white'>Chief Admin</h1>
              <h1 className='mb-4 text-sm italic text-center text-slate-700 dark:text-gray-300'>Add Administrator</h1>
              <form onSubmit={handleSubmit} className={`overflow-y-auto pt-2.5`}>
                <form className={`max-w-md mx-auto`}>

                  {isSuccess && (
                    <div className="text-emerald-700 text-sm bg-emerald-200 text-center rounded-full py-1.5 mb-5">
                      Added Successful
                    </div>
                  )}

                  {warning && (
                    <div className="text-yellow-600 bg-yellow-100 md:text-sm text-xs text-center rounded-full py-1.5 my-5">
                      Missing fields are required.
                    </div>
                  )}

                  {adminExists && (
                    <div className="text-red-600 bg-red-100 md:text-sm text-xs text-center rounded-full py-1.5 my-5">
                      Admin already exists.
                    </div>
                  )}  
                
                  <div className="relative z-0 w-full mb-6 group">
                    <input type="text" name="adminid" id="adminid" placeholder=" " onChange={(e) => setMobileNo(e.target.value)} value={mobileNo} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"/>
                    <label htmlFor="" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 left-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                      Admin ID
                    </label>
                  </div>
                  <div className="relative z-0 w-full mb-6 group">
                    <input type="text" name="name" id="name" placeholder=" " onChange={(e) => setName(e.target.value)} value={name} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"/>
                    <label htmlFor="" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 left-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                      Admin Name
                    </label>
                  </div>
                  <div class="relative z-0 w-full mb-4 group col-span-2">
                    <input type="text" name="password" id="password" placeholder=" "  value={password} readOnly  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"/>
                    <label htmlFor="" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Password
                    </label>
                  </div>
                  <div className="relative z-0 w-full mb-8 group col-span-1">
                    <button 
                      onClick={generatePassword}
                      type="button" 
                      className="flex items-center justify-center w-full text-emerald-500 hover:text-white border border-emerald-500 hover:bg-emerald-500 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-normal rounded-sm text-sm px-4 py-2 text-center ml-0 mb-2 dark:border-emerald-500 dark:text-emerald-500 dark:hover:text-white dark:hover:bg-emerald-500 dark:focus:ring-emerald-800">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-5 h-5 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                      </svg>
                      Generate a strong password
                    </button>
                  </div>
                  <div className="relative z-0 w-full mb-6 group">
                    <select onChange={handleAdminTypeChange} value={adminType} defaultValue={0} name="admintype" id="admintype" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer cursor-pointer">
                      <option value="All" className='dark:bg-[#3d3d3d]'>Select Admin Type</option>
                      <option value="chief_admin" className='dark:bg-[#3d3d3d]'>Chief Admin</option>
                      <option value="rptax_admin" className='dark:bg-[#3d3d3d]'>RP Tax Admin</option>
                      <option value="business_admin" className='dark:bg-[#3d3d3d]'>Business Permit Admin</option>
                      <option value="cedula_admin" className='dark:bg-[#3d3d3d]'>CTC/Cedula Admin</option>
                      <option value="lcr_admin" className='dark:bg-[#3d3d3d]'>Local Civil Registry Admin</option>
                      <option value="registry_admin" className='dark:bg-[#3d3d3d]'>Registry Admin</option>
                    </select>
                    <label 
                      htmlFor="period" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 left-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                      Admin Type
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end items-end mt-10 mb-4">
                    <button onClick={handleSubmit} type="submit" className="flex items-center text-blue-500 hover:text-white border border-blue-500 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-normal rounded-sm text-sm px-10 py-2 text-center mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                        <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
                      </svg>
                      Add Admin
                    </button>
                  </div>

         {/* PROCESS MODAL */}
          {isCompleteConfirm && (
              <div className="fixed z-50 inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                  </div>
                  <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                    &#8203;
                  </span>
                  <div className="inline-block align-bottom bg-white rounded-sm text-center overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white dark:bg-[#212121] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="mx-auto mt-4">
                        <span className="font-medium text-slate-700 dark:text-white sm:mt-0 text-xs md:text-sm" id="modal-headline">
                          Are you sure to create a new admin account?
                        </span>
                      </div>
                    </div>


                    
                    {isLoading ? (
                      <div className="bg-white dark:bg-[#212121] text-slate-700 dark:text-white px-1 pb-8 rounded-b-sm">
                        <Loading />
                      </div>
                    ) : (
                      <>
                    <div className="bg-white dark:bg-[#212121] px-4 py-3 gap-3 sm:px-6 flex justify-end">
                      <button
                        onClick={handleConfirmClose}
                        type="button"
                        className="text-slate-500 text-xs md:text-sm ms-2 hover:text-white border border-slate-500 hover:bg-slate-500 focus:ring-4 focus:outline-none focus:ring-slate-300 font-normal rounded-sm px-5 py-2 text-center mb-2 dark:border-slate-500 dark:text-white dark:hover:text-white dark:hover:bg-slate-500 dark:focus:ring-slate-800"
                      >
                        <p>Cancel</p>
                      </button>
                    
                    <button
                    onClick={handleComplete} 
                    type="button"
                    className="text-white text-xs md:text-sm bg-emerald-500 border border-emerald-500 hover:bg-emerald-600 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-normal rounded-sm px-5 py-2 text-center mb-2 dark:border-emerald-500 dark:text-white dark:hover:text-white dark:hover:border-emerald-700 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800"
                    >
                      Confirm
                    </button>
                    </div>
                    </>
                    )}

                  </div>
                </div>
              </div>
            )}
              </form>
              </form>
            </div>
          </div>
            {/* )} */}
          <AdminFooter />
        </main>



        

      </div>
    </div>
  );
}

export default AdminAddAdminForm;