import { Image } from "expo-image";
import { X } from "lucide-react-native";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, radii, spacing } from "../../constants/theme";

type Props = {
  visible: boolean;
  title: string;
  pages: number[];
  onClose: () => void;
};

const A4_RATIO = 842 / 596;

export function CourseReaderModal({ visible, title, pages, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const pageWidth = width - 24;
  const pageHeight = pageWidth * A4_RATIO;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.screen}>
        <View
          style={[
            styles.header,
            {
              paddingTop: insets.top + 10,
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.headerEyebrow}>SUPPORT DE COURS</Text>

            <Text style={styles.headerTitle} numberOfLines={1}>
              {title}
            </Text>
          </View>

          <Pressable style={styles.closeButton} onPress={onClose} hitSlop={8}>
            <X size={20} color={colors.ink} strokeWidth={2.2} />
          </Pressable>
        </View>

        <FlatList
          data={pages}
          keyExtractor={(_, index) => `course-page-${index}`}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingBottom: insets.bottom + 24,
            },
          ]}
          initialNumToRender={2}
          maxToRenderPerBatch={3}
          windowSize={4}
          showsVerticalScrollIndicator
          renderItem={({ item, index }) => (
            <View style={styles.pageContainer}>
              <Image
                source={item}
                style={{
                  width: pageWidth,
                  height: pageHeight,
                }}
                contentFit="contain"
                cachePolicy="memory-disk"
              />

              <Text style={styles.pageCounter}>
                {index + 1} / {pages.length}
              </Text>
            </View>
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#202225",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: spacing.screenX,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  headerEyebrow: {
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.muted,
  },

  headerTitle: {
    marginTop: 2,
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 16,
    color: colors.ink,
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: radii.iconTile,
    backgroundColor: colors.fillSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  listContent: {
    paddingTop: 12,
    gap: 12,
  },

  pageContainer: {
    alignItems: "center",
  },

  pageCounter: {
    marginTop: 6,
    fontFamily: "IBMPlexSans_500Medium",
    fontSize: 12,
    color: "#FFFFFFAA",
  },
});
