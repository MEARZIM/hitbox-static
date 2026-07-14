import { useLocalSearchParams } from "expo-router";
import React from 'react';
import TourScreen from "../../../../features/marketplace/screens/TourScreen";

export default function SingleTour() {
    const { tourId } = useLocalSearchParams();
    return (
        <TourScreen tourId={tourId} />
    );
}