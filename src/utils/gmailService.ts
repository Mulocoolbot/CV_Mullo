export const GMAIL_API_ENDPOINT =
  process.env.NEXT_PUBLIC_GMAIL_API_URL ||
  "https://script.google.com/macros/s/AKfycbwRvh7ZkZ5XEhVB1VA_rG08x4NVayVkrsCUi5PMvggdC6j6GlR2LHh7afbi59NWKGA2/exec";

export interface GmailInquiryPayload {
  clientName: string;
  clientEmail: string;
  inquiryType: "freelance" | "recruitment";
  serviceTitle: string;
  projectNotes: string;
  lang: "id" | "en";
}

export function buildGmailDirectComposeUrl(payload: GmailInquiryPayload): string {
  const recipient = "ahmadmuliasaputra1@gmail.com";
  const categoryLabel =
    payload.inquiryType === "recruitment"
      ? payload.lang === "id"
        ? "Rekrutmen HRD"
        : "HR Recruitment"
      : payload.lang === "id"
        ? "Layanan Freelance"
        : "Freelance Service";

  const senderName =
    payload.clientName.trim() ||
    (payload.lang === "id" ? "Calon Mitra / HRD" : "Prospective Partner / HR");

  const subject = `[${categoryLabel}] ${payload.serviceTitle} - ${senderName}`;
  const bodyLines =
    payload.lang === "id"
      ? [
          "Halo Ahmad Mulia Saputra,",
          "",
          `Nama / Perusahaan: ${senderName}`,
          `Email Pengirim: ${payload.clientEmail.trim() || "-"}`,
          `Kategori: ${categoryLabel}`,
          `Layanan / Posisi: ${payload.serviceTitle}`,
          "",
          "Detail Pesan / Kebutuhan:",
          payload.projectNotes.trim() ||
            "Saya tertarik untuk mendiskusikan kerja sama lebih lanjut.",
        ]
      : [
          "Hello Ahmad Mulia Saputra,",
          "",
          `Name / Company: ${senderName}`,
          `Sender Email: ${payload.clientEmail.trim() || "-"}`,
          `Category: ${categoryLabel}`,
          `Service / Role: ${payload.serviceTitle}`,
          "",
          "Message / Project Details:",
          payload.projectNotes.trim() ||
            "I would like to discuss a potential collaboration.",
        ];

  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    recipient
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    bodyLines.join("\n")
  )}`;
}

export async function dispatchGmailInquiry(
  payload: GmailInquiryPayload,
  customFetch?: typeof fetch
): Promise<{ ok: boolean; mode: "api" | "gmail-compose" | "validation-error"; message: string }> {
  const cleanEmail = payload.clientEmail.trim();
  const cleanNotes = payload.projectNotes.trim();

  if (!cleanEmail || !cleanEmail.includes("@")) {
    return {
      ok: false,
      mode: "validation-error",
      message:
        payload.lang === "id"
          ? "Mohon masukkan alamat email pengirim yang valid."
          : "Please enter a valid sender email address.",
    };
  }

  if (!cleanNotes) {
    return {
      ok: false,
      mode: "validation-error",
      message:
        payload.lang === "id"
          ? "Mohon tuliskan detail pesan atau kebutuhan Anda terlebih dahulu."
          : "Please write your message or project details first.",
    };
  }

  const categoryLabel =
    payload.inquiryType === "recruitment" ? "Rekrutmen HRD" : "Freelance Service";
  const senderName = payload.clientName.trim() || "Mitra / HRD";
  const subject = `[${categoryLabel}] ${payload.serviceTitle} - ${senderName}`;

  const fetcher = customFetch || fetch;

  try {
    const response = await fetcher(GMAIL_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      redirect: "follow",
      body: JSON.stringify({
        to: "ahmadmuliasaputra1@gmail.com",
        name: senderName,
        email: cleanEmail,
        _replyto: cleanEmail,
        _subject: subject,
        inquiryType: categoryLabel,
        service: payload.serviceTitle,
        message: cleanNotes,
      }),
    });

    if (response.ok || response.type === "opaque") {
      return {
        ok: true,
        mode: "api",
        message:
          payload.lang === "id"
            ? "Permintaan berhasil dikirim langsung ke Gmail Ahmad Mulia Saputra!"
            : "Inquiry successfully sent directly to Ahmad Mulia Saputra's Gmail!",
      };
    }

    return {
      ok: true,
      mode: "gmail-compose",
      message:
        payload.lang === "id"
          ? "Membuka komposisi langsung di Gmail..."
          : "Opening direct Gmail composer...",
    };
  } catch {
    return {
      ok: true,
      mode: "gmail-compose",
      message:
        payload.lang === "id"
          ? "Membuka komposisi langsung di Gmail..."
          : "Opening direct Gmail composer...",
    };
  }
}
