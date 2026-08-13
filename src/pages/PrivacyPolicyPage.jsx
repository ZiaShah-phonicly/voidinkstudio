import LegalPageShell from '../components/LegalPageShell'
import Reveal from '../components/Reveal'
import JsonLd from '../components/JsonLd'
import usePageMeta from '../hooks/usePageMeta'
import { LEGAL_DATE_MODIFIED, pageTitle, sitePageSchema } from '../data/seo'

const PRIVACY_DESCRIPTION =
  'How VOIDINK Studios collects, uses, and protects personal data on voidinkstudios.com.'

export default function PrivacyPolicyPage() {
  usePageMeta({
    title: pageTitle('Privacy Policy'),
    description: PRIVACY_DESCRIPTION,
  })

  return (
    <LegalPageShell
      label="✦ Legal"
      title="Privacy Policy"
      breadcrumb="Privacy Policy"
      updated="July 28, 2026"
    >
      <JsonLd
        data={sitePageSchema({
          path: '/privacy-policy',
          name: pageTitle('Privacy Policy'),
          description: PRIVACY_DESCRIPTION,
          dateModified: LEGAL_DATE_MODIFIED,
          breadcrumbName: 'Privacy Policy',
        })}
      />
      <Reveal className="legal-prose">
        <div className="legal-callout">
          <p>
            <strong>VOIDINK Studios</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) respects your
            privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
            you visit our website <strong>voidinkstudios.com</strong> and use our creative services.
          </p>
        </div>

        <h2>1. Information We Collect</h2>
        <h3>1.1 Personal Information</h3>
        <p>When you contact us, request a quote, or place an order, we may collect:</p>
        <ul>
          <li>Full name and email address</li>
          <li>Company or brand name (if applicable)</li>
          <li>Country and timezone</li>
          <li>Budget range and project deadlines</li>
          <li>Project descriptions and creative briefs</li>
          <li>Payment information (processed securely via third-party gateways)</li>
        </ul>

        <h3>1.2 Artwork &amp; Creative Assets</h3>
        <p>
          For commission work, you may share reference images, character descriptions, brand guidelines, or existing
          assets. We treat all submitted materials as confidential.
        </p>

        <h3>1.3 Automatically Collected Data</h3>
        <p>We use basic analytics tools that may collect:</p>
        <ul>
          <li>IP address and browser type</li>
          <li>Pages visited and time spent on site</li>
          <li>Referring website or search terms</li>
          <li>Device type and screen resolution</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>
            <strong>To provide services:</strong> Communicating about your project, delivering files, and providing
            support.
          </li>
          <li>
            <strong>To process payments:</strong> Invoicing and payment collection via secure gateways (Stripe, PayPal,
            Wise, or Payoneer).
          </li>
          <li>
            <strong>To improve our services:</strong> Understanding which services are most popular and optimizing our
            workflow.
          </li>
          <li>
            <strong>To send updates:</strong> Project status updates, delivery notifications, and occasional service
            announcements (only with consent).
          </li>
          <li>
            <strong>To showcase work:</strong> With your explicit permission, we may display completed projects in our
            portfolio.
          </li>
        </ul>

        <h2>3. Artwork Confidentiality &amp; NSFW Content</h2>
        <p>
          VOIDINK Studios specializes in a wide range of creative services, including personal and sensitive artwork
          (e.g., character designs, furry art, NSFW commissions). We guarantee:
        </p>
        <ul>
          <li>
            <strong>Complete confidentiality:</strong> Your identity, project details, and artwork are never shared
            without written consent.
          </li>
          <li>
            <strong>Secure file storage:</strong> All project files are stored on encrypted cloud storage with
            restricted access.
          </li>
          <li>
            <strong>NDA available:</strong> We can sign a Non-Disclosure Agreement upon request for sensitive
            commercial projects.
          </li>
          <li>
            <strong>No unauthorized use:</strong> We do not use your commissioned artwork for AI training datasets or
            sell it to third parties.
          </li>
        </ul>

        <h2>4. Cookies &amp; Tracking</h2>
        <p>
          Our website uses minimal cookies for functionality and basic analytics. You can disable cookies in your
          browser settings, though some features may not work optimally.
        </p>

        <h2>5. Third-Party Services</h2>
        <p>We may share limited data with trusted third parties solely for operational purposes:</p>
        <ul>
          <li>
            <strong>Payment processors</strong> (Stripe, PayPal, Wise, Payoneer) — for secure transactions
          </li>
          <li>
            <strong>Email services</strong> — for project communication and delivery
          </li>
          <li>
            <strong>Cloud storage</strong> — for file backup and transfer
          </li>
          <li>
            <strong>Analytics</strong> — for website performance insights (anonymized data only)
          </li>
        </ul>
        <p>We do not sell, rent, or trade your personal information to any third party for marketing purposes.</p>

        <h2>6. Data Retention</h2>
        <p>
          We retain your project files and communication history for <strong>12 months</strong> after project
          completion to handle any revision requests or disputes. After this period, files are permanently deleted
          unless you request earlier removal or grant permission for portfolio use.
        </p>

        <h2>7. Your Rights</h2>
        <p>Depending on your location, you may have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your data (&quot;right to be forgotten&quot;)</li>
          <li>Withdraw consent for marketing communications</li>
          <li>Request a copy of your data in a portable format</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at <strong>support@voidinkstudios.com</strong>.
        </p>

        <h2>8. Data Security</h2>
        <p>
          We implement industry-standard security measures including encrypted file transfers, password-protected
          delivery links, and secure payment processing. However, no internet transmission is 100% secure, and we
          cannot guarantee absolute security.
        </p>

        <h2>9. Children&apos;s Privacy</h2>
        <p>
          Our services are not directed to individuals under 18. We do not knowingly collect personal information from
          minors. If you believe a minor has provided us with personal data, please contact us immediately.
        </p>

        <h2>10. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated
          &quot;Last updated&quot; date. We encourage you to review this policy periodically.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please
          reach out:
        </p>
        <div className="legal-callout">
          <p>
            <strong>VOIDINK Studios</strong>
            <br />
            Email: <a href="mailto:support@voidinkstudios.com">support@voidinkstudios.com</a>
            <br />
            Website:{' '}
            <a href="https://voidinkstudios.com">voidinkstudios.com</a>
            <br />
            Response time: Within 2 hours during business hours
          </p>
        </div>
      </Reveal>
    </LegalPageShell>
  )
}
