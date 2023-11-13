import React from "react";
import VA from "./VideoApp/VA";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./VideoApp/redux/store";
import { Provider } from "react-redux";

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ChakraProvider>
          <BrowserRouter>
            <VA />
          </BrowserRouter>
        </ChakraProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
