import React from "react";
import { PaperProvider } from "react-native-paper";
import { Stack } from "expo-router";
import { PrivyProvider } from "@privy-io/expo";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <PaperProvider>
      {/* <PrivyProvider
        appId='cm94dmrnd00usjo0lpdlgdid4'
        clientId='client-WY5iiwsBNgWQFqGPV4c4p8hTWYttZ1YgZdxF8NcQwZTHk'
        >
      <Slot /> */}
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#4CAF50",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "VeMob",
            headerShown: false,
          }}
        />
      </Stack>
      {/* </PrivyProvider> */}
    </PaperProvider>
  );
}
