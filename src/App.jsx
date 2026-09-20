import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import SiteHeader from './components/SiteHeader.jsx';
import Hero from './components/Hero.jsx';
import AboutBlurb from './components/AboutBlurb.jsx';
import ActionSection from './components/ActionSection.jsx';
import ThePlan from './components/ThePlan.jsx';
import MeetThaafir from './components/MeetThaafir.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import Donation from './components/donation/index.js';
import ContactDialog from './components/ContactDialog.jsx';
import DonationStatusBanner from './components/DonationStatusBanner.jsx';
import './App.css';

function App() {
  const [donateOpen, setDonateOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  // Yoco redirects back here with ?donation=success|cancelled|failed. Read
  // it once at mount (lazy initializer, so this doesn't cost an extra
  // render), then strip it from the URL below so a refresh or a shared
  // link doesn't replay the same banner.
  const [donationStatus, setDonationStatus] = useState(
    () => new URLSearchParams(window.location.search).get('donation'),
  );
  const { pathname } = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!donationStatus) return;
    navigate({ pathname, search: '' }, { replace: true });
    // Only ever needs to run once, right after mount picks up the banner.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <SiteHeader onContactClick={() => setContactOpen(true)} />

      <main id="main-content">
        {donationStatus && (
          <DonationStatusBanner status={donationStatus} onDismiss={() => setDonationStatus(null)} />
        )}

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
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
          <Route path="/meet-thaafir" element={<MeetThaafir />} />
        </Routes>
      </main>

      <SiteFooter />

      <Donation isOpen={donateOpen} onClose={() => setDonateOpen(false)} />
      <ContactDialog isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

export default App;
