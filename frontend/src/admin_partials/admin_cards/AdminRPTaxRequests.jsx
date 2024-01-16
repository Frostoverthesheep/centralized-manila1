import React, { useState, useEffect } from 'react';
import moment from 'moment/moment.js';

import AdminRPView from '../admin_modals/AdminRPView';
import AdminRPProcess from '../admin_modals/AdminRPProcess';
import AdminRPTaxProcessing from '../admin_cards/AdminRPTaxProcessing';


const AdminRPTaxRequests = ({ taxPayment, taxClearance, onProceed, onMoveToProcessing }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false); // Initialize the state here
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transType, setTransType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [shouldOpenViewModal, setShouldOpenViewModal] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [isExpiredModalOpen, setIsExpiredModalOpen] = useState(false);

  const date1 = moment(taxPayment.date_processed).format('MMMM D, YYYY');
  const time1 = moment(taxPayment.date_processed).format('h:mm A');

  const date2 = moment(taxClearance.date_processed).format('MMMM D, YYYY');
  const time2 = moment(taxClearance.date_processed).format('h:mm A');
  
  const handleOpenProcessModal = (transaction, type) => {
    setTransType(type);
    setSelectedTransaction(transaction);
  
    if (type === 'Real Property Tax Payment' || type === 'Real Property Tax Clearance') {
      // Open the process modal only for the specified types
      setIsProcessModalOpen(true);
      setIsViewModalOpen(false);
    } else {
      // Open the view modal for other types
      setIsViewModalOpen(true);
      setIsProcessModalOpen(false);
    }
  };
  
  const handleProcessButtonClick = (transaction) => {
    // Perform any necessary actions before opening the process modal
    
    // Now, open the process modal
    setIsProcessModalOpen(true);
  };
  
  const handleProcessClick = async () => {
    try {
      if (!selectedTransaction || !selectedTransaction.transaction_id) {
        console.error("Transaction ID is not defined.");
        alert("Error updating transaction status. Please try again later.");
        return;
      }

      // Perform any necessary actions before proceeding

      // Call the onMoveToProcessing function
      if (onMoveToProcessing) {
        onMoveToProcessing(selectedTransaction);
      }

      // Call the onProceed function(s)
      if (Array.isArray(onProceed)) {
        onProceed.forEach((proceedFunction) => {
          proceedFunction(selectedTransaction);
        });
      } else if (onProceed) {
        onProceed(selectedTransaction);
      }

      // Close the modal
      handleCloseModal('process');
    } catch (error) {
      console.error('Error processing transaction', error);
    }
  };
  


  const handleOpenViewModal = (transaction, type) => {
    setTransType(type);
    setSelectedTransaction(transaction);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = (modalType) => {
    if (modalType === 'view') {
      setIsViewModalOpen(false);
    } else if (modalType === 'expired') {
      setIsExpiredModalOpen(false);
    } else if (modalType === 'process') { // Corrected modalType check
      setIsProcessModalOpen(false); // Close the process modal
    } else {
      setIsModalOpen(false);
    }
    setSelectedTransaction(null);
  };
  

  const handleExpiredModal = (transaction, type) => {
    setTransType(type);
    setSelectedTransaction(transaction);
    setIsViewModalOpen(false); // Close the view modal
    setIsExpiredModalOpen(true); // Open the expired modal
  };

  const handleExpiredClick = async () => {
    try {
      if (!selectedTransaction || !selectedTransaction.transaction_id) {
        console.error("Transaction ID is not defined.");
        alert("Error updating transaction status. Please try again later.");
        return;
      }
  
      const body = {
        new_status: 'Expired',
      };
  
      const response = await fetch(`http://localhost:8800/adminrptax/updateExpired/${selectedTransaction.transaction_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      if (response.ok) {
        console.log('Transaction status updated successfully');

        const updatedTransactions = transactions.map((transaction) =>
          transaction.transaction_id === selectedTransaction.transaction_id
            ? { ...transaction, status_type: 'Expired' }
            : transaction
        );
  
        setTransactions(updatedTransactions);
        handleCloseModal('expired'); // Close the modal
      } else {
        console.error('Failed to update transaction status');
      }
    } catch (error) {
      console.error('Error updating transaction status', error);
    }
  };
  

  const handleSearch = (transaction) => {
    const transactionId = transaction.transaction_id.toUpperCase();
    const query = searchQuery.toUpperCase();
    return transactionId.includes(query);
  };

  const filteredTaxClearance = taxClearance.filter(handleSearch);

  const filteredTaxPayment = taxPayment.filter(handleSearch);

    return (
      <>
        {/* Requests Area */}
        <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-[#2b2b2b] dark:border-[#3d3d3d] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2)] rounded-sm border border-slate-200">
          <div className="px-5 py-5">
            <h1 className='font-medium text-center text-slate-700 dark:text-white mb-4'>Requests</h1>
  
            {/* Search */}
            <div className="flex items-center text-xs mb-7">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 pl-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path className='stroke-slate-400 dark:stroke-white' strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </span>
                {/* ITO YUNG SEARCH, ANG VALUE NITO MASSTORE SA LINE 32, AND EVERY CHANGES, NAG UUPDATE RIN ANG LINE 32 */}
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value.toUpperCase())} id="searchInput" type="text" placeholder="Search ID..." className="bg-transparent text-xs md:text-sm w-full border border-slate-300 text-slate-700 dark:text-white pl-8 py-1 md:py-0.5 rounded-sm"/>
              </div>
            </div>
  
            {/* Contents */}

            {/* Tax Clearance Sample */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
              
              {/* ITO NAMAN YUNG MAPPING, LAHAT NG LAMAN NG LINE 40, IDIDISPLAY NITO, SINCE ANG INITIAL AY WALA PA NAMANG VALUE ANG SEARCH QUERY, LAHAT IDIDISPLAY DITO AND MAG FIFILTER LANG KAPAG MAY NILAGAY NA SA SEARCH, AND MADIDISPLAY LANG YUNG MATCHED TRANSACTION */}
              {filteredTaxClearance.map((transaction) => (

              // ITO YUNG KAPAG PININDOT YUNG BUONG CARD, MAG OOPEN YUNG MODAL, IPAPASA YUNG DETAILS NG TRANSACTION NA PININDOT, AND ISESET SA PARAMETER NG LINE 19 NA ANG TYPE AY TAX CLEARANCE
              <div onClick={() => handleOpenViewModal(transaction, 'Real Property Tax Clearance')} key={transaction.transaction_id} className="cursor-pointer bg-white dark:bg-[#333333] shadow-[0_4px_10px_-1px_rgba(0,0,0,0.14)] dark:shadow-[0_4px_10px_-1px_rgba(0,0,0,0.2)] rounded-sm flex flex-col">
                <div className="text-xs font-semibold border-t-4 border-blue-500 text-slate-60 bg-slate-200 dark:bg-[#212121] dark:text-white rounded-t-sm px-4 py-1.5">
                  Transaction ID: {transaction.transaction_id}
                </div>
  
                <div className="flex-grow px-4 pt-5 pb-4">
                  <div className="text-xs text-slate-600 dark:text-slate-300 my-1">Type: {transaction.trans_type}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 my-1">TDN: {transaction.rp_tdn} </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 my-1">PIN: {transaction.rp_pin}  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 my-1">Date Processed: {date2}  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 my-1">Time Processed: {time2} </div>
                  <div className="flex justify-start items-center text-xs text-slate-600 dark:text-slate-300 my-1">
                    <span>Status: {transaction.status_type}</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 my-1">Amount Paid: P {transaction.amount}</div>
                </div>
  
                <div className="px-4 pb-5 space-x-4 flex justify-between items-center group">
                  <div onClick={() => handleExpiredModal(transaction, 'Real Property Tax Clearance')} className="flex justify-center items-center text-center cursor-pointer p-1 border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white rounded-sm mt-2 flex-grow">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                    <span className="text-xs font-normal">&nbsp;Expired</span>
                  </div>
                 <div onClick={() => handleOpenProcessModal(transaction, 'Real Property Tax Clearance')} className="flex justify-center items-center text-center cursor-pointer p-1 border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-sm mt-2 flex-grow">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span className="text-xs font-normal">&nbsp;Process</span>
                </div>

                </div>
              </div>
              ))} 

              {/* SAME LANG TO SA TAAS */}
              {/* Tax Payment Sample */}
              {filteredTaxPayment.map((transaction) => (
              <div onClick={() => handleOpenViewModal (transaction, 'Real Property Tax Payment')} key={transaction.transaction_id} className="cursor-pointer bg-white dark:bg-[#333333] shadow-[0_4px_10px_-1px_rgba(0,0,0,0.14)] dark:shadow-[0_4px_10px_-1px_rgba(0,0,0,0.2)] rounded-sm flex flex-col">
                <div className="text-xs font-semibold text-slate-60 border-t-4 border-[#0057e7] bg-slate-200 dark:bg-[#212121] dark:text-white rounded-t-sm px-4 py-1.5">
                  Transaction ID: {transaction.transaction_id}
                </div>
  
                <div className="flex-grow px-4 pt-5 pb-4">
                  <div className="text-xs text-slate-600 dark:text-slate-300 my-1">Type:  {transaction.trans_type}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 my-1">Account Name: {transaction.acc_name} </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 my-1">TDN: {transaction.rp_tdn}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 my-1">PIN: {transaction.rp_pin} </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 my-1">From: 1st Quarter </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 my-1">To: {transaction.period_id} </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 my-1">Date Processed: {date1}  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 my-1">Time Processed: {time1} </div>
                  <div className="flex justify-start items-center text-xs text-slate-600 dark:text-slate-300 my-1">
                    <span>Status: {transaction.status_type}</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 my-1">Amount Paid: P {transaction.amount}</div>
                </div>
  
                <div className="px-4 pb-5 space-x-4 flex justify-between items-center group">
                  <div onClick={() => handleExpiredModal(transaction, 'Real Property Tax Payment')} className="flex justify-center items-center text-center cursor-pointer p-1 border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white rounded-sm mt-2 flex-grow">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                    <span className="text-xs font-normal">&nbsp;Expired</span>
                  </div>
                  <div  onClick={() => handleOpenProcessModal(transaction, 'Real Property Tax Payment')} className="flex justify-center items-center text-center cursor-pointer p-1 border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-sm mt-2 flex-grow">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span className="text-xs font-normal">&nbsp;Process</span>
                  </div>
                </div>
              </div>
              ))} 

          {isExpiredModalOpen && (
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
                        Are you sure to mark this card as EXPIRED, after clicking the Expired button the process is irreversible.
                      </span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#212121] px-4 py-3 gap-3 sm:px-6 flex justify-end">
                <button
                    onClick={() => handleCloseModal('expired')}
                    type="button"
                    className="text-slate-500 text-xs md:text-sm ms-2 hover:text-white border border-slate-500 hover:bg-slate-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-normal rounded-full px-5 py-2 text-center mb-2 dark:border-slate-500 dark:text-white dark:hover:text-white dark:hover:bg-slate-500 dark:focus:ring-slate-800"
                  >
                    <p>Cancel</p>
                  </button>
                  <button
                  onClick={() => handleExpiredClick()}  // Add parentheses here
                  type="button"
                  className="text-white text-xs md:text-sm bg-yellow-500 border border-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-normal rounded-full px-5 py-2 text-center mb-2 dark:border-blue-500 dark:text-white dark:hover:text-white dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Expired
                </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {isProcessModalOpen && (
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
                        Click the PROCESS button to display the card on the Processing Area.
                      </span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#212121] px-4 py-3 gap-3 sm:px-6 flex justify-end">
                <button
                    onClick={() => handleCloseModal('process')}
                    type="button"
                    className="text-slate-500 text-xs md:text-sm ms-2 hover:text-white border border-slate-500 hover:bg-slate-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-normal rounded-full px-5 py-2 text-center mb-2 dark:border-slate-500 dark:text-white dark:hover:text-white dark:hover:bg-slate-500 dark:focus:ring-slate-800"
                  >
                    <p>Cancel</p>
                  </button>
                  <button
                  onClick={() => handleProcessClick()}  // Add parentheses here
                  type="button"
                  className="text-white text-xs md:text-sm bg-emerald-500 border border-emerald-500 hover:bg-emerald-600 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-normal rounded-full px-5 py-2 text-center mb-2 dark:border-blue-500 dark:text-white dark:hover:text-white dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Process
                </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {isViewModalOpen && selectedTransaction && !isExpiredModalOpen && !isProcessModalOpen && (
  // Only display AdminRPView when isViewModalOpen is true, selectedTransaction is set, 
  // and neither isExpiredModalOpen nor isProcessModalOpen is true
  <AdminRPView
    selectedTransaction={selectedTransaction}
    isOpen={isViewModalOpen}
    handleClose={handleCloseModal}
  />
)}


            </div>
          </div>
        </div>
      </>
    );
  };
  
  
  export default AdminRPTaxRequests;
  