import { Helmet } from "react-helmet-async";

interface PressSeoProps {
  title: string;
  description: string;
  path: string;
  jsonLd?: Record<string, unknown>;
}

const BASE = "https://swapnserve.com";

const PressSeo = ({ title, description, path, jsonLd }: PressSeoProps) => {
  const url = `${BASE}${path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="article" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default PressSeo;
