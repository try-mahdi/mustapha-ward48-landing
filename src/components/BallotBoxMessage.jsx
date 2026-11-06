import signature from '../assets/thaafir-signature.webp';
import './BallotBoxMessage.css';

// Thaafir's post-election message, from the "Home page" Canva design.
function BallotBoxMessage() {
  return (
    <section className="ballot-box" aria-labelledby="ballot-box-heading">
      <div className="ballot-box__inner">
        <h2 id="ballot-box-heading" className="ballot-box__title">
          The work does not start or stop at the ballot box.
        </h2>

        <div className="ballot-box__copy">
          <p>
            This campaign is about the issues:{' '}
            <strong>
              our city&rsquo;s affordability crisis, the housing crisis, and safety.
            </strong>{' '}
            It&rsquo;s also about the vision that we may come to live in a world-class community
            that doesn&rsquo;t look different because of where we live — that we demand to live in
            a space that can also be enjoyed.
          </p>
          <p>
            I&rsquo;m still committed to these issues, and will continue to fight for the outcomes
            we hoped to implement in office.
          </p>
          <p>
            The next few weeks will involve some studying and soul-searching as I figure out the
            path forward, but know that this isn&rsquo;t the end of the road.
          </p>
          <p>
            Thank you for putting your trust in me and choosing a new kind of politics.{' '}
            <strong>Hold onto the hope.</strong>
          </p>
        </div>

        <img
          className="ballot-box__signature"
          src={signature}
          width={900}
          height={491}
          alt="Thaafir"
        />
      </div>
    </section>
  );
}

export default BallotBoxMessage;
