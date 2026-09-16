import { useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import SiteHeader from './components/SiteHeader.jsx';
import Hero from './components/Hero.jsx';
import AboutBlurb from './components/AboutBlurb.jsx';
import ActionSection from './components/ActionSection.jsx';
import ThePlan from './components/ThePlan.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import DonateDialog from './components/DonateDialog.jsx';
import ContactDialog from './components/ContactDialog.jsx';
import './App.css';

function App() {
  const heroRef = useRef(null);
  const [donateOpen, setDonateOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const { pathname } = useLocation();

  // Land on the top of whichever page was navigated to, rather than
  // wherever the browser last had that scroll position (its default
  // restoration, and React Router's own lack of one, both leave the
  // viewport wherever it was on the previous page).
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <SiteHeader heroRef={heroRef} onContactClick={() => setContactOpen(true)} />

      <main id="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero ref={heroRef} />
                <AboutBlurb />
                <ActionSection
                  onDonateClick={() => setDonateOpen(true)}
                  onContactClick={() => setContactOpen(true)}
                />
              </>
            }
          />
          <Route
            path="/the-plan"
            element={<ThePlan onContactClick={() => setContactOpen(true)} />}
          />
        </Routes>
      </main>

      <SiteFooter />

      <DonateDialog isOpen={donateOpen} onClose={() => setDonateOpen(false)} />
      <ContactDialog isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

export default App;
