import { ChevronDown } from "lucide-react-native";
import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Defs, Line, LinearGradient as SvgLinearGradient, Path, Stop, Rect, Text as SvgText } from "react-native-svg";

interface SaleRecord {
  price: string;
  date: string;
  buyer: string;
}

interface TourHistory {
  floorPrice: string;
  avgPrice: string;
  highestSale: string;
  sales: SaleRecord[];
  chartPath: string;
  chartFillPath: string;
  tooltipValue: string;
  tooltipDate: string;
  tooltipX: number;
  tooltipY: number;
  xAxis: string[];
  yAxis: string[];
}

const HISTORY_DATA: Record<string, TourHistory> = {
  '1': {
    floorPrice: "1,100",
    avgPrice: "1,210",
    highestSale: "1,650",
    sales: [
      { price: "1,650", date: "June 12, 2025", buyer: "Buyer 9A3...4F" },
      { price: "1,400", date: "June 10, 2025", buyer: "Buyer 2B8...1D" },
      { price: "1,250", date: "June 08, 2025", buyer: "Buyer 7F3...9C" },
      { price: "1,150", date: "June 05, 2025", buyer: "Buyer 4E1...2B" },
      { price: "1,100", date: "June 02, 2025", buyer: "Buyer 1C2...8A" },
    ],
    chartPath: "M 10 70 L 30 80 L 50 60 L 70 65 L 90 50 L 110 55 L 130 40 L 150 45 L 170 35 L 190 38 L 210 30 L 230 30",
    chartFillPath: "M 10 70 L 30 80 L 50 60 L 70 65 L 90 50 L 110 55 L 130 40 L 150 45 L 170 35 L 190 38 L 210 30 L 230 30 L 230 110 L 10 110 Z",
    tooltipValue: "1,650",
    tooltipDate: "June 12",
    tooltipX: 230,
    tooltipY: 30,
    xAxis: ["May 15", "May 22", "May 29", "June 05", "June 12"],
    yAxis: ["2,000", "1,500", "1,000", "500", "00"]
  },
  '2': {
    floorPrice: "750",
    avgPrice: "812",
    highestSale: "980",
    sales: [
      { price: "980", date: "May 20, 2026", buyer: "Buyer 5C3...2A" },
      { price: "850", date: "May 18, 2026", buyer: "Buyer 8A2...9B" },
      { price: "820", date: "May 15, 2026", buyer: "Buyer 1D4...4C" },
      { price: "790", date: "May 12, 2026", buyer: "Buyer 3E7...6F" },
      { price: "760", date: "May 10, 2026", buyer: "Buyer 9B4...2E" },
    ],
    chartPath: "M 10 90 L 30 85 L 50 80 L 70 70 L 90 75 L 110 65 L 130 60 L 150 62 L 170 50 L 190 55 L 210 48 L 230 48",
    chartFillPath: "M 10 90 L 30 85 L 50 80 L 70 70 L 90 75 L 110 65 L 130 60 L 150 62 L 170 50 L 190 55 L 210 48 L 230 48 L 230 110 L 10 110 Z",
    tooltipValue: "980",
    tooltipDate: "May 20",
    tooltipX: 230,
    tooltipY: 48,
    xAxis: ["Apr 12", "Apr 19", "Apr 26", "May 03", "May 20"],
    yAxis: ["1,200", "900", "600", "300", "00"]
  },
  '3': {
    floorPrice: "2,800",
    avgPrice: "2,942",
    highestSale: "3,750",
    sales: [
      { price: "3,750", date: "May 18, 2024", buyer: "Buyer 8F2...7A" },
      { price: "3,200", date: "May 16, 2024", buyer: "Buyer 3C1...9D" },
      { price: "2,950", date: "May 14, 2024", buyer: "Buyer A7B...2C" },
      { price: "2,600", date: "May 12, 2024", buyer: "Buyer D4E...8F" },
      { price: "2,400", date: "May 10, 2024", buyer: "Buyer 9B8...1A" },
    ],
    chartPath: "M 10 80 L 30 60 L 50 62 L 70 55 L 90 75 L 110 50 L 130 45 L 150 48 L 170 60 L 190 62 L 210 45 L 230 45",
    chartFillPath: "M 10 80 L 30 60 L 50 62 L 70 55 L 90 75 L 110 50 L 130 45 L 150 48 L 170 60 L 190 62 L 210 45 L 230 45 L 230 110 L 10 110 Z",
    tooltipValue: "3,200",
    tooltipDate: "May 19",
    tooltipX: 230,
    tooltipY: 45,
    xAxis: ["Apr 21", "Apr 28", "May 5", "May 12", "May 19"],
    yAxis: ["4,000", "3,000", "2,000", "1,000", "00"]
  }
};

function PurpleDiamond() {
  return (
    <Svg height="12" width="12" viewBox="0 0 24 24" style={{ marginRight: 6 }}>
      <Path
        d="M12 2L2 12l10 10 10-10L12 2z"
        fill="#a855f7"
      />
    </Svg>
  );
}

interface HistorySectionProps {
  tourId?: string | string[];
}

export default function HistorySection({ tourId }: HistorySectionProps) {
  const activeId = Array.isArray(tourId) ? tourId[0] : tourId;
  const data = HISTORY_DATA[activeId || '3'] || HISTORY_DATA['3'];

  // Handle responsive layout for different screens (portrait phones vs wider tablets)
  const { width: screenWidth } = Dimensions.get("window");
  const isNarrow = screenWidth < 640;

  // SVG Tooltip calculations to scale cleanly in SVG space and prevent overflow on the edges
  const tooltipWidth = 44;
  const tooltipHeight = 22;
  const isRightEdge = data.tooltipX > 180;
  const rectX = isRightEdge ? data.tooltipX - tooltipWidth - 4 : data.tooltipX - tooltipWidth / 2;
  const rectY = data.tooltipY - tooltipHeight - 6;
  const textX = isRightEdge ? data.tooltipX - tooltipWidth / 2 - 4 : data.tooltipX;

  const contentLayout = isNarrow 
    ? "flex-col gap-y-8" 
    : "flex-row items-stretch justify-between";

  const leftColumnStyle = isNarrow 
    ? "w-full pb-6 border-b border-white/5" 
    : "flex-[1.4] pr-5 border-r border-white/5 justify-between";

  const rightColumnStyle = isNarrow 
    ? "w-full pt-2" 
    : "flex-[1] pl-5 justify-between";

  return (
    <View 
      className={`border border-white/5 bg-[#110e16]/30 rounded-[24px] p-5 ${contentLayout}`}
      style={{ minHeight: isNarrow ? undefined : 280 }}
    >
      {/* Left Column: Price History */}
      <View className={leftColumnStyle}>
        {/* Header Row */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-[14px] font-bold">Price History</Text>
          <TouchableOpacity 
            className="flex-row items-center bg-[#171321] border border-white/5 rounded-lg px-2.5 py-1.5 gap-1"
          >
            <Text className="text-zinc-400 text-[10px] font-bold">30 Days</Text>
            <ChevronDown size={10} color="#71717a" />
          </TouchableOpacity>
        </View>

        {/* SVG Line Chart */}
        <View className="relative h-[120px] w-full mt-1">
          {/* Y Axis Labels */}
          <View className="absolute left-0 top-0 bottom-0 w-8 justify-between z-10 py-1">
            {data.yAxis.map((val, idx) => (
              <Text key={idx} className="text-zinc-600 text-[8px] font-black text-right pr-1">
                {val}
              </Text>
            ))}
          </View>

          {/* Svg area */}
          <View className="ml-8 flex-1 relative">
            <Svg height="100%" width="100%" viewBox="0 0 240 110">
              <Defs>
                <SvgLinearGradient id="purpleGlow" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
                  <Stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                </SvgLinearGradient>
              </Defs>

              {/* Grid Lines */}
              <Line x1="10" y1="20" x2="230" y2="20" stroke="#1f182c" strokeWidth="0.8" strokeDasharray="3 3" />
              <Line x1="10" y1="50" x2="230" y2="50" stroke="#1f182c" strokeWidth="0.8" strokeDasharray="3 3" />
              <Line x1="10" y1="80" x2="230" y2="80" stroke="#1f182c" strokeWidth="0.8" strokeDasharray="3 3" />

              {/* Gradient Area under line */}
              <Path d={data.chartFillPath} fill="url(#purpleGlow)" />

              {/* Purple Trend Line */}
              <Path d={data.chartPath} fill="none" stroke="#a855f7" strokeWidth="2" />

              {/* Tooltip Box Rect (Centered inside Svg coordinates for absolute responsiveness) */}
              <Rect 
                x={rectX} 
                y={rectY} 
                width={tooltipWidth} 
                height={tooltipHeight} 
                fill="#0b0811" 
                stroke="#a855f7" 
                strokeWidth="0.8" 
                rx="4" 
                ry="4" 
              />
              
              {/* Tooltip Text - Price */}
              <SvgText 
                x={textX} 
                y={rectY + 9.5} 
                fill="white" 
                fontSize="7.5" 
                fontWeight="bold" 
                textAnchor="middle"
              >
                {data.tooltipValue}
              </SvgText>

              {/* Tooltip Text - Date */}
              <SvgText 
                x={textX} 
                y={rectY + 17} 
                fill="#71717a" 
                fontSize="6" 
                fontWeight="bold" 
                textAnchor="middle"
              >
                {data.tooltipDate}
              </SvgText>

              {/* Active Point Dot */}
              <Circle cx={data.tooltipX} cy={data.tooltipY} r="4" fill="white" stroke="#a855f7" strokeWidth="2.5" />
            </Svg>
          </View>
        </View>

        {/* X Axis Date Labels */}
        <View className="flex-row justify-between pl-8 mt-1.5">
          {data.xAxis.map((val, idx) => (
            <Text key={idx} className="text-zinc-500 text-[8.5px] font-bold">
              {val}
            </Text>
          ))}
        </View>

        {/* Summary Statistics Row */}
        <View className="flex-row justify-between items-center mt-5 pt-3.5 border-t border-white/5 pl-2">
          {/* Floor Price */}
          <View className="items-start gap-1">
            <Text className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider">Floor Price</Text>
            <View className="flex-row items-center">
              <PurpleDiamond />
              <Text className="text-white text-[13px] font-black">{data.floorPrice}</Text>
              <Text className="text-zinc-500 text-[8.5px] font-black ml-1 uppercase">HIT</Text>
            </View>
          </View>

          {/* Avg Price */}
          <View className="items-start gap-1">
            <Text className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider">Avg. Price (30d)</Text>
            <View className="flex-row items-center">
              <PurpleDiamond />
              <Text className="text-white text-[13px] font-black">{data.avgPrice}</Text>
              <Text className="text-zinc-500 text-[8.5px] font-black ml-1 uppercase">HIT</Text>
            </View>
          </View>

          {/* Highest Sale */}
          <View className="items-start gap-1">
            <Text className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider">Highest Sale</Text>
            <View className="flex-row items-center">
              <PurpleDiamond />
              <Text className="text-white text-[13px] font-black">{data.highestSale}</Text>
              <Text className="text-zinc-500 text-[8.5px] font-black ml-1 uppercase">HIT</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Right Column: Sales History */}
      <View className={rightColumnStyle}>
        {/* Header Row */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-[14px] font-bold">Sales History</Text>
          <TouchableOpacity>
            <Text className="text-[#a855f7] text-[10px] font-bold">View All</Text>
          </TouchableOpacity>
        </View>

        {/* Sales List */}
        <View className="flex-1 justify-between py-1">
          {data.sales.map((sale, idx) => (
            <View 
              key={idx} 
              className={`flex-row justify-between items-center py-2 ${
                idx < data.sales.length - 1 ? "border-b border-white/5" : ""
              }`}
            >
              {/* Price & Date left */}
              <View className="flex-row items-center">
                <PurpleDiamond />
                <View className="gap-0.5">
                  <Text className="text-white text-[11px] font-black">{sale.price}</Text>
                  <Text className="text-zinc-500 text-[8px] font-bold">{sale.date}</Text>
                </View>
              </View>

              {/* Status & Buyer right */}
              <View className="items-end gap-0.5">
                <Text className="text-zinc-300 text-[9px] font-bold">Sale</Text>
                <Text className="text-zinc-500 text-[8px] font-medium">{sale.buyer}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
