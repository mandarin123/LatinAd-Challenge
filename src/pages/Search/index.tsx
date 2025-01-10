import React, { useState } from 'react';
import SearchForm from '../../components/search/SearchForm';
import DisplayMap from '../../components/search/DisplayMap';
import ResultCard from '../../components/search/ResultCard';
import { Card, Spin, App as AntdApp } from 'antd';
import { useAppSelector } from '../../hooks/redux';

const Search: React.FC = () => {
  const { loading } = useAppSelector(state => state.search);
  const [results, setResults] = useState<any[]>([]);
  const [mapCenter, setMapCenter] = useState({ lat: -34.6037, lng: -58.3816 });

  const handleSearchResults = (searchResults: any[], center: { lat: number; lng: number }) => {
    const resultsArray = Array.isArray(searchResults) 
      ? searchResults 
      : Object.values(searchResults).filter(item => item !== null);
    
    setResults(resultsArray);
    setMapCenter(center);
  };
  
  return (
    <AntdApp>
      <div className="w-full min-h-screen px-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1">
            <SearchForm onSearchResults={handleSearchResults} />
          </div>
          <div className="col-span-1 md:col-span-3">
            {loading ? (
              <Card className="w-full h-[400px] flex items-center justify-center">
                <div style={{ position: 'relative', minHeight: '200px' }}>
                  <Spin 
                    style={{ 
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                </div>
              </Card>
            ) : (
              <>
                <DisplayMap 
                  displays={results}
                  center={mapCenter}
                />
                <div className="space-y-6 mt-5">
                  {results.length > 0 && results.map(display => (
                    <ResultCard
                      key={display.id}
                      display={display}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AntdApp>
  );
};

export default Search; 