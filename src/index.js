import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

/* Redux imports */
import { store, persistor } from './storage/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

/* React query imports */
import { QueryClient, QueryClientProvider } from "react-query";

/* Local imports */
import Navigation from './views/components/navigation/Navigation.jsx';
import './views/styles/body/Body.css';


import reportWebVitals from './reportWebVitals';

/* Lazyloading pages */
const AddPost = lazy(() => import('./views/pages/AddPost.jsx'));
const AboutPage = lazy(() => import('./views/pages/About.jsx'));
const Blogpost = lazy(() => import('./views/pages/Blogpost.jsx'));
const Blogposts = lazy(() => import('./views/pages/HomePage.jsx'))
const ContactPage = lazy(() => import('./views/pages/ContactUs.jsx'));
const LogIn = lazy(() => import('./views/pages/LogIn.jsx'));
const NotFound = lazy(() => import('./views/pages/404.jsx'));
const SignUp = lazy(() => import('./views/pages/SignUp.jsx'));


const queryClient = new QueryClient({
  defaultOptions: {

    queries: {
      refetchOnWindowFocus: false,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      suspense: true,
    },

  },
});


ReactDOM.render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<span>Loading...</span>}>
        <BrowserRouter>
          <PersistGate persistor={persistor}>
            <Navigation />
            <Routes>
              <Route path="*" element={<NotFound />} />
              <Route path="/blog/signup" element={<SignUp />} />
              <Route path="/blog/login" element={<LogIn />} />
              <Route exact path="/blog/" element={<Blogposts />} />
              <Route exact path="/blog/about" element={<AboutPage />} />
              <Route exact path="/blog/contact" element={<ContactPage />} />
              <Route path="/blog/posts/:slug" element={<Blogpost />} />
              <Route path="/blog/add-post" element={<AddPost />} />
            </Routes>
          </PersistGate>
        </BrowserRouter>
      </Suspense>
    </QueryClientProvider>
  </Provider>
  , document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
