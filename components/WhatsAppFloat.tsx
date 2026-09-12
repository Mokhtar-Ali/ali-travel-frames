"use client";

const whatsappMessage =
  "Hi Ali Travel Frames, I would like help planning a private Colombia trip.";

type Gtag = (
  command: "event",
  action: string,
  params?: Record<string, unknown>,
) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

export function WhatsAppFloat() {
  const href = `https://wa.me/19177809875?text=${encodeURIComponent(
    whatsappMessage,
  )}`;

  return (
    <a
      href={href}
      className="whatsapp-float"
      aria-label="Message Ali Travel Frames on WhatsApp"
      onClick={() => {
        window.gtag?.("event", "whatsapp_click", {
          event_category: "engagement",
          event_label: "floating_whatsapp",
        });
      }}
    >
      <svg
        aria-hidden="true"
        className="h-8 w-8"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12.1 2.4a9.4 9.4 0 0 0-8.1 14.2L2.9 21l4.5-1.1a9.4 9.4 0 1 0 4.7-17.5Zm0 1.9a7.5 7.5 0 0 1 6.4 11.4 7.5 7.5 0 0 1-9.8 2.5l-.3-.2-2.7.7.7-2.6-.2-.3a7.5 7.5 0 0 1 5.9-11.5Zm-3.2 3.8c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.3 0 1.4 1 2.7 1.1 2.9.1.2 2 3.1 4.9 4.2 2.4 1 2.9.8 3.4.7.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.1-1.4-.1-.1-.3-.2-.6-.4l-1.9-.9c-.3-.1-.5-.2-.7.2-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1-.3-.2-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.6l-.9-2c-.2-.5-.5-.5-.7-.5h-.6Z" />
      </svg>
    </a>
  );
}
