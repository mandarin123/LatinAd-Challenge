import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, InfoWindow } from '@react-google-maps/api';
import { DisplayResponse } from '../../services/displays.service';
import { Card, Typography, Tag, Spin } from 'antd';

const { Text, Title } = Typography;

interface DisplayMapProps {
    displays: DisplayResponse[];
    center: {
        lat: number;
        lng: number;
    };
}

const DisplayMap: React.FC<DisplayMapProps> = ({ displays, center }) => {
    const [selectedDisplay, setSelectedDisplay] = useState<DisplayResponse | null>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_ID || '',
        libraries: ['marker']
    });

    const mapContainerStyle = {
        width: '100%',
        height: '500px',
        borderRadius: '8px',
    };

    const mapOptions = {
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        mapId: process.env.REACT_APP_GOOGLE_MAPS_ID || 'DEMO_MAP_ID'
    };

    const createMarkers = async (map: google.maps.Map) => {
        try {
            const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

            markers.forEach(marker => {
                marker.map = null;
            });

            const newMarkers = await Promise.all(displays.map(async (display) => {
                const markerElement = new AdvancedMarkerElement({
                    map,
                    position: {
                        lat: Number(display.latitude),
                        lng: Number(display.longitude)
                    },
                    title: display.name,
                    content: new PinElement({
                        background: display.is_online ? "#4CAF50" : "#FF5722",
                        glyphColor: "#FFFFFF",
                        borderColor: "#101e53",
                        scale: 1.2
                    }).element
                });

                markerElement.addListener('click', () => {
                    setSelectedDisplay(display);
                });

                return markerElement;
            }));

            setMarkers(newMarkers);
            console.log('Marcadores creados:', newMarkers.length);
        } catch (error) {
            console.error('Error al crear los marcadores:', error);
        }
    };

    useEffect(() => {
        if (map && displays.length > 0) {
            createMarkers(map);
        }
    }, [map, displays]);

    useEffect(() => {
        return () => {
            markers.forEach(marker => {
                marker.map = null;
            });
        };
    }, [markers]);

    if (loadError) {
        return <div>Error al cargar el mapa: {loadError.message}</div>;
    }

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="relative min-h-[500px]">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={13}
                options={{
                    ...mapOptions,
                    styles: [
                        {
                            featureType: "all",
                            elementType: "all",
                            stylers: [
                                { visibility: "on" }
                            ]
                        }
                    ]
                }}
                onLoad={async (map) => {
                    setMap(map);
                    if (displays.length > 0) {
                        const bounds = new google.maps.LatLngBounds();
                        displays.forEach(display => {
                            if (display.latitude && display.longitude) {
                                bounds.extend({
                                    lat: Number(display.latitude),
                                    lng: Number(display.longitude)
                                });
                            }
                        });
                        map.fitBounds(bounds);
                        await createMarkers(map);
                    }
                }}
            >
                {selectedDisplay && (
                    <InfoWindow
                        position={{
                            lat: Number(selectedDisplay.latitude),
                            lng: Number(selectedDisplay.longitude),
                        }}
                        options={{
                            disableAutoPan: true,
                        }}
                        onCloseClick={() => setSelectedDisplay(null)}
                    >

                        <Card className="max-w-sm border-0 shadow-none">
                            <Title level={5} className="m-0 mb-2">
                                {selectedDisplay.name}
                            </Title>

                            <div className="flex gap-2 mb-2">
                                <Tag color="blue">{selectedDisplay.location_type}</Tag>
                                <Tag color="green">{selectedDisplay.size_type}</Tag>
                            </div>

                            <div className="space-y-1">
                                <Text className="block text-sm">
                                    <span className="font-semibold">Dimensiones:</span>{' '}
                                    {selectedDisplay.size_width}x{selectedDisplay.size_height}m
                                </Text>
                                <Text className="block text-sm">
                                    <span className="font-semibold">Resolución:</span>{' '}
                                    {selectedDisplay.resolution_width}x{selectedDisplay.resolution_height}px
                                </Text>
                                <Text className="block text-sm text-blue-600 font-semibold">
                                    ${selectedDisplay.price_per_day.toLocaleString()}/día
                                </Text>
                            </div>

                            <Text className="block text-xs text-gray-500 mt-2">
                                {selectedDisplay.formatted_address}
                            </Text>
                        </Card>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    );
};

export default DisplayMap;
