import type { Metadata } from "next"

import { LegalPage, type LegalDoc } from "../legal/LegalPage"

export const metadata: Metadata = {
  title: "Terms & Conditions · PluginLive",
  description: "The terms and conditions governing your use of PluginLive's services.",
}

const TERMS: LegalDoc = {
  title: "Terms & Conditions",
  intro: "Agreement to Terms of Service",
  introBlocks: [
    {
      type: "p",
      text: "By accessing or using any services provided by PluginLive Technologies Pvt Ltd or its affiliates, you agree to be bound by these Terms and Conditions",
    },
    {
      type: "p",
      text: "Your use of our services is voluntary, and you have the option to discontinue at any time. Any personal information you provide to us is voluntary, and you will not be subject to adverse consequences if you choose not to provide it. However, certain services may require the use of personal information for functionality.",
    },
    {
      type: "p",
      text: "We may seek your consent to collect, hold, use, and disclose your personal information for purposes outlined in our Privacy Policy or any other lawful purposes. You agree to provide accurate and up-to-date information when using our services and to maintain the confidentiality of any account credentials or passwords associated with our services.",
    },
    {
      type: "p",
      text: "You agree not to engage in any unlawful or unauthorized activities when using our services, and we reserve the right to modify, suspend, or terminate any part of our services at any time without prior notice. We are not liable for any damages or losses resulting from your use of our services, including but not limited to, direct, indirect, incidental, or consequential damages.",
    },
    {
      type: "p",
      text: "These Terms and Conditions constitute the entire agreement between you and PluginLive Technologies Pvt Ltd regarding your use of our services and supersede any prior agreements or understandings.",
    },
    {
      type: "p",
      text: "If you have any questions or concerns regarding these Terms and Conditions, please contact us at contact@pluginlive.com",
    },
  ],
}

export default function TermsPage() {
  return <LegalPage doc={TERMS} />
}
