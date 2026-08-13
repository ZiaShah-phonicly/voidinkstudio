import { Link } from 'react-router-dom'
import LegalPageShell from '../components/LegalPageShell'
import Reveal from '../components/Reveal'
import JsonLd from '../components/JsonLd'
import usePageMeta from '../hooks/usePageMeta'
import { LEGAL_DATE_MODIFIED, pageTitle, sitePageSchema } from '../data/seo'

const TERMS_DESCRIPTION =
  'Terms for using VOIDINK Studios website, commissions, payments, revisions, and ownership.'

export default function TermsOfServicePage() {
  usePageMeta({
    title: pageTitle('Terms of Service'),
    description: TERMS_DESCRIPTION,
  })

  return (
    <LegalPageShell
      label="✦ Legal"
      title="Terms of Service"
      breadcrumb="Terms of Service"
      updated="July 28, 2026"
    >
      <JsonLd
        data={sitePageSchema({
          path: '/terms-of-service',
          name: pageTitle('Terms of Service'),
          description: TERMS_DESCRIPTION,
          dateModified: LEGAL_DATE_MODIFIED,
          breadcrumbName: 'Terms of Service',
        })}
      />
      <Reveal className="legal-prose">
        <div className="legal-callout">
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your use of the VOIDINK Studios website and the creative
            services we provide. By accessing our website, submitting a project inquiry, or making a payment, you agree
            to be bound by these Terms. If you do not agree, please do not use our services.
          </p>
        </div>

        <h2>1. Definitions</h2>
        <ul>
          <li>
            <strong>&quot;Client&quot; / &quot;You&quot;:</strong> The individual or entity requesting and/or
            purchasing services from VOIDINK Studios.
          </li>
          <li>
            <strong>&quot;We&quot; / &quot;Us&quot; / &quot;VOIDINK&quot;:</strong> VOIDINK Studios, the creative
            agency providing the services.
          </li>
          <li>
            <strong>&quot;Deliverables&quot;:</strong> All final creative assets, files, and materials produced as part
            of the agreed project scope.
          </li>
          <li>
            <strong>&quot;Project Scope&quot;:</strong> The specific services, deliverables, timelines, and revisions
            agreed upon in writing (via email, proposal, or contract) before work begins.
          </li>
        </ul>

        <h2>2. Services Overview</h2>
        <p>VOIDINK Studios provides creative and technical services including but not limited to:</p>
        <ul>
          <li>Website design &amp; development</li>
          <li>AI chatbots, voice agents &amp; automations</li>
          <li>Mobile app development</li>
          <li>Illustration, comic book art &amp; character design</li>
          <li>3D modeling, mascot design &amp; VTuber models</li>
          <li>Branding, logo design &amp; animation</li>
          <li>Cover art &amp; custom artwork commissions</li>
        </ul>
        <p>
          Specific deliverables, timelines, and pricing are defined in the individual project proposal or agreement for
          each client.
        </p>

        <h2>3. Project Process &amp; Communication</h2>
        <h3>3.1 Discovery &amp; Briefing</h3>
        <p>
          After initial contact, we will request a detailed creative brief. The quality of the final deliverable
          depends heavily on the clarity and completeness of the information you provide. We are not responsible for
          delays caused by incomplete briefs.
        </p>

        <h3>3.2 Concepts &amp; Revisions</h3>
        <ul>
          <li>
            Initial concepts or sketches are typically delivered within <strong>24–48 hours</strong> of project kickoff
            and deposit receipt.
          </li>
          <li>
            Our packages include <strong>unlimited revisions</strong> within the agreed project scope. Major scope
            changes (e.g., changing the entire art style, adding new characters, or switching from a logo to a full
            website) may require a new quote.
          </li>
          <li>
            Revisions must be requested within <strong>7 days</strong> of receiving a draft. After 7 days of
            inactivity, the project is considered complete.
          </li>
        </ul>

        <h3>3.3 Response Times</h3>
        <p>
          We aim to respond to all client messages within <strong>2 hours</strong> during our business hours. We
          operate across global timezones and will communicate our active hours at project start.
        </p>

        <h2>4. Payments &amp; Pricing</h2>
        <h3>4.1 Deposit</h3>
        <p>
          A <strong>50% non-refundable deposit</strong> is required to begin work on all projects. The remaining 50% is
          due upon final approval and before the delivery of source files.
        </p>

        <h3>4.2 Accepted Payment Methods</h3>
        <ul>
          <li>Stripe (Credit/Debit Cards)</li>
          <li>PayPal</li>
          <li>Zelle</li>
          <li>Venmo</li>
          <li>Apple Pay</li>
          <li>Cash App</li>
        </ul>

        <h3>4.3 Late Payments</h3>
        <p>
          If the final payment is not received within <strong>7 days</strong> of project completion, we reserve the
          right to withhold deliverables, pause ongoing work, or charge a late fee of <strong>5% per week</strong> on
          the outstanding amount.
        </p>

        <h3>4.4 Currency &amp; Taxes</h3>
        <p>
          All prices on our website are quoted in <strong>USD ($)</strong> unless otherwise agreed. Clients are
          responsible for any applicable taxes, currency conversion fees, or transaction charges imposed by their bank
          or payment provider.
        </p>

        <h2>5. Intellectual Property &amp; Ownership</h2>
        <h3>5.1 Transfer of Rights</h3>
        <p>
          Upon full payment, you receive <strong>100% ownership rights</strong> to the final deliverables for your
          specified use case. This includes the right to reproduce, modify, distribute, and display the work.
        </p>

        <h3>5.2 What You Own</h3>
        <ul>
          <li>Final high-resolution files (PNG, JPG, SVG, PDF, etc.)</li>
          <li>Source files (PSD, AI, Figma, Blender, etc.) — if included in your package</li>
          <li>Full commercial usage rights</li>
        </ul>

        <h3>5.3 What We Retain</h3>
        <ul>
          <li>
            We retain the right to display the work in our portfolio, social media, and marketing materials{' '}
            <strong>unless you request confidentiality</strong> (see Section 6).
          </li>
          <li>We retain the right to use the project as a case study or award submission with your permission.</li>
          <li>We do not retain any exclusive rights that would prevent you from using the work.</li>
        </ul>

        <h3>5.4 Third-Party Assets</h3>
        <p>
          If a project requires stock images, fonts, or plugins with licensing fees, these costs are either included in
          your package or billed separately with your approval. You are responsible for complying with the licenses of
          any third-party assets we incorporate.
        </p>

        <h2>6. Confidentiality &amp; NDA</h2>
        <p>
          We understand that many projects involve sensitive business information, unreleased products, or personal
          creative ideas. We offer:
        </p>
        <ul>
          <li>
            <strong>Standard confidentiality:</strong> All project details are kept private by default. We do not share
            your information or artwork without consent.
          </li>
          <li>
            <strong>Formal NDA:</strong> Upon request, we will sign a Non-Disclosure Agreement before project
            commencement. This ensures your project remains completely confidential and will not appear in our
            portfolio.
          </li>
        </ul>

        <h2>7. Refund &amp; Cancellation Policy</h2>
        <div className="legal-warning">
          <p>
            <strong>Refund Policy:</strong> We stand by our work and are committed to delivering concepts that match
            your vision. Refunds are only available{' '}
            <strong>before any concepts or drafts are delivered</strong>. Once we have delivered initial concepts or
            work-in-progress, the deposit becomes non-refundable as it covers the time, effort, and creative labor
            invested. We offer unlimited revisions to refine the work until you are satisfied — but refunds are not
            issued after work has been started or concepts shared.
          </p>
        </div>

        <h3>7.1 Cancellation by Client</h3>
        <ul>
          <li>
            <strong>Before any work or concepts are delivered:</strong> Full deposit refund minus any payment
            processing fees.
          </li>
          <li>
            <strong>After initial concepts or drafts are delivered:</strong> The deposit is non-refundable. We will
            continue working with you through unlimited revisions until you are satisfied. No refund will be issued at
            this stage.
          </li>
          <li>
            <strong>After final approval:</strong> No refunds. The final payment is due in full.
          </li>
        </ul>

        <h3>7.2 Cancellation by VOIDINK</h3>
        <p>
          In rare cases (e.g., inappropriate content requests, abusive behavior, or non-cooperation), we reserve the
          right to terminate the project. In such cases, a prorated refund may be issued based on work completed, at
          our sole discretion.
        </p>

        <h2>8. Revisions &amp; Scope Changes</h2>
        <ul>
          <li>
            <strong>Minor revisions:</strong> Color changes, text edits, small layout adjustments — included and
            unlimited.
          </li>
          <li>
            <strong>Major revisions:</strong> Complete art style change, adding new pages/characters, changing project
            type — may incur additional charges.
          </li>
          <li>
            <strong>Scope creep:</strong> If you request work outside the agreed proposal, we will provide a separate
            quote. Work will pause until the new scope is approved and paid for.
          </li>
        </ul>

        <h2>9. Content Guidelines &amp; Prohibited Use</h2>
        <p>We reserve the right to refuse projects that involve:</p>
        <ul>
          <li>Hate speech, discrimination, or promotion of violence</li>
          <li>Illegal activities or counterfeit goods</li>
          <li>Content that infringes on third-party intellectual property</li>
          <li>Deepfake or non-consensual imagery</li>
          <li>Content involving minors in any inappropriate context</li>
        </ul>
        <p>
          NSFW (Not Safe For Work) artwork is accepted only for adult clients (18+) and will not be displayed in our
          public portfolio without explicit written consent.
        </p>

        <h2>10. Delivery &amp; File Formats</h2>
        <ul>
          <li>
            Deliverables are sent via secure cloud link (Google Drive, Dropbox, or WeTransfer) or email attachment for
            smaller files.
          </li>
          <li>Standard formats: PNG, JPG, SVG, PDF, MP4, GIF, PSD, AI, Figma, and source code repositories.</li>
          <li>
            We recommend downloading and backing up your files immediately. While we retain backups for 12 months, we
            are not liable for data loss after delivery.
          </li>
        </ul>

        <h2>11. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, VOIDINK Studios shall not be liable for any indirect, incidental,
          special, or consequential damages arising from the use of our services or deliverables. Our total liability
          shall not exceed the amount paid by you for the specific project in question.
        </p>

        <h2>12. Governing Law &amp; Disputes</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws applicable in the jurisdiction
          where VOIDINK Studios is registered. Any disputes shall first be attempted to be resolved through good-faith
          negotiation. If unresolved, disputes may be submitted to binding arbitration.
        </p>

        <h2>13. Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. Continued use of our services after changes constitutes
          acceptance of the updated Terms. We will notify clients of material changes via email.
        </p>

        <h2>14. Contact Information</h2>
        <p>For questions about these Terms, project inquiries, or legal matters:</p>
        <div className="legal-callout">
          <p>
            <strong>VOIDINK Studios</strong>
            <br />
            Email: <a href="mailto:support@voidinkstudios.com">support@voidinkstudios.com</a>
            <br />
            Website:{' '}
            <a href="https://voidinkstudios.com">voidinkstudios.com</a>
            <br />
            Response time: Within 2 hours
          </p>
        </div>

        <p className="legal-footnote">
          See also our <Link to="/privacy-policy">Privacy Policy</Link> and <Link to="/faq">FAQ</Link>.
        </p>
      </Reveal>
    </LegalPageShell>
  )
}
