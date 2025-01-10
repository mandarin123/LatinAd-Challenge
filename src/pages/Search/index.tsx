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
    setResults(searchResults);
    setMapCenter(center);
  };

  return (
    <AntdApp>
      <div className="w-full min-h-screen px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1">
            <SearchForm onSearchResults={handleSearchResults} />
          </div>
          <div className="col-span-1 md:col-span-3">
            {loading ? (
              <Card className="w-full h-[400px] flex items-center justify-center">
                <Spin size="large" tip="Cargando mapa..." />
              </Card>
            ) : (
              <>
                <DisplayMap 
                  displays={results}
                  center={mapCenter}
                />
                <div className="space-y-6 mt-5">
                  {results.map(display => (
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