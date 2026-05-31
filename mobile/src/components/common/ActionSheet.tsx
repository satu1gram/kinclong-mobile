import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  type ViewStyle,
} from 'react-native';

export interface ActionSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxHeight?: number | string;
  contentStyle?: ViewStyle;
}

export function ActionSheet({
  visible,
  onClose,
  title,
  children,
  contentStyle,
}: ActionSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-end">
          <TouchableWithoutFeedback>
            <View
              className="bg-white rounded-t-3xl"
              style={[{ maxHeight: '90%' }, contentStyle]}
            >
              {/* Handle bar */}
              <View className="items-center pt-3 pb-1">
                <View className="w-9 h-1 bg-slate-200 rounded-full" />
              </View>

              {/* Close button */}
              <TouchableOpacity
                onPress={onClose}
                className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 items-center justify-center z-10"
              >
                <Text className="text-slate-500 text-base leading-none">✕</Text>
              </TouchableOpacity>

              {title && (
                <Text className="text-slate-900 text-base font-bold px-5 pt-2 pb-3">
                  {title}
                </Text>
              )}

              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 36 }}
              >
                {children}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default ActionSheet;
