import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useLocation } from 'react-router-dom';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import Footer from '../partials/Footer';
import ModalTransaction from '../partials/transactionModal/ModalTransaction';
import TransMobile from '../partials/transactionHistory/transMobile';
import TransDesktop from '../partials/transactionHistory/transDesktop';


const TransactionHistoryForm = () => {

  const location = useLocation();
  const { pathname } = location;
  const user_id = pathname.split("/")[2];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userTransaction, setUserTransaction] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortOption, setSortOption] = useState('date_processed');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDatee, setSelectedDatee] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [userPersonal, setUserPersonal]=useState({})

  useEffect(() => {
    const fetchUserPersonal = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/profile/${user_id}`);
        setUserPersonal(res.data.user_personal[0]);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserPersonal();
  }, [user_id]);

  useEffect(() => {
    const fetchUserTransaction = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/transachistory/${user_id}`);
        setUserTransaction(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserTransaction();
  }, [user_id]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (transaction) => {
    setIsModalOpen(true);
    setSelectedTransaction(transaction);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Filter for selected date range, type, status of transaction
  const handleSearch = (e) => {
    const searchInput = e.toUpperCase();
    setSearchInput(searchInput);
  
    const filteredTransactions = userTransaction.filter((transaction) => {
      const transactionId = transaction.transaction_id.toString().toUpperCase();
  
      return (
        transactionId.includes(searchInput) &&
        isSubsequence(searchInput, transactionId) &&
        (!selectedDate || new Date(transaction.date_processed) >= new Date(selectedDate)) &&
        (!selectedDatee || new Date(transaction.date_processed) <= new Date(selectedDatee)) &&
        (!selectedType || selectedType === 'All' || transaction.trans_type.toLowerCase() === selectedType.toLowerCase()) &&
        (!selectedStatus || selectedStatus === 'All' || transaction.status_type.toLowerCase() === selectedStatus.toLowerCase())
      );
    });
  
    setFilteredTransactions(filteredTransactions.length > 0 ? filteredTransactions : []);
  };    
  
  // Make sure that the transaction searching is the same order in terms of characters
  const isSubsequence = (search, str) => {
    let i = 0;
    let j = 0;
  
    while (j < str.length) {
      if (search[i] === str[j]) {
        i += 1;
      }
      if (i === search.length) {
        return true;
      }
      j += 1;
    }
  
    return false;
  };
  
  const handleDateChange = (startDate, endDate) => {
    setSelectedDate(startDate);
    setSelectedDatee(endDate);
    handleSearch(searchInput);
  };

  const handleClearFilter = () => {
    setSearchInput('');
    setFilteredTransactions([]);
    setSortOption('date_processed');
    setSortOrder('desc');
    setSelectedDate('');
    setSelectedDatee('');
    setSelectedStatus('');
    setSelectedType('');
  };

  const handleInputChange = (e) => {
    const selectedType = e.target.value;
    setSelectedType(selectedType);
    handleSearch(searchInput);
  };
  
  const handleInputChange2 = (e) => {
    const selectedStatus = e.target.value;
    setSelectedStatus(selectedStatus);
    handleSearch(searchInput);
  };  

  const handleSortChange = (option) => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  
    setSortOption(option);
    setSortOrder(newOrder);
  };
  
  const sortTransactions = (transactions) => {
    return transactions.slice().sort((a, b) => {
      const valueA = a[sortOption];
      const valueB = b[sortOption];
  
      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };

const sortedTransactions = sortTransactions(filteredTransactions.length > 0 ? filteredTransactions : userTransaction);


const SortIcon = ({ order }) => (
  <button className="group flex items-center px-1">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
      <path className="group-hover:stroke-black dark:group-hover:stroke-white cursor-pointer" strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
    </svg>
  </button>
  );

const logoSrc = '../src/images/mnl_footer.svg';

  return (
    <div className="flex h-screen overflow-hidden dark:bg-[#212121]">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="overflow-y-auto">
          <div className="flex flex-col justify-between mx-4 mt-4">
            
            {isMobileView ? (           
              // For Mobile View
              <TransMobile searchInput={searchInput} 
              handleSearch={handleSearch} 
              // handleSearchInputChange={handleSearchInputChange} 
              handleOpenModal={handleOpenModal}  
              handleClearFilter={handleClearFilter} 
              handleSortChange={handleSortChange}
              sortOption={sortOption}
              sortedTransactions={sortedTransactions} 
              handleInputChange={handleInputChange}
              handleInputChange2={handleInputChange2}
              selectedDate={selectedDate}
              selectedDatee={selectedDatee}
              selectedStatus={selectedStatus}
              selectedType={selectedType}
              userPersonal={userPersonal} />
            ) : (
              // For Desktop View
              <TransDesktop searchInput={searchInput} 
              handleSearch={handleSearch} 
              // handleSearchInputChange={handleSearchInputChange} 
              handleOpenModal={handleOpenModal} 
              handleClearFilter={handleClearFilter} 
              handleSortChange={handleSortChange}
              sortOption={sortOption}
              sortOrder={sortOrder}
              SortIcon={SortIcon}
              sortedTransactions={sortedTransactions} 
              selectedDate={selectedDate}
              selectedDatee={selectedDatee}
              selectedStatus={selectedStatus}
              handleInputChange={handleInputChange}
              handleInputChange2={handleInputChange2}
              selectedType={selectedType}
              userPersonal={userPersonal} />
            )}
          </div>
          <Footer logo={logoSrc} />
        </main>

        {isModalOpen && selectedTransaction && (
          <ModalTransaction user_id={user_id} selectedTransaction={selectedTransaction} modalType={selectedTransaction.trans_type} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  );
}

export default TransactionHistoryForm;
