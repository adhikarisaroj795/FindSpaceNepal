import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Property {
  id: string;
  // Add other properties you need like title, image, etc.
}

export default function Explore() {
  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  // Sample data with proper structure
  const recommendations: Property[] = [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
  ];
  const loading = false;

  const featuredProperties: Property[] = [
    { id: "4" },
    { id: "5" },
    { id: "6" },
    { id: "7" },
  ];

  const featuredPropertiesLoading = false;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={recommendations}
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleCardPress(item.id)} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" className="text-primary-300 mt-5" />
          ) : (
            <NoResults />
          )
        }
        ListHeaderComponent={
          <View className="px-5">
            <View className="flex flex-row items-center justify-between mt-5">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center"
              >
                <Image source={icons.backArrow} className="size-5" />
              </TouchableOpacity>

              <Text className="text-base mr-2 text-center font-rubik-medium text-black-300">
                Search for your ideal space
              </Text>
              <Image source={icons.bell} className="w-6 h-6" />
            </View>
            <Search />
            <View className="mt-5">
              <Filters />
              <Text className="text-xl font-rubik-bold text-black-300 mt-5">
                Found {recommendations?.length} Properties
              </Text>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}
