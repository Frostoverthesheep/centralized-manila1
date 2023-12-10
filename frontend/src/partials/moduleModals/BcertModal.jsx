import React from 'react';
import StatusBadgeMobile from '../StatusBadgeMobile';

const BcertModal = ({ selectedTransaction, onClose }) => {
 
  return (
    <div className="fixed z-50 inset-0 ">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center text-xs md:text-sm sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white dark:bg-[#212121] text-slate-700 dark:text-white rounded-lg text-center overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full max-w-2xl">
          <div className="px-4 pt-5 pb-0 sm:p-6 sm:pb-0 overflow-y-auto">
                          <div className="mb-6">
                          <span className="font-bold md:text-lg text-sm">Cedula Transaction Details</span>
                          </div>
                        </div>
          
          
          
          <div className="max-h-[19.5rem] pb-0 pl-4 pr-4 sm:pl-6 sm:pr-6 md:pl-6 md:pr-6 overflow-y-auto">
            <div className="mx-auto">
                    <div className="sm:mt-0" id="modal-headline">   
                      <div className="mx-auto">
                        <div className="mb-0">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Transaction ID</span>
                            <span className="whitespace-nowrap ml-4">{selectedTransaction.transaction_id}</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Owner's Information</span>
                            <span className="whitespace-nowrap ml-4">Alvarez, Jeremiah Paul S.</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Region</span>
                            <span className="whitespace-nowrap ml-4">-</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Province</span>
                            <span className="whitespace-nowrap ml-4">-</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Municipal</span>
                            <span className="whitespace-nowrap ml-4">-</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Barangay</span>
                            <span className="whitespace-nowrap ml-4">-</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">House No. / Unit Floor</span>
                            <span className="whitespace-nowrap ml-4">-</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Street / Building Name</span>
                            <span className="whitespace-nowrap ml-4">-</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Zip Code</span>
                            <span className="whitespace-nowrap ml-4">-</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Civil Status</span>
                            <span className="whitespace-nowrap ml-4">-</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Country of Citizenship</span>
                            <span className="whitespace-nowrap ml-4">-</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Height (ft)</span>
                            <span className="whitespace-nowrap ml-4">-</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Weight (kg)</span>
                            <span className="whitespace-nowrap ml-4">-</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Alien Certificate of Registration No.</span>
                            <span className="whitespace-nowrap ml-4">-</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Employment Status</span>
                            <span className="whitespace-nowrap ml-4">-</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Tax Payer Account No.</span>
                            <span className="whitespace-nowrap ml-4">-</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Residence Tax Due</span>
                            <span className="whitespace-nowrap ml-4">-</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Valid ID to Present Upon Claiming</span>
                            <span className="whitespace-nowrap ml-4">-</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Profession/Occupation/Business</span>
                            <span className="whitespace-nowrap ml-4">-</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Income from Real Property</span>
                            <span className="whitespace-nowrap ml-4">-</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Earnings from Business</span>
                            <span className="whitespace-nowrap ml-4">-</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Earnings from Profession</span>
                            <span className="whitespace-nowrap ml-4">-</span>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>

              <div className="pb-4 pl-4 pr-4 sm:pl-6 sm:pr-6 md:pl-6 md:pr-6 lg:pr-10 ">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Date Processed</span>
                            <span className="whitespace-nowrap ml-4">{selectedTransaction.date}</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Time Processed</span>
                            <span className="whitespace-nowrap ml-4">{selectedTransaction.time}</span>
                          </div>
                          {/* <div className="flex justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Remarks</span>
                            <span className="whitespace-nowrap ml-4">WAITING FOR PAYMENT REFERENCE NUMBER</span>
                          </div> */}
                          <div className="flex justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Reference Number</span>
                            <span className="whitespace-nowrap ml-4">-</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Status</span>
                            <StatusBadgeMobile statusType={selectedTransaction.status_type} />
                          </div>

                          <hr className='mt-7 mb-1'/>
                          <div className="flex justify-between">
                            <span className="font-semibold whitespace-nowrap">Amount to Pay</span>
                            <span className="font-semibold whitespace-nowrap ml-4"> P 1,020.00</span>
                          </div>
                        </div>

                <div className="bg-white dark:bg-[#212121] mr-0 md:mr-2 px-4 pt-3 pb-5 gap-3 sm:px-6 flex items-center justify-between">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Sample_EPC_QR_code.png" alt="QR Code" className="w-20 h-20 mr-3"/>
                  <div className="flex items-center space-x-2 mt-auto">
                      <button
                          onClick={onClose}
                          type="button"
                          className="text-slate-500 text-xs text-center px-5 py-2 mb-0 md:text-sm ms-2 hover:text-white border border-slate-500 hover:bg-slate-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-normal rounded-full dark:border-slate-500 dark:text-white dark:hover:text-white dark:hover:bg-slate-500 dark:focus:ring-slate-800"
                      >
                          <p>Cancel</p>
                      </button>
                  </div>
              </div>

              </div>
            </div>
          </div>
  );
};

export default BcertModal;





// const labels = {
//     birthc_lname: 'Document Owner\'s Last Name',
//     birthc_fname: 'Document Owner\'s First Name',
//     birthc_mname: 'Document Owner\'s Middle Name',
//     birthc_suffix: 'Document Owner\'s Suffix',
//     birthc_sex: 'Document Owner\'s Sex',
//     birthc_ownerregion: 'Document Owner\'s Region',
//     birthc_ownerprovince: 'Document Owner\'s Province',
//     birthc_ownermunicipal: 'Document Owner\'s Municipal',
//     birthc_date: 'Document Owner\'s Date of Birth',
//     birthc_fatherlname: 'Father\'s Last Name',
//     birthc_fatherfname: 'Father\'s First Name',
//     birthc_fathermname: 'Father\'s Middle Name',
//     birthc_fathersuffix: 'Father\'s Middle Name',
//     birthc_motherlname: 'Mother\'s Last Name',
//     birthc_motherfname: 'Mother\'s First Name',
//     birthc_mothermname: 'Mother\'s Middle Name',
//     birthc_mothersuffix: 'Mother\'s Suffix',
//     birthc_reqlname: 'Requestor\'s Last Name',
//     birthc_reqfname: 'Requestor\'s First Name',
//     birthc_reqmname: 'Requestor\'s Middle Name',
//     birthc_reqsuffix: 'Requestor\'s Suffix',
//     birthc_reqrelation: 'Requestor\'s Relationship to the Owner',
//     birthc_reqtin: 'Requestor\'s Tax Identification Number',
//     birthc_reqtelnum: 'Telephone No.',
//     birthc_reqmobnum: 'Mobile No.',
//     birthc_reqregion: 'Region',
//     birthc_reqprovince: 'Province',
//     birthc_reqmunicipal: 'City',
//     birthc_reqbrgy: 'Barangay',
//     birthc_reqhnum: 'House No. / Unit Floor',
//     birthc_reqstreet: 'Street / Building Name',
//     birthc_reqzip: 'Zip Code',
//     birthc_country: 'Country',
//     birthc_bren: 'Birth Registry Number (BReN)',
//     birthc_hospital: 'Hospital Name / Name of Midwife / Hilot',
//     birthc_nocopies: 'No. of Copies',
//     birthc_print: 'What to Print',
//     birthc_purpose: 'Purpose',
//     birthc_validid: 'Valid ID to Present Upon Claiming',
//   }