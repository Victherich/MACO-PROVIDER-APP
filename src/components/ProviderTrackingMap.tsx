import { useEffect, useRef } from "react";

interface Props {
  customerLocation?: { lat: number; lng: number } | null;
  providerLocation?: { lat: number; lng: number } | null;
  onRouteCalculated?: (info: {
    distanceText: string;
    durationText: string;
    distanceValue: number;
    durationValue: number;
  }) => void;
  onMapClick?: (loc: { lat: number; lng: number }) => void;
}

const ProviderTrackingMap: React.FC<Props> = ({
  customerLocation,
  providerLocation,
  onRouteCalculated,
  onMapClick
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const customerMarker = useRef<google.maps.Marker | null>(null);
  const providerMarker = useRef<google.maps.Marker | null>(null);
  const directionsRenderer = useRef<google.maps.DirectionsRenderer | null>(null);

  // INIT MAP + CLICK HANDLER
  useEffect(() => {
    if (!mapRef.current) return;

    map.current = new google.maps.Map(mapRef.current, {
      zoom: 14,
      center: { lat: 25.118, lng: 55.2 },
      disableDefaultUI: true
    });

    directionsRenderer.current = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      map: map.current
    });

    map.current.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      onMapClick?.({
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      });
    });
  }, []);

  // CUSTOMER MARKER
  useEffect(() => {
    if (!map.current || !customerLocation) return;

    if (!customerMarker.current) {
      customerMarker.current = new google.maps.Marker({
        position: customerLocation,
        map: map.current,
        label: "📍"
      });
      map.current.setCenter(customerLocation);
    }
  }, [customerLocation]);

  // PROVIDER MARKER (MOVES LIVE)
  useEffect(() => {
    if (!map.current || !providerLocation) return;

    if (!providerMarker.current) {
      providerMarker.current = new google.maps.Marker({
        position: providerLocation,
        map: map.current,
        label: "🚘"
      });
    } else {
      providerMarker.current.setPosition(providerLocation);
    }
  }, [providerLocation]);

  // DRAW ROUTE
  useEffect(() => {
    if (!map.current || !customerLocation || !providerLocation) return;

    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: providerLocation,
        destination: customerLocation,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === "OK" && result) {
          directionsRenderer.current?.setDirections(result);

          const leg = result.routes[0].legs[0];

          onRouteCalculated?.({
            distanceText: leg.distance?.text || "",
            durationText: leg.duration?.text || "",
            distanceValue: leg.distance?.value || 0,
            durationValue: leg.duration?.value || 0
          });
        }
      }
    );
  }, [customerLocation, providerLocation]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};

export default ProviderTrackingMap;
