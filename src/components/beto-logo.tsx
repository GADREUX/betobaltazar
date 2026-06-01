export default function BetoLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 320"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Beto Baltazar — Corretor de Imóveis"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* House roof — red */}
      <g transform="translate(150, 0)">
        {/* Chimney */}
        <rect x="35" y="20" width="22" height="42" fill="#CC0D1A" />
        {/* Main roof shape — stylized long swooping roof like user's logo */}
        <path
          d="M 10 130 L 90 50 L 155 95 L 215 65 L 275 105 L 290 145 L 10 145 Z"
          fill="#CC0D1A"
        />
        {/* Small window */}
        <rect x="125" y="95" width="32" height="28" fill="#141414" />
        <line x1="141" y1="95" x2="141" y2="123" stroke="#fff" strokeWidth="2.5" />
        <line x1="125" y1="109" x2="157" y2="109" stroke="#fff" strokeWidth="2.5" />
      </g>

      {/* BETO BALTAZAR text — large, centered */}
      <text
        x="300"
        y="225"
        textAnchor="middle"
        fill="#141414"
        fontFamily="Fraunces, Georgia, serif"
        fontWeight="700"
        fontSize="60"
        letterSpacing="1"
      >
        BETO BALTAZAR
      </text>

      {/* CORRETOR DE IMÓVEIS subtitle */}
      <text
        x="300"
        y="270"
        textAnchor="middle"
        fill="#141414"
        fontFamily="Outfit, system-ui, sans-serif"
        fontWeight="500"
        fontSize="18"
        letterSpacing="8"
      >
        CORRETOR DE IMÓVEIS
      </text>
    </svg>
  );
}
