import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { primaryColor } from "@/util/helpers";

interface ResultModalProps {
  isModalVisible: boolean;
  correctCount: number;
  incorrectCount: number;
  totalCount: number;
  handleOnClose: () => void;
  handleRetry: () => void;
  handleHome: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({
  isModalVisible,
  correctCount,
  incorrectCount,
  totalCount,
  handleOnClose,
  handleRetry,
  handleHome,
}) => {
  const unattemptedQuestion = totalCount - (incorrectCount + correctCount);
  return (
    <Modal
      animationType={"slide"}
      transparent={true}
      visible={isModalVisible}
      onRequestClose={handleOnClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#000" + "90",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            width: "90%",
            borderRadius: 5,
            padding: 40,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 28, color: "#000" }}>Results</Text>

          <View style={{ alignItems: "center", marginBottom: 30 }}>
            <Text style={{ color: "#000", fontSize: 30, fontWeight: "900" }}>
              {`${correctCount * 5} / ${totalCount * 5}`}
            </Text>
            <Text style={{ fontSize: 16 }}>Total Marks</Text>
          </View>
          <Text style={{ opacity: 0.8 }}>
            {unattemptedQuestion > 0 ? unattemptedQuestion : 0} Unattempted
          </Text>

          {/* Try agian */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 10,
              width: "100%",
              backgroundColor: primaryColor,
              marginTop: 20,
              borderRadius: 6,
            }}
            onPress={handleRetry}
          >
            <MaterialIcons name="replay" style={{ color: "#fff" }} />
            <Text
              style={{
                textAlign: "center",
                color: "#fff",
                marginLeft: 10,
              }}
            >
              Try Again
            </Text>
          </TouchableOpacity>
          {/* Go Home */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 10,
              width: "100%",
              backgroundColor: primaryColor + "20",
              marginTop: 20,
              borderRadius: 6,
            }}
            onPress={handleHome}
          >
            <MaterialIcons name="home" style={{ color: primaryColor }} />
            <Text
              style={{
                textAlign: "center",
                color: primaryColor,
                marginLeft: 10,
              }}
            >
              Go Home
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ResultModal;
