import React, { useState, useEffect } from 'react';

interface CustomerSearchProps {
  customers: any[];
  onSelect: (customerId: string) => void;
  selectedCustomerId?: string;
  loading?: boolean;
}

const CustomerSearch: React.FC<CustomerSearchProps> = ({
  customers,
  onSelect,
  selectedCustomerId,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCustomers(customers.slice(0, 5));
    } else {
      const filtered = customers
        .filter(customer => 
          customer.id.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5);
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleCustomerSelect = (customerId: string) => {
    onSelect(customerId);
    setIsDropdownOpen(false);
    
    // 找到选中的客户并更新搜索框
    const selectedCustomer = customers.find(c => c.id === customerId);
    if (selectedCustomer) {
      setSearchTerm(selectedCustomer.id);
    }
  };

  return (
    <div className="customer-search relative">
      <div className="relative">
        <input
          type="text"
          placeholder="搜索客户ID..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setIsDropdownOpen(true)}
          onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      {isDropdownOpen && filteredCustomers.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          <ul className="py-1">
            {filteredCustomers.map(customer => (
              <li 
                key={customer.id}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  selectedCustomerId === customer.id ? 'bg-blue-50 text-blue-700' : ''
                }`}
                onClick={() => handleCustomerSelect(customer.id)}
              >
                <div className="flex justify-between items-center">
                  <span>{customer.id}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    customer.target === 1 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {customer.target === 1 ? '有交易' : '无交易'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {isDropdownOpen && searchTerm.trim() !== '' && filteredCustomers.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
          <div className="px-4 py-3 text-sm text-gray-500">
            没有找到匹配的客户
          </div>
        </div>
      )}
      
      {loading && (
        <div className="mt-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          <span className="ml-2 text-sm text-gray-500">加载中...</span>
        </div>
      )}
    </div>
  );
};

export default CustomerSearch;