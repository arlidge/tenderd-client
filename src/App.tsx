import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, theme as antTheme } from 'antd';
import { Provider, useAtom } from 'jotai';
import './App.css';
import routes from './routes/route';
import { themeAtom } from './states/theme.atom';
import { darkTokens, lightTokens, darkTokensLayout, lightTokensLayout } from './theme/theme';

const AppContent = () => {
  const [theme] = useAtom(themeAtom);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: theme === 'dark' ? darkTokens : lightTokens,
        components: {
          Layout: {
            ...(theme === 'dark' ? darkTokensLayout : lightTokensLayout),
          },
        },
      }}
    >
      <div>
        <RouterProvider router={routes} />
      </div>
    </ConfigProvider>
  );
};

// Main App component
function App() {
  return (
    <Provider>
      <AppContent />
    </Provider>
  );
}

export default App;
