import { useRef, useState } from 'react';
import SiteHeader from './components/SiteHeader.jsx';
import Hero from './components/Hero.jsx';
import AboutBlurb from './components/AboutBlurb.jsx';
import ActionSection from './components/ActionSection.jsx';
import PatternBand from './components/PatternBand.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import DonateDialog from './components/DonateDialog.jsx';
import ContactDialog from './components/ContactDialog.jsx';
import './App.css';

function App() {
  const heroRef = useRef(null);
  const [donateOpen, setDonateOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <SiteHeader heroRef={heroRef} onContactClick={() => setContactOpen(true)} />

      <main id="main-content">
        <Hero ref={heroRef} />
        <AboutBlurb />
        <ActionSection
          onDonateClick={() => setDonateOpen(true)}
          onContactClick={() => setContactOpen(true)}
        />
        <PatternBand />
      </main>

      <SiteFooter />

      <DonateDialog isOpen={donateOpen} onClose={() => setDonateOpen(false)} />
      <ContactDialog isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

export default App;
