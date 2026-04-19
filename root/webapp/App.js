import React, { useRef, useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  BackHandler,
  ActivityIndicator,
  View,
  StatusBar,
  Text,
  Platform,
  RefreshControl,
} from "react-native";
import { WebView } from "react-native-webview";
import NetInfo from "@react-native-community/netinfo";

export default function App() {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribeNet = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        }
        return false;
      }
    );

    return () => {
      unsubscribeNet();
      backHandler.remove();
    };
  }, [canGoBack]);

  const onRefresh = () => {
    if (webViewRef.current) {
      setRefreshing(true);
      webViewRef.current.reload();
      setTimeout(() => setRefreshing(false), 1000);
    }
  };

  if (isOffline) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: "white", fontSize: 18 }}>
          No Internet Connection
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <View style={styles.topSpace} />

      <WebView
        ref={webViewRef}
        source={{ uri: "https://www.ialksng.me" }}
        style={{ flex: 1 }}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        scalesPageToFit={false}
        setSupportMultipleWindows={false}
        userAgent="Mozilla/5.0 (Linux; Android 10; Mobile)"
        onNavigationStateChange={(navState) =>
          setCanGoBack(navState.canGoBack)
        }
        injectedJavaScript={`
          document.body.classList.add("app-mode");
        `}
        onShouldStartLoadWithRequest={(request) => {
          return request.url.startsWith("https://www.ialksng.me");
        }}
        renderLoading={() => (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#38bdf8" />
          </View>
        )}
        pullToRefreshEnabled
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  topSpace: {
    height: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },
});