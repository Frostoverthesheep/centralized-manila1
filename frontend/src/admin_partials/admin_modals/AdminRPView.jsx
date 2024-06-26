import React, { useState, useEffect } from 'react';
import moment from 'moment/moment.js';

const AdminRPView = ({ selectedTransaction, isOpen, handleClose, transType }) => { // KAILANGAN IDECLARE RIN DITO SA LOOB LAHAT NG IPINASA NA VALUE PARA MAACCESS

  const { transaction_id, status_type } = selectedTransaction; // PANG DESTRUCTURE LANG NG LAMAN NG SELECTEDTRANSACTION, IBIG SABIHIN, MAY COPY NA YUNG VALUES SA LABAS NG SELECTEDTRANSACTION

  // const date = moment(date_processed).format('MMMM D, YYYY'); // INEXPLAIN KO KANINA TO
  // const time = moment(date_processed).format('h:mm A');

  console.log(selectedTransaction)


  return (
    // MAY CONDITION NA MAGDIDISPLAY LANG KUNG ANG ISOPEN AY TRUE, ITO RIN YUNG ISMODALOPEN, IBA LANG NAME
    isOpen && (
      <div className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center text-xs md:text-sm sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                &#8203;
              </span>
              <div className="inline-block align-bottom bg-white rounded-md text-center overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full max-w-2xl">
                <div className="bg-white dark:bg-[#212121] text-slate-700 dark:text-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mx-auto mt-2">
                    <div className="sm:mt-0" id="modal-headline">   
                      <div className="mx-auto">
                        <div className="mb-6">
                          <span className="font-bold md:text-lg text-sm">Transaction Details</span>
                        </div>
                        <div className="mb-6">
                          {/* SO ITO NA DISPLAY DISPLAY NALANG */}
                          <div className="flex flex-col sm:flex-row items-start justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Transaction ID</span>
                            {/* KAYA WALA TONG SELECTEDTRANSACTION KASI NGA GUMAWA TAYO COPY SA LINE 6 */}
                            <span className="whitespace-nowrap md:mb-0 mb-1">{transaction_id}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Type</span>
                            <span className="whitespace-nowrap md:mb-0 mb-1">{status_type}</span>
                          </div>
                          {/* ITO NAMAN YUNG CONDITION NA MAGDIDISPLAY LANG KUNG ANG TRANSTYPE NA PINASA AY TAX PAYMENT, NULL IF HINDI */}
                          {transType === 'Tax Payment' ? 
                          <div className="flex flex-col sm:flex-row items-start justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Account Name</span>
                            <span className="whitespace-nowrap md:mb-0 mb-1">{selectedTransaction.acc_name}</span>
                          </div>
                          : null} 
                          <div className="flex flex-col sm:flex-row items-start justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Tax Declaration Number (TDN)</span>
                            <span className="whitespace-nowrap md:mb-0 mb-1">{selectedTransaction.rp_tdn}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Property Identification Number (PIN)</span>
                            <span className="whitespace-nowrap md:mb-0 mb-1">{selectedTransaction.rp_pin}</span>
                          </div>
                          {transType === 'Tax Payment' ? 
                          <div className="flex flex-col sm:flex-row items-start justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">From</span>
                            <span className="whitespace-nowrap md:mb-0 mb-1">{selectedTransaction.year_period ? `${selectedTransaction.year_period} - 1st Quarter`: selectedTransaction.year_period ? `${selectedTransaction.year_period} - 1st Quarter`: '-'}</span>
                          </div> 
                          : null} 
                          {transType === 'Tax Payment' ? 
                          <div className="flex flex-col sm:flex-row items-start justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">To</span>
                            <span className="whitespace-nowrap md:mb-0 mb-1">{selectedTransaction.year_period ? `${selectedTransaction.year_period} - ${selectedTransaction.period_id}`: selectedTransaction.period_id ? `${selectedTransaction.period_id} - ${selectedTransaction.period_id}`: '-'}</span>
                          </div>
                          : null} 
                          <div className="flex flex-col sm:flex-row items-start justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Date Processed</span>
                            <span className="whitespace-nowrap md:mb-0 mb-1">{selectedTransaction.date}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Time Processed</span>
                            <span className="whitespace-nowrap md:mb-0 mb-1">{selectedTransaction.time}</span>
                          </div>
                          {transaction_id ? (
                          <div className="flex flex-col sm:flex-row items-start justify-between mb-1">
                            <span className="font-medium whitespace-nowrap">Status</span>
                            {status_type === "Pending" && <span className="whitespace-nowrap md:mb-0 mb-1 text-xs py-0.5 font-semibold rounded-full bg-yellow-200 text-yellow-800 w-24">{selectedTransaction.status_type}</span>}
                            {status_type === "Paid" && <span className="whitespace-nowrap md:mb-0 mb-1 text-xs py-0.5 font-semibold rounded-full bg-emerald-200 text-emerald-800 w-24">{selectedTransaction.status_type}</span>}
                            {status_type === "Processing" && <span className="whitespace-nowrap md:mb-0 mb-1 text-xs py-0.5 font-semibold rounded-full bg-purple-200 text-purple-800 w-24">{selectedTransaction.status_type}</span>}
                            {status_type === "Complete" && <span className="whitespace-nowrap md:mb-0 mb-1 text-xs py-0.5 font-semibold rounded-full bg-blue-200 text-blue-800 w-24">{selectedTransaction.status_type}</span>}
                            {status_type === "Rejected" && <span className="whitespace-nowrap md:mb-0 mb-1 text-xs py-0.5 font-semibold rounded-full bg-red-200 text-red-800 w-24">{selectedTransaction.status_type}</span>}
                            {status_type === "Expired" && <span className="whitespace-nowrap md:mb-0 mb-1 text-xs py-0.5 font-semibold rounded-full bg-orange-200 text-orange-800 w-24">{selectedTransaction.status_type}</span>}
                          </div>
                          ) : null}
                          {/* <hr className='mb-1'/> */}

                          {status_type === 'Pending' ? (
                            <div className="flex flex-col text-sm italic sm:flex-row text-start mb-1">
                              <span>Note: Awaiting user payment</span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-[#212121] px-4 pt-3 pb-5 gap-3 sm:px-6 flex items-center justify-end">
                  <div className="flex items-center space-x-5 mt-auto">
                      <button
                          onClick={handleClose}
                          type="button"
                          className="text-slate-500 text-xs text-center px-5 py-2 mb-0 md:text-sm ms-2 hover:text-white border border-slate-500 hover:bg-slate-500 font-normal rounded-sm dark:border-slate-500 dark:text-white dark:hover:text-white dark:hover:bg-slate-500"
                      >
                          <p>Close</p>
                      </button>
                  </div>
              </div>

              </div>
            </div>
          </div>
    )
  );
};

export default AdminRPView;
