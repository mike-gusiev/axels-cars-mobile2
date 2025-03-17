// import { Controller, useController } from 'react-hook-form';
import { TextInput, StyleSheet, View, Keyboard } from "react-native";
import { useState } from "react";
import PropTypes from "prop-types";

import ThemedText from "./ThemedText";

const CustomInput = ({
  rules,
  errors,
  style,
  name,
  control,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  onChangeText = undefined,
  multiline = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { field } = useController({ control, name });

  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleOnBlur = () => {
    setIsFocused(false);
  };

  const onChangeTextValue = (text) => {
    if (onChangeText) {
      onChangeText(text);
    }
  };

  return <Text>CustomInput.jsx</Text>;

  // return (
  //   <View
  //     style={{
  //       width: name === "firstName" || name === "lastName" ? "50%" : "100%",
  //     }}
  //   >
  //     <Controller
  //       control={control}
  //       render={({ field: { onChange, value } }) => (
  //         <TextInput
  //           multiline={multiline}
  //           onSubmitEditing={multiline ? Keyboard.dismiss : undefined}
  //           placeholderTextColor={"transparent"}
  //           style={[
  //             styles.textInput,
  //             style,
  //             {
  //               borderRightWidth: 1,
  //               borderLeftWidth: name === "lastName" && errors[name] ? 1 : 0,
  //               borderRightColor:
  //                 name === "firstName" && errors[name] ? "brown" : "#24272e",
  //               borderLeftColor:
  //                 name === "lastName" && errors[name] ? "brown" : "#24272e",
  //               borderBottomColor: errors[name]
  //                 ? "brown"
  //                 : isFocused
  //                 ? "#ffffff"
  //                 : "#24272e",
  //             },
  //           ]}
  //           placeholder={placeholder}
  //           onBlur={handleOnBlur}
  //           onFocus={handleFocus}
  //           onChangeText={onChange}
  //           value={value}
  //           onEndEditing={(e) => onChangeTextValue(e.nativeEvent.text)}
  //           // @ts-ignore
  //           keyboardType={keyboardType}
  //           secureTextEntry={secureTextEntry}
  //         />
  //       )}
  //       rules={rules}
  //       name={name}
  //     />

  //     <View
  //       pointerEvents="none"
  //       style={[
  //         styles.errorTextContainer,
  //         isFocused && styles.errorTextFocused,
  //         field.value && { top: -5 },
  //         errors[name] && { top: -5 },
  //       ]}
  //     >
  //       <ThemedText
  //         style={[
  //           styles.errorText,
  //           errors[name] && { color: "brown", fontSize: 11 },
  //           isFocused && !field.value && { fontSize: 11 },
  //           field.value && { fontSize: 11 },
  //         ]}
  //         lightColor={undefined}
  //         darkColor={undefined}
  //       >
  //         {errors[name] ? `${errors[name]?.message?.toString()}` : placeholder}
  //       </ThemedText>
  //     </View>
  //   </View>
  // );
};

const styles = StyleSheet.create({
  textInput: {
    width: "100%",
    backgroundColor: "black",
    color: "white",
    padding: 12,
    borderBottomWidth: 1,
  },
  errorTextContainer: { position: "absolute", top: 6, left: 12 },
  errorText: {
    fontSize: 14,
    color: "#353535",
  },
  errorTextFocused: {
    top: -5,
  },
});

CustomInput.propTypes = {
  rules: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  keyboardType: PropTypes.string,
  multiline: PropTypes.bool,
};

export default CustomInput;
