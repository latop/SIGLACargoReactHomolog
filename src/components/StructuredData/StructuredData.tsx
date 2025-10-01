"use client";

export interface StructuredDataProps {
  data: Record<string, unknown>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Sigla Cargo",
  url:
    process.env.NODE_ENV === "production"
      ? "pepsicobrasil.sigla.app"
      : "http://localhost:3000",
  logo: {
    "@type": "ImageObject",
    url: "/pepsico-logo.png",
    width: 300,
    height: 150,
  },
  description:
    "Sistema de Gestão Logística - Plataforma completa para gerenciamento de frotas e logística da Pepsico",
  parentOrganization: {
    "@type": "Organization",
    name: "PepsiCo",
    url: "https://www.pepsico.com",
  },
  applicationCategory: "Business Software",
  operatingSystem: "Web Browser",
};

export const webApplicationStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Sigla Cargo",
  description:
    "Sistema de Gestão Logística para otimização de frotas e operações de transporte",
  url:
    process.env.NODE_ENV === "production"
      ? "pepsicobrasil.sigla.app"
      : "http://localhost:3000",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "BRL",
  },
  featureList: [
    "Gestão de frotas",
    "Otimização de rotas",
    "Controle de motoristas",
    "Relatórios analíticos",
    "Planejamento de viagens",
  ],
  screenshot: {
    "@type": "ImageObject",
    url: "/og-image.png",
  },
};
