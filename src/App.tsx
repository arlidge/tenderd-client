import { RouterProvider } from "react-router-dom";
import { ConfigProvider, theme as antTheme } from "antd";
import { Provider, useAtom } from "jotai";
import "./App.css";
import routes from "./routes/route";
import { themeAtom } from "./states/theme.atom";
import {
  darkTokens,
  lightTokens,
  darkTokensLayout,
  lightTokensLayout,
} from "./theme/theme";
import ErrorBoundary from "./components/ErrorBoundary";

const AppContent = () => {
  const [theme] = useAtom(themeAtom);

  return (
    <ConfigProvider
      theme={{
        algorithm:
          theme === "dark" ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: theme === "dark" ? darkTokens : lightTokens,
        components: {
          Layout: {
            ...(theme === "dark" ? darkTokensLayout : lightTokensLayout),
          },
        },
      }}
    >
      <ErrorBoundary>
        <RouterProvider router={routes} />
      </ErrorBoundary>
    </ConfigProvider>
  );
};

// Main App component
function App() {
  return (
    <Provider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
