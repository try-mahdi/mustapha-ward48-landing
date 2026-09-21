import thaafirWorkshop from '../assets/thaafir-workshop.jpg';
import thaafirHoodie from '../assets/thaafir-hoodie.jpg';
import thaafirUctStudents from '../assets/thaafir-uct-students.jpg';
import thaafirFamilyVintage from '../assets/thaafir-family-vintage.jpg';
import thaafirFamilyGroup from '../assets/thaafir-family-group.jpg';
import suitPhoto from '../assets/about-headshot.jpg';
import IconPattern from './IconPattern.jsx';
import Button from './Button.jsx';
import './MeetThaafir.css';

function MeetThaafir({ onContactClick }) {
  return (
    <>
      <section className="meet-thaafir__hero" aria-labelledby="meet-thaafir-heading">
        <IconPattern />

        <div className="meet-thaafir__hero-head">
          <p className="ds-eyebrow meet-thaafir__eyebrow">Your candidate for Ward 48</p>
          <h1 id="meet-thaafir-heading" className="meet-thaafir__title">
            MEET <span className="meet-thaafir__title-accent">THAAFIR</span>
            <span className="meet-thaafir__dots" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </h1>
        </div>

        <div className="meet-thaafir__collage">
          <div className="meet-thaafir__collage-wide">
            <img src={thaafirWorkshop} alt="Thaafir facilitating a SoWeVote youth workshop" />
          </div>
          <div className="meet-thaafir__collage-row">
            <img src={thaafirHoodie} alt="Thaafir smiling" />
            <img
              src={thaafirUctStudents}
              alt="Thaafir talking with fellow students on the UCT campus"
            />
          </div>
        </div>
      </section>

      <section className="meet-thaafir__founder" aria-labelledby="meet-thaafir-founder-heading">
        <div className="ds-container meet-thaafir__founder-inner">
          <p className="ds-eyebrow">Thaafir doesn&rsquo;t just talk about changing politics!</p>
          <h2 id="meet-thaafir-founder-heading">Non-profit founder &amp; law student</h2>

          <div className="meet-thaafir__copy">
            <p>
              In 2023, Thaafir started the non-profit <strong>SoWeVote</strong> to mobilise and
              educate young people on politics and voter registration. The big idea was to
              change the way that South Africans see politics and actually allow people to
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
        </div>

        <hr className="meet-thaafir__divider" />

        <div className="meet-thaafir__collage meet-thaafir__collage--roots">
          <img
            className="meet-thaafir__collage-roots-vintage"
            src={thaafirFamilyVintage}
            alt="A young Thaafir with his family outside their Athlone home"
          />
          <img
            className="meet-thaafir__collage-roots-group"
            src={thaafirFamilyGroup}
            alt="Thaafir with his extended family"
          />
        </div>

        <div className="ds-container meet-thaafir__founder-inner">
          <h2 id="meet-thaafir-roots-heading">Rooted in the Athlone area</h2>
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
        </div>
      </section>

      <section className="meet-thaafir__cta" aria-labelledby="meet-thaafir-cta-heading">
        <h2 id="meet-thaafir-cta-heading">Running for ward councillor</h2>

        <div className="meet-thaafir__cta-photo">
          <img src={suitPhoto} alt="Thaafir" />
        </div>

        <p>
          This community deserves to be represented by one of its own residents, someone who
          will experience its joys and its pains with you. For far too long, we&rsquo;ve waited
          on political parties to deliver change for our community and for this city. It&rsquo;s
          time for us to focus on fighting for{' '}
          <strong>safer streets, stronger community,</strong> and{' '}
          <strong>Athlone first.</strong>
        </p>

        <Button variant="accent" onClick={onContactClick}>
          Let&rsquo;s talk
        </Button>
      </section>
    </>
  );
}

export default MeetThaafir;
