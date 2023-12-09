import React, { useState, useEffect } from 'react';
import axios from 'axios'
import {Link} from "react-router-dom"


import { useLocation } from 'react-router-dom';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import Flatpickr from 'react-flatpickr';
 
import 'flatpickr/dist/themes/airbnb.css';
import CityDropdown from '../partials/profile/CityDropdown';
import RegionDropdown from '../partials/profile/RegionDropdown';
import ProvinceDropdown from '../partials/profile/ProvinceDropdown';
import CountryDropdwon from '../partials/profile/CountryDropdown';

const CedulaForm =()=>{

  const location = useLocation();
  const { pathname } = location;
  const user_id = pathname.split("/")[2];  

  const [CtcCedula, setCtcCedula] = useState((prevData) => ({
    ...prevData,
    ctc_salariesta: '',
    ctc_salariesca: '',
    ctc_grossta: '',
    ctc_grossca: '',
    ctc_incomeca: '',
    ctc_cedamount: '',
  }));
  
  const [isSuccess, setIsSuccess] = useState(false);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(`http://localhost:8800/cedula/${user_id}`, {
        ...CtcCedula,
        ctc_amount: totalAmountPaid,
        // Add other necessary fields here
      });
  
      // Check the response status before proceeding
      if (response.status === 200) {
        setIsSuccess(true); // Set success state to true
        handleCloseModal(); // Close the modal
        console.log('Transaction successful');
  
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      } else {
        console.error('Transaction error:', response.statusText);
      }
    } catch (err) {
      console.error('Transaction error:', err);
    }
  };
  
const [isModalOpen, setIsModalOpen] = useState(false);

const handleProceed = (e) => {
  e.preventDefault();
  setIsModalOpen(true);
};

const handleCloseModal = () => {
  setIsModalOpen(false);
};

useEffect(() => {
  const handleTaxableAmountChange = (id, taxableId, cedulaId) => {
    const taxableAmountInput = document.getElementById(taxableId);
    const cedulaAmountInput = document.getElementById(cedulaId);

    // Get the value from Taxable Amount input
    const taxableAmount = parseFloat(taxableAmountInput.value) || 0;

    // Calculate Cedula Amount (1% of Taxable Amount) and round it
    const cedulaAmount = Math.round(taxableAmount * 0.001);

    // Update Cedula Amount input
    cedulaAmountInput.value = cedulaAmount;

    // Update state
    setCtcCedula((prevData) => ({
      ...prevData,
      [id]: taxableAmountInput.value,
      [cedulaId]: cedulaAmount,
    }));
  };

  const handleTaxableSalariestaChange = () => {
    handleTaxableAmountChange('ctc_salariesta', 'ctc_salariesta', 'ctc_salariesca');
  };

  const handleTaxableGrosstaChange = () => {
    handleTaxableAmountChange('ctc_grossta', 'ctc_grossta', 'ctc_grossca');
  };

  const handleTaxableRealPropChange = () => {
    handleTaxableAmountChange('ctc_incomeca', 'ctc_incomeca', 'ctc_cedamount');
  };

  const taxableSalariestaInput = document.getElementById('ctc_salariesta');
  const taxableGrosstaInput = document.getElementById('ctc_grossta');
  const taxableRealPropInput = document.getElementById('ctc_incomeca');


  // Add input event listeners to Taxable Amount inputs
  taxableSalariestaInput.addEventListener('input', handleTaxableSalariestaChange);
  taxableGrosstaInput.addEventListener('input', handleTaxableGrosstaChange);
  taxableRealPropInput.addEventListener('input', handleTaxableRealPropChange);


  // Clean up the event listeners when the component is unmounted
  return () => {
    taxableSalariestaInput.removeEventListener('input', handleTaxableSalariestaChange);
    taxableGrosstaInput.removeEventListener('input', handleTaxableGrosstaChange);
    taxableRealPropInput.removeEventListener('input', handleTaxableRealPropChange);

  };
}, []);


const totalCedulaAmount = Math.round(Object.values(CtcCedula)
  .filter((value) => !isNaN(parseFloat(value)))
  .reduce((acc, amount) => acc + parseFloat(amount), 0) * 0.001)
  .toFixed(2);

const interestAmount = Math.round(totalCedulaAmount * 0.2).toFixed(2);

const totalAmountPaid = Math.round(parseFloat(totalCedulaAmount) + parseFloat(interestAmount)).toFixed(2);

console.log('Total Cedula Amount:', totalCedulaAmount);
console.log('Interest Amount (20%):', interestAmount);
console.log('Total Amount Paid:', totalAmountPaid);



const [sidebarOpen, setSidebarOpen] = useState(false);


const handleInputChange = (e) => {
  const { name, id, value } = e.target;
  const updatedValue = isNaN(value) ? value.toUpperCase() : value;
  const numericValue = value.replace(/[^0-9]/g, '');
  

  setCtcCedula((prevData) => {

    if (name === 'ctc_cznstatus') {
        
      return {
        ...prevData,
        ctc_cznstatus: value,
      };
    }
    

    if (id === 'ctc_region') {
      return {
        ...prevData,
        [id]: value,
        birthc_province: '',
        birthc_municipal: '',
      };
    }

    else {
      return {
      ...prevData,
      [id]: updatedValue,
      [id]: numericValue,
    };
  }
});
};


  console.log(CtcCedula);
  return (
    <div className="flex h-screen overflow-hidden dark:bg-[#212121]">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-[#2b2b2b] dark:border-[#3d3d3d] shadow-lg rounded-sm border border-slate-200 mx-4 my-4">
            <div className="px-5 py-5">
                 
           
            <form onSubmit={handleSubmit}>
            <h1 className='font-medium text-center text-slate-700 dark:text-white'>CTC / Cedula</h1>
            <h1 className='mb-7 text-sm italic text-center text-slate-700 dark:text-gray-300'></h1>
           
            {isSuccess && (
                  <div className="text-emerald-700 text-sm bg-emerald-200 text-center rounded-full py-1.5 mb-5">
                    Transaction success!
                  </div>
                  )}  

              {/* Group 1 - Owner's Information*/}
              <div className='pt-0.5'>
                <h1 className='font-medium text-center text-slate-700 dark:text-white my-4'>Owner’s Information</h1>
                <div className="grid md:grid-cols-8 md:gap-6">
                  <div className="relative z-0 w-full mb-6 md:col-span-2 group">
                  <input onChange={handleInputChange} value={CtcCedula.ctc_lname} type="text" id="ctc_lname" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required/>
                    <label htmlFor="ctc_lname" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last Name</label>
                  </div>
                  <div className="relative z-0 w-full mb-6 md:col-span-2 group">
                  <input onChange={handleInputChange} value={CtcCedula.ctc_fname} type="text" id="ctc_fname" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required/>
                    <label htmlFor="ctc_fname" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First Name</label>
                  </div>
                  <div className="relative z-0 w-full mb-6 md:col-span-2 group">
                  <input onChange={handleInputChange} value={CtcCedula.ctc_mname} type="text" id="ctc_mname" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required/>
                    <label htmlFor="ctc_mname" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Middle Name</label>
                  </div>
                  <div className="relative z-0 w-full mb-6 group">
                  <select onChange={handleInputChange} value={CtcCedula.ctc_suffix} id="ctc_suffix" defaultValue={0} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >                        <option value="0" className='dark:bg-[#3d3d3d]'>Select Suffix</option>
                        <option value="SR."className='dark:bg-[#3d3d3d]'>Sr.</option>
                        <option value="JR."className='dark:bg-[#3d3d3d]'>Jr.</option>
                        <option value="II"className='dark:bg-[#3d3d3d]'>II</option>
                        <option value="III"className='dark:bg-[#3d3d3d]'>III</option>
                        <option value="IV"className='dark:bg-[#3d3d3d]'>IV</option>
                        <option value="V"className='dark:bg-[#3d3d3d]'>V</option>
                        <option value="VI"className='dark:bg-[#3d3d3d]'>VI</option>
                        <option value="VII"className='dark:bg-[#3d3d3d]'>VII</option>
                        <option value="VIII"className='dark:bg-[#3d3d3d]'>VIII</option>
                        <option value="IX"className='dark:bg-[#3d3d3d]'>IX</option>
                        <option value="X"className='dark:bg-[#3d3d3d]'>X</option>
                    </select>
                    <label htmlFor="ctc_suffix" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Suffix</label>
                  </div>
                  <div className="relative z-0 w-full mb-6 group">
                  <select onChange={handleInputChange} value={CtcCedula.ctc_sex} id="ctc_sex" defaultValue={0} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >
                      <option value="0" className='dark:bg-[#3d3d3d]'>Select Sex</option>
                      <option value="MALE" className='dark:bg-[#3d3d3d]'>Male</option>
                      <option value="FEMALE"className='dark:bg-[#3d3d3d]'>Female</option>
                    </select>
                    <label htmlFor="ctc_sex" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Sex</label>
                  </div>
                </div>
              </div>

              {/* Group 2- Address */}
              <div className='pt-6'>
                <h1 className='font-medium text-center text-slate-700 dark:text-white my-4'>Address</h1>
                {/* Row 1 */}
                <div className="grid md:grid-cols-3 md:gap-6">
                  <div className="relative z-0 w-full mb-6 group">
                  <select onChange={handleInputChange} value={CtcCedula.ctc_region} id="ctc_region" defaultValue={0} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >
                    <RegionDropdown />
                    </select>
                    <label htmlFor="ctc_region" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Region</label>
                  </div>
                  <div className="relative z-0 w-full mb-6 group">
                  <select onChange={handleInputChange} value={CtcCedula.ctc_province} id="ctc_province" defaultValue={0} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >
                    <ProvinceDropdown selectedRegion={CtcCedula.ctc_region} /> 
                    </select>
                    <label htmlFor="ctc_province" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Province</label>
                  </div>
                  <div className="relative z-0 w-full mb-6 group">
                  <select onChange={handleInputChange} value={CtcCedula.ctc_municipal} id="ctc_municipal" defaultValue={0} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >
                    <CityDropdown selectedProvince={CtcCedula.ctc_province} />
                    </select>
                    <label htmlFor="ctc_municipal" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Municipal</label>
                  </div>
                </div>
                {/* Row 2 */}
                <div className="grid md:grid-cols-7 md:gap-6">
                  <div className="relative z-0 w-full mb-6 md:col-span-2 group">
                  <input onChange={handleInputChange} value={CtcCedula.ctc_reqbrgy} type="text" id="ctc_reqbrgy" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required/>
                    <label htmlFor="ctc_reqbrgy" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Barangay</label>
                  </div>
                  <div className="relative z-0 w-full mb-6 md:col-span-2 group">
                  <input onChange={handleInputChange} value={CtcCedula.ctc_reqhnum} type="text" id="ctc_reqhnum" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required/>
                    <label htmlFor="ctc_reqhnum" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">House No. / Unit Floor</label>
                  </div>
                  <div className="relative z-0 w-full mb-6 md:col-span-2 group">
                  <input onChange={handleInputChange} value={CtcCedula.ctc_reqstreet} type="text" id="ctc_reqstreet" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required/>
                    <label htmlFor="ctc_reqstreet" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Street / Building Name</label>
                  </div>
                  <div className="relative z-0 w-full mb-6 group">
                  <input onChange={handleInputChange} value={CtcCedula.ctc_reqzip} type="text" id="ctc_reqzip" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required/>
                    <label htmlFor="ctc_reqzip" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Zip Code</label>
                  </div>
                </div>
              </div>

                {/* Group 3 - Other Information */}
                <div className='pt-6'>
                <h1 className='font-medium text-center text-slate-700 dark:text-white my-4'>Other Information</h1>
                {/* Row 1 */}
                <div className="grid md:grid-cols-6 md:gap-6">
                  <div className="relative z-0 w-full mb-6 md:col-span-2 group">
                  <select onChange={handleInputChange} value={CtcCedula.ctc_civilstatus} defaultValue={0} name="ctc_civilstatus" id="ctc_civilstatus" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >
                      <option value="0" className='dark:bg-[#3d3d3d]'>Select Civil Status</option>
                      <option value="SINGLE" className='dark:bg-[#3d3d3d]'>Single</option>
                      <option value="MARRIED" className='dark:bg-[#3d3d3d]'>Married</option>
                      <option value="SEPARATED" className='dark:bg-[#3d3d3d]'>Separated</option>
                      <option value="WIDOWED" className='dark:bg-[#3d3d3d]'>Widowed</option>
                    </select>
                    <label htmlFor="ctc_civilstatus" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Civil Status</label>
                  </div>
                  <div className="relative z-0 w-full mb-6 md:col-span-2 group">
                  <select onChange={handleInputChange} value={CtcCedula.ctc_cznstatus} name="ctc_cznstatus" id="ctc_cznstatus" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="">
                  <CountryDropdwon />
                  </select>
                    <label htmlFor="ctc_cznstatus" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Country of Citizenship</label>
                  </div>
                  <div className="relative z-0 w-full mb-6 group">
                    <input onChange={handleInputChange} value={CtcCedula.ctc_height} type="text" id="ctc_height" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required/>
                    <label htmlFor="ctc_height" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Height (ft)</label>
                  </div>
                  <div className="relative z-0 w-full mb-6 group">
                    <input onChange={handleInputChange} value={CtcCedula.ctc_weight} type="text" id="ctc_weight" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required/>
                    <label htmlFor="ctc_weight" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Weight (kg)</label>
                  </div>
                </div>
                {/* Row 2 */}
                <div className="grid md:grid-cols-1 md:gap-6">
                  <div className="relative z-0 w-full mb-6 group">
                    <input onChange={handleInputChange} value={CtcCedula.ctc_aliencor} type="text" id="ctc_aliencor" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required/>
                    <label htmlFor="ctc_aliencor" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Alien Certificate of Registration No. (if alien)</label>
                  </div>
                </div>
              </div>

              {/* Group 4 - Transaction Information*/}
              <div className='pt-6'>
                <h1 className='font-medium text-center text-slate-700 dark:text-white my-4'>Transaction Information</h1>
                {/* Row 1 */}
                <div className="grid md:grid-cols-3 md:gap-6">
                  <div className="relative z-0 w-full mb-6 group">
                    <select onChange={handleInputChange} value={CtcCedula.ctc_employmentstatus} name="ctc_employmentstatus" id="ctc_employmentstatus" defaultValue={0} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >
                      <option value="0" className='dark:bg-[#3d3d3d]'>Select Employment Status</option>
                      <option value="COUNTRY A" className='dark:bg-[#3d3d3d]'>Country A</option>
                    <option value="COUNTRY B" className='dark:bg-[#3d3d3d]'>Country B</option>
                    <option value="COUNTRY C" className='dark:bg-[#3d3d3d]'>Country C</option>
                    </select>
                    <label htmlFor="ctc_employmentstatus" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Employment Status</label>
                  </div>
                  <div className="relative z-0 w-full mb-6 group">
                    <input onChange={handleInputChange} value={CtcCedula.ctc_taxpayeraccno} type="text" id="ctc_taxpayeraccno" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required/>
                    <label htmlFor="ctc_taxpayeraccno" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Tax Payer Account No.</label>
                  </div>
                  <div className="relative z-0 w-full mb-6 group">
                    <Flatpickr
                      id='residencetaxdue'
                      value={CtcCedula.birth_date}
                      onChange={(date) => {
                        const formattedDate = date.length > 0 ? (() => {
                          const originalDate = new Date(date[0]);
                          originalDate.setDate(originalDate.getDate() + 1);
                          return originalDate.toISOString().split('T')[0];
                        })() : '';
                        
                        setUserBirth((prevData) => ({
                          ...prevData,
                          birth_date: formattedDate,
                        }))
                      }}
                      options={{
                        dateFormat: 'Y-m-d',
                        altInput: true,
                        altFormat: 'F j, Y',
                        placeholder: ' ', // Set an empty space as the initial placeholder
                      }}
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    />
                    <label
                      htmlFor="residencetaxdue"
                      className={`peer-focus:font-medium absolute bg-transparent text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 ${
                        CtcCedula.birth_date ? 'peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0' : 'peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
                      }`}
                    >
                      Residence Tax Due
                    </label>
                </div>
                </div>
                {/* Row 2 */}
                <div className="grid md:grid-cols-2 md:gap-6">
                  <div className="relative z-0 w-full mb-6 group">
                    <select onChange={handleInputChange} value={CtcCedula.ctc_validid} id="ctc_validid" name="ctc_validid" defaultValue={0} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >
                      <option value="0" className='dark:bg-[#3d3d3d]'>Select Valid ID to Present Upon Claiming</option>
                      <option className='dark:bg-[#3d3d3d]'>SSS</option>
                      <option className='dark:bg-[#3d3d3d]'>UMID</option>
                      <option className='dark:bg-[#3d3d3d]'>PHILHEALTH</option>
                      <option className='dark:bg-[#3d3d3d]'>DRIVER'S LICENSE</option>
                      <option className='dark:bg-[#3d3d3d]'>VOTER'S ID</option>
                      <option className='dark:bg-[#3d3d3d]'>SENIOR CITIZEN'S ID</option>
                      <option className='dark:bg-[#3d3d3d]'>POSTAL ID</option>
                      <option className='dark:bg-[#3d3d3d]'>BARANGAY ID</option>
                      <option className='dark:bg-[#3d3d3d]'>AUTHORIZATION LETTER</option>
                    </select>
                    <label htmlFor="ctc_validid" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Valid ID to Present Upon Claiming</label>
                  </div>
                  <div className="relative z-0 w-full mb-6 group">
                    <select onChange={handleInputChange} value={CtcCedula.ctc_profession} name="ctc_profession" id="ctc_profession" defaultValue={0} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >
                      <option value="0" className='dark:bg-[#3d3d3d]'>Select Profession/Occupation/Business</option>
                      <option value="COUNTRY A" className='dark:bg-[#3d3d3d]'>Country A</option>
                    <option value="COUNTRY B" className='dark:bg-[#3d3d3d]'>Country B</option>
                    <option value="COUNTRY C" className='dark:bg-[#3d3d3d]'>Country C</option>
                    </select>
                    <label htmlFor="ctc_profession" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Profession/Occupation/Business</label>
                  </div>
                </div>
                {/* Row 3 */}
                <h1 className='text-sm text-slate-700 dark:text-white'>Additional Residence Tax on the following items owned or earned in the Philippines (Tax not exceeded P5,000)</h1>
                {/* Row 4 */}
                <h1 className='text-xs text-slate-700 dark:text-white mt-2.5 mb-1.5'>Income from Real Property (P1 for every P1,000)</h1>
                  <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 w-full mb-6 group">
                      <input type="text" id="ctc_incomeca" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required/>
                      <label htmlFor="ctc_incomeca" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Taxable Amount</label>
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                      <input type="text" id="ctc_cedamount" readOnly className="pointer-events-none block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required/>
                      <label htmlFor="ctc_cedamount" className="pointer-events-none peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Cedula Amount</label>
                    </div>
                </div>
                {/* Row 5 */}
                <h1 className='text-xs text-slate-700 dark:text-white mb-1.5'>Gross Receipts or Earnings derived from Business during the preceding year (P1 for every P1,000)</h1>
                  <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 w-full mb-6 group">
                      <input type="text" id="ctc_grossta" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required/>
                      <label htmlFor="ctc_grossta" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Taxable Amount</label>
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                      <input type="text" id="ctc_grossca" readOnly value={CtcCedula.ctc_grossca} className="pointer-events-none block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required/>
                      <label htmlFor="ctc_grossca" className="pointer-events-none peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Cedula Amount</label>
                    </div>
                </div>
                {/* Row 6 */}
                <h1 className='text-xs text-slate-700 dark:text-white mb-1.5'>Salaries or Gross Receipts or Earnings derived from exercise of profession or pursuit of any occupation (P1 for every P1,000)</h1>
                  <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="relative z-0 w-full mb-6 group">
                      <input type="text" id="ctc_salariesta" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required/>
                      <label htmlFor="ctc_salariesta" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Taxable Amount</label>
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
 <input
            type="text"
            id="ctc_salariesca"
            readOnly
            value={CtcCedula.ctc_salariesca}
            className="pointer-events-none block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=""
            required
          />                      <label htmlFor="ctc_salariesca" className="pointer-events-none peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Cedula Amount</label>
                    </div>
                  </div>
              </div>

              {/* Group 5 - Computation */}
              <div className="flex justify-center md:justify-end text-sm">
                 <div className="w-full md:w-1/2">
                 <div className="flex justify-between">
                <span className="font-medium whitespace-nowrap">Total (+P Basic Amount)</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="whitespace-nowrap">Total</span>
                <span className="whitespace-nowrap">P{totalCedulaAmount}</span>
              </div>
              <div className="flex justify-between mt-2">
                    <span className="whitespace-nowrap">Interest (20%)</span>
                    <span id="ctc_interest" className="whitespace-nowrap">P{interestAmount}</span>
                  </div>

                     <hr className='mt-2.5 mb-1'/>
                     <div className="flex justify-between">
                  <span className="font-medium whitespace-nowrap">Total Amount Paid</span>
                  <span id="ctc_amount" className="whitespace-nowrap">P{totalAmountPaid}</span>
                </div>
                 </div>
              </div>

              <div className="flex flex-col items-center md:flex-row md:justify-end mt-7">
                <button
                  type="submit"
                  onClick={handleProceed}
                  className="text-blue-500 hover:text-white border border-blue-500 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-normal rounded-full text-sm px-10 py-2.5 text-center mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">
                  Proceed
                </button>
              </div>
            </form>
            </div>
          </div>
        </main>

        {isModalOpen && (
          <div className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                &#8203;
              </span>
              <div className="inline-block align-bottom bg-white rounded-lg text-center overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white dark:bg-[#212121] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mx-auto mt-4">
                    <span className="font-medium text-slate-700 dark:text-white sm:mt-0 text-xs md:text-sm" id="modal-headline">
                      Are you sure you want to save these changes?
                    </span>
                  </div>
                </div>
                <div className="bg-white dark:bg-[#212121] px-4 py-3 gap-3 sm:px-6 flex justify-end">
                  <button
                    onClick={handleCloseModal}
                    type="button"
                    className="text-slate-500 text-xs md:text-sm ms-2 hover:text-white border border-slate-500 hover:bg-slate-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-normal rounded-full px-5 py-2 text-center mb-2 dark:border-slate-500 dark:text-white dark:hover:text-white dark:hover:bg-slate-500 dark:focus:ring-slate-800"
                  >
                    <p>Cancel</p>
                  </button>
                  <button
                    onClick={handleSubmit}
                    type="button"
                    className="text-white text-xs md:text-sm bg-blue-500 border border-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-normal rounded-full px-5 py-2 text-center mb-2 dark:border-blue-500 dark:text-white dark:hover:text-white dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <p>Proceed</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )} 
      </div>
    </div>
  );
}

export default CedulaForm;