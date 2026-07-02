import { router } from "expo-router";
import { ArrowLeft, MoreHorizontal, Share2 } from "lucide-react-native";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  TourCard,
  TourHeaderDetails,
  AboutSection,
  ActionGrid,
  OwnershipProof,
  OwnershipWidget,
  TabSection,
} from "../components/Tour";


interface TourScreenProps {
  tourId?: string | string[];
}

const TOUR_DATA: Record<string, {
  title: string;
  subtitle: string;
  itemSubtitle: string;
  description: string;
  image: string;
  cardLabel?: string;
  editionLabel?: string;
  itemType: string;
  cardNo?: string;
  rarity: string;
  collection: string;
  collectionSub?: string;
  ownedSince: string;
  aboutText: string;
  supply: number;
  ownedPercentage: number;
  txHash: string;
  displayHash: string;
  verifiedDate: string;
}> = {
  '1': {
    title: "Warped Tour 2026",
    subtitle: "VIP Laminate",
    itemSubtitle: "Access Card",
    description: "Official Warped Tour 2026 VIP Laminate pass. Grants full backstage access, meet & greets, and premium side-stage viewing.",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=60",
    cardLabel: "PASS #05",
    editionLabel: "VIP EXCLUSIVE",
    itemType: "VIP Pass",
    cardNo: "#05 / 50",
    rarity: "Legendary",
    collection: "Warped Tour 2026",
    collectionSub: "VIP Passes",
    ownedSince: "June 12, 2025",
    aboutText: "Official Warped Tour 2026 VIP Laminate pass. Part of a limited run of 50 VIP passes. Includes access to premium viewing zones, meet & greets, and exclusive digital experiences.",
    supply: 50,
    ownedPercentage: 10,
    txHash: "0x8f2d5a3e1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e",
    displayHash: "0x8f2d...7d6e",
    verifiedDate: "June 12, 2025 at 11:15 AM",
  },
  '2': {
    title: "Pierce The Veil",
    subtitle: "PTV Funko Pop! #02",
    itemSubtitle: "Custom Vinyl Figure",
    description: "Limited edition custom Pierce The Veil Funko Pop collectible figure, celebrating the band's 2026 tour lineup.",
    image: "https://images.unsplash.com/photo-1559251606-c623743a6d76?w=400&auto=format&fit=crop&q=60",
    cardLabel: "FIGURE #42",
    editionLabel: "LIMITED VINYL",
    itemType: "Vinyl Figure",
    cardNo: "#42 / 250",
    rarity: "Uncommon",
    collection: "Pierce The Veil",
    collectionSub: "Vinyl Figures",
    ownedSince: "April 20, 2026",
    aboutText: "Official PTV custom Funko Pop series collectible. Features frontman-inspired styling. Only 250 physical units minted with digital counterpart validation.",
    supply: 250,
    ownedPercentage: 25,
    txHash: "0x3c2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4g",
    displayHash: "0x3c2a...7d6e",
    verifiedDate: "April 20, 2026 at 4:20 PM",
  },
  '3': {
    title: "Pierce The Veil",
    subtitle: "Warped Tour 2026",
    itemSubtitle: "Signature Series Card",
    description: "Limited edition physical trading card from the official Warped Tour 2026 Signature Series.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdNk8gPXVHoh_q6lkzrCnuwYSoDzrZ3n9QybD3xMjksBqgbV3g3mEcuAiK&s=10",
    cardLabel: "CARD #18",
    editionLabel: "LIMITED EDITION",
    itemType: "Trading Card",
    cardNo: "#18 / 100",
    rarity: "Rare",
    collection: "Pierce The Veil",
    collectionSub: "Warped Tour 2026",
    ownedSince: "May 18, 2024",
    aboutText: "Official Pierce The Veil Signature Series trading card from Warped Tour 2026. Part of a limited run of 100 cards. Each card includes exclusive digital content and experience access.",
    supply: 100,
    ownedPercentage: 18,
    txHash: "0x4a3f5b8c9d2e1f0a7b6c5d4e3f2a1b0c9d8e7f6",
    displayHash: "0x4a3f...7b8c9d",
    verifiedDate: "May 18, 2024 at 2:31 PM",
  }
};

export default function TourScreen({ tourId }: TourScreenProps) {
  const insets = useSafeAreaInsets();
  
  const activeId = Array.isArray(tourId) ? tourId[0] : tourId;
  const currentTour = TOUR_DATA[activeId || '3'] || TOUR_DATA['3'];

  return (
    <View className="flex-1 bg-[#08060b] w-full relative">
      {/* Top Absolute Custom Navigation Header */}
      <View 
        style={{ paddingTop: insets.top + 8 }}
        className="absolute top-0 left-0 right-0 z-50 flex-row items-center justify-between px-6 pb-3"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-black/40 border border-white/5 active:bg-black/60"
        >
          <ArrowLeft size={18} color="white" />
        </TouchableOpacity>

        <View className="flex-row gap-2">
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-black/40 border border-white/5 active:bg-black/60">
            <Share2 size={16} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-black/40 border border-white/5 active:bg-black/60">
            <MoreHorizontal size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingTop: insets.top + 80, // Pushes split content further down relative to absolute header
          paddingBottom: 60 
        }}
        className="flex-1"
      >
        {/* Main Header Split Section */}
        <View className="flex-row px-5 pt-4 pb-4 items-stretch justify-between bg-[#08060b]">
          <TourCard 
            image={currentTour.image}
          />
          <TourHeaderDetails 
            title={currentTour.title}
            subtitle={currentTour.subtitle}
            itemSubtitle={currentTour.itemSubtitle}
            description={currentTour.description}
            itemType={currentTour.itemType}
            cardNo={currentTour.cardNo}
            rarity={currentTour.rarity}
            collection={currentTour.collection}
            collectionSub={currentTour.collectionSub}
            ownedSince={currentTour.ownedSince}
          />
        </View>

        {/* Ownership Widget */}
        <OwnershipWidget />

        {/* Tab Section containing details content */}
        <TabSection
          tourId={tourId}
          renderActiveContent={() => (
            <View className="gap-y-6">
              {/* About and stats section */}
              <AboutSection 
                aboutText={currentTour.aboutText}
                rarity={currentTour.rarity}
                supply={currentTour.supply}
                ownedPercentage={currentTour.ownedPercentage}
              />

              {/* Action grid (Experience, Rewards, List, etc) */}
              <ActionGrid />

              {/* Ownership proof blockchain details */}
              <OwnershipProof 
                txHash={currentTour.txHash}
                displayHash={currentTour.displayHash}
                verifiedDate={currentTour.verifiedDate}
              />
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
}


