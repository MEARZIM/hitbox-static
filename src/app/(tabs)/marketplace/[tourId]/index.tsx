import TourScreen from "@/features/products/screens/TourScreen";
import { useLocalSearchParams } from "expo-router";
import React from 'react';


export default function SingleTour() {
    const { tourId } = useLocalSearchParams();
    return (
        <TourScreen tourId={tourId} />
    );
}
