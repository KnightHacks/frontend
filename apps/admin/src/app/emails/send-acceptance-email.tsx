import type { RouterOutput } from "@knighthacks/api";
import { renderEmailAcceptance } from "@knighthacks/utils";
import { Resend } from "resend";

import { env } from "~/env";

type HackerType = RouterOutput["hacker"]["adminAll"][number];

export async function sendAcceptanceEmail(hacker: HackerType) {
  try {
    const resend = new Resend(env.NEXT_PUBLIC_RESEND_API_KEY);
    await resend.emails.send({
      from: "status@knighthacks.org",
      to: hacker.user.email,
      subject: "Knighthacks Acceptance",
      html: renderEmailAcceptance(hacker.user.firstName),
    });

    return {
      success: hacker,
    };
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
}
