import { View, Text, Image } from "react-native";
import icons from "@/constants/icons";

interface CommentItem {
  id: string;
  avatar: string;
  name: string;
  review: string;
  likes: number;
  createdAt: string;
}

interface Props {
  item?: CommentItem; // Made optional
}

const Comment = ({ item }: Props) => {
  // Dummy data
  const dummyData: CommentItem = {
    id: "1",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Jane Doe",
    review:
      "This is a sample comment text showing how the component would look with dummy data.",
    likes: 120,
    createdAt: new Date().toISOString(),
  };

  // Use item if provided, otherwise use dummy data
  const data = item || dummyData;

  return (
    <View className="flex flex-col items-start mb-6 p-4 bg-white rounded-lg">
      <View className="flex flex-row items-center">
        <Image
          source={{ uri: data.avatar }}
          className="w-12 h-12 rounded-full"
          resizeMode="cover"
        />
        <Text className="text-base text-black-300 text-start font-rubik-bold ml-3">
          {data.name}
        </Text>
      </View>

      <Text className="text-black-200 text-base font-rubik mt-2">
        {data.review}
      </Text>

      <View className="flex flex-row items-center w-full justify-between mt-4">
        <View className="flex flex-row items-center">
          <Image
            source={icons.heart}
            className="w-5 h-5"
            tintColor={"#0061FF"}
          />
          <Text className="text-black-300 text-sm font-rubik-medium ml-2">
            {data.likes}
          </Text>
        </View>
        <Text className="text-black-100 text-sm font-rubik">
          {new Date(data.createdAt).toDateString()}
        </Text>
      </View>
    </View>
  );
};

export default Comment;
