import heroCollage from '../assets/meet-hero-collage.webp';
import rootsCollage from '../assets/meet-roots-collage.webp';
import suitPhoto from '../assets/about-headshot.jpg';
import IconPattern from './IconPattern.jsx';
import { ContactForm } from './ContactDialog.jsx';
import './MeetThaafir.css';

// Laid out to match the "Meet Thaafir" Canva design. The two photo collages
// are exported straight from that design (rotations, cut-outs and overlaps
// included) rather than rebuilt photo by photo, so they stay faithful to it.
function MeetThaafir() {
  return (
    <>
      <section className="meet-thaafir__hero" aria-labelledby="meet-thaafir-heading">
        <IconPattern className="meet-thaafir__pattern" />

        <div className="meet-thaafir__hero-head">
          <h1 id="meet-thaafir-heading" className="meet-thaafir__title">
            Meet Thaafir
          </h1>
          <p className="meet-thaafir__subtitle">Candidate for Ward 48</p>
        </div>

        <img
          className="meet-thaafir__collage meet-thaafir__collage--hero"
          src={heroCollage}
          width={1400}
          height={1296}
          alt="Thaafir on eXpresso as CEO and founder of SoWeVote; Thaafir smiling in a hoodie in front of UCT; Thaafir with students on campus; and a News24 headline: Young Mandelas 2024: Thaafir Mustapha, Deepening Democracy."
        />
      </section>

      <section className="meet-thaafir__story" aria-labelledby="meet-thaafir-founder-heading">
        <div className="meet-thaafir__column">
          <h2 id="meet-thaafir-founder-heading" className="meet-thaafir__heading">
            Non-profit founder &amp; law student
          </h2>
          <p className="meet-thaafir__subtitle meet-thaafir__subtitle--tight">
            Thaafir doesn&rsquo;t just <em>talk</em> about changing politics!
          </p>

          <div className="meet-thaafir__copy">
            <p>
              In 2023, Thaafir started the non-profit <strong><em>SoWeVote</em></strong> to
              mobilise and educate young people on politics and voter registration. The big idea
              was to change the way that South Africans see politics and actually allow people to
              understand what politicians are saying in order to make an informed decision on
              Election Day and beyond — so he knows a thing or two about organisational
              management, working with politicians, and what makes people frustrated in the
              system.
            </p>
            <p>
              This work led to him being named{' '}
              <strong>News24 Young Mandela of the Future</strong> (2024) in the category
              &lsquo;Deepening democracy&rsquo; and{' '}
              <strong>Mail &amp; Guardian Top 200 Young South African</strong> (2025) for
              Politics &amp; Governance.
            </p>
            <p>
              He&rsquo;s also a <strong>Dean&rsquo;s Merit List</strong> law student at the
              University of Cape Town, where he serves as a faculty mentor to new students and
              educates communities on their rights through the UCT Law Clinic.
            </p>
          </div>

          <hr className="meet-thaafir__divider" />

          <img
            className="meet-thaafir__collage meet-thaafir__collage--roots"
            src={rootsCollage}
            width={1142}
            height={1322}
            alt="A vintage black-and-white photo of Thaafir's family with Masjid-us-Salaam, a young Thaafir with his family outside their Athlone home, and Thaafir with his extended family today."
          />

          <h2 id="meet-thaafir-roots-heading" className="meet-thaafir__heading">
            Rooted in the Athlone area
          </h2>
          <div className="meet-thaafir__copy">
            <p>
              Ward 48 is more than just a city-drawn map. For Thaafir, it&rsquo;s the only place
              he&rsquo;s ever called home — living between Jan Smuts and Thornton. He lives there
              with his parents and three siblings, but the connection to the area goes a lot
              deeper: his grandfather has lived in the neighbourhood for decades, and his
              great-grandfather helped to establish Masjid-us-Salaam in St Athans Rd.
            </p>
            <p>
              When Thaafir&rsquo;s elected, the decisions he&rsquo;ll make and the projects
              he&rsquo;ll fight for won&rsquo;t be made in abstract; it&rsquo;ll affect him and
              his family (including his many many cousins!).
            </p>
          </div>

          <hr className="meet-thaafir__divider meet-thaafir__divider--end" />
        </div>
      </section>

      <section className="meet-thaafir__cta" aria-labelledby="meet-thaafir-cta-heading">
        <IconPattern onPurple className="meet-thaafir__pattern" />

        <div className="meet-thaafir__column">
          <h2 id="meet-thaafir-cta-heading" className="meet-thaafir__heading">
            Running for <br />
            ward councillor
          </h2>

          <div className="meet-thaafir__cta-photo">
            <img src={suitPhoto} alt="Thaafir in a navy suit" />
          </div>

          <div className="meet-thaafir__copy">
            <p>
              This community deserves to be represented by one of its own residents, someone who
              will experience its joys and its pains with you. For far too long, we&rsquo;ve
              waited on political parties to deliver change for our community and for this city.
              It&rsquo;s time for us to focus on fighting for{' '}
              <strong>safer streets, stronger community,</strong> and{' '}
              <strong>Athlone first.</strong>
            </p>
          </div>

          <div className="meet-thaafir__contact" aria-labelledby="meet-thaafir-contact-heading">
            <h3 id="meet-thaafir-contact-heading" className="meet-thaafir__contact-title">
              Let&rsquo;s talk
            </h3>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

export default MeetThaafir;
