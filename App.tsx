import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import calculator, { initialState } from "./src/util/calculator";
import Row from "./src/View/Row";
import Button from "./src/Components/Button";

export default function App() {
  const [state, setState] = useState(initialState);

  const handleTap = (type: string, value: any = 0) => {
    setState((prevState) => calculator(type, value, prevState));
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <SafeAreaView>
        <Text style={styles.value}>
          {parseFloat(state.currentValue).toLocaleString()}
        </Text>

        <Row>
          <Button
            size="primary"
            text="C"
            theme="secondary"
            onPress={() => handleTap("clear")}
          />

          <Button
            size="primary"
            text="+/-"
            theme="secondary"
            onPress={() => handleTap("posneg")}
          />

          <Button
            size="primary"
            text="%"
            theme="secondary"
            onPress={() => handleTap("percentage")}
          />

          <Button
            size="primary"
            text="/"
            theme="accent"
            onPress={() => handleTap("operator", "/")}
          />
        </Row>

        {/* Number */}
        <Row>
          <Button
            theme="primary"
            size="primary"
            text="7"
            onPress={() => handleTap("number", 7)}
          />
          <Button
            theme="primary"
            size="primary"
            text="8"
            onPress={() => handleTap("number", 8)}
          />
          <Button
            theme="primary"
            size="primary"
            text="9"
            onPress={() => handleTap("number", 9)}
          />
          <Button
            size="primary"
            text="X"
            theme="accent"
            onPress={() => handleTap("operator", "*")}
          />
        </Row>

        <Row>
          <Button
            theme="primary"
            size="primary"
            text="5"
            onPress={() => handleTap("number", 5)}
          />
          <Button
            theme="primary"
            size="primary"
            text="6"
            onPress={() => handleTap("number", 6)}
          />
          <Button
            theme="primary"
            size="primary"
            text="7"
            onPress={() => handleTap("number", 7)}
          />
          <Button
            size="primary"
            text="-"
            theme="accent"
            onPress={() => handleTap("operator", "-")}
          />
        </Row>

        <Row>
          <Button
            theme="primary"
            size="primary"
            text="1"
            onPress={() => handleTap("number", 1)}
          />
          <Button
            theme="primary"
            size="primary"
            text="2"
            onPress={() => handleTap("number", 2)}
          />
          <Button
            theme="primary"
            size="primary"
            text="3"
            onPress={() => handleTap("number", 3)}
          />
          <Button
            size="primary"
            text="+"
            theme="accent"
            onPress={() => handleTap("operator", "+")}
          />
        </Row>

        <Row>
          <Button
            theme="primary"
            size="primary"
            text="0"
            onPress={() => handleTap("number", 0)}
          />
          <Button
            theme="primary"
            size="primary"
            text="."
            onPress={() => handleTap("number", ".")}
          />
          <Button
            size="primary"
            text="="
            theme="primary"
            onPress={() => handleTap("equal", "=")}
          />
        </Row>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#202020",
    justifyContent: "flex-end",
  },
  value: {
    color: "#fff",
    fontSize: 42,
    textAlign: "right",
    marginRight: 20,
    marginBottom: 10,
  },
});
