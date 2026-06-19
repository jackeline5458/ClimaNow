# 🌤️ ClimaNow

**Previsão do tempo inteligente** inspirada no app Tempo do iPhone. Interface glassmorphism com dicas baseadas no clima real.

## ✨ Funcionalidades

- 📍 **Geolocalização automática** ao abrir o app
- 🔍 **Busca de cidades** com autocomplete e histórico
- 🌡️ **Clima atual** completo: temperatura, sensação térmica, UV, umidade, vento, pressão, visibilidade, nascer/pôr do sol
- ⏰ **Previsão horária** (próximas 24h) com scroll horizontal
- 📅 **Previsão semanal** (7 dias) com barras min/max animadas
- 💡 **15+ dicas inteligentes** (vestuário, saúde, atividades, alertas)
- ⭐ **Favoritos e histórico** persistidos no localStorage (Zustand)
- 🎨 **Fundo dinâmico** animado conforme o clima (sol, chuva, neve, trovão...)
- 🌙 **Modo claro/escuro** com toggle
- 💀 **Loading skeleton** e tratamento completo de erros

## 🛠️ Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript |
| Estilos | Tailwind CSS |
| Componentes | shadcn/ui |
| Animações | Framer Motion |
| Estado global | Zustand (com persistência) |
| Cache/Fetch | React Query (TanStack Query v5) |
| Clima | Open-Meteo API (gratuita, sem chave) |
| Geocodificação | Open-Meteo Geocoding + Nominatim |

## 🚀 Instalação e uso

### Pré-requisitos

- **Node.js** ≥ 18.17.0
- **npm** ≥ 9 (ou pnpm / yarn)

### 1. Clone o projeto

```bash
git clone https://github.com/seu-usuario/climanow.git
cd climanow
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Rode em desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

### 4. Build de produção

```bash
npm run build
npm start
```

### 5. Verificar tipos TypeScript

```bash
npm run type-check
```

---

## 📁 Estrutura de pastas

```
src/
├── app/
│   ├── page.tsx              # Página principal
│   ├── layout.tsx            # Layout raiz (metadados, fontes)
│   ├── providers.tsx         # React Query + Tema
│   └── globals.css           # Estilos globais + glassmorphism
│
├── components/
│   ├── weather/
│   │   ├── CurrentWeather.tsx   # Card de clima atual + métricas + arco solar
│   │   ├── HourlyForecast.tsx   # Scroll horizontal 24h
│   │   ├── WeeklyForecast.tsx   # Lista 7 dias com barras min/max
│   │   ├── WeatherBackground.tsx # Fundo dinâmico animado
│   │   ├── SmartTips.tsx        # 15+ dicas inteligentes colapsáveis
│   │   └── SearchBar.tsx        # Busca com autocomplete + histórico
│   ├── layout/
│   │   └── Header.tsx           # Header com busca, favorito, tema, unidade
│   └── shared/
│       ├── LoadingSkeleton.tsx  # Skeleton animado completo
│       └── ErrorMessage.tsx     # Erros + tela de boas-vindas
│
├── hooks/
│   ├── useGeolocation.ts    # Geolocalização do browser com estados
│   ├── useWeather.ts        # React Query para dados de clima
│   └── useSearch.ts         # Busca com debounce + React Query
│
├── services/
│   ├── weatherApi.ts        # Open-Meteo → WeatherData
│   ├── geocodingApi.ts      # Open-Meteo Geocoding + Nominatim
│   └── cacheService.ts      # Cache em memória + localStorage helpers
│
├── stores/
│   ├── weatherStore.ts      # Zustand: localização, favoritos, histórico
│   └── uiStore.ts           # Zustand: tema, unidade, tab ativa
│
├── utils/
│   ├── formatters.ts        # Formatação de temp, hora, vento, UV...
│   └── weatherHelpers.ts    # Lógica de clima: dicas, ícones, backgrounds
│
├── types/
│   └── weather.types.ts     # Todas as interfaces TypeScript
│
└── lib/
    ├── constants.ts         # API URLs, WMO codes, thresholds, storage keys
    └── utils.ts             # cn() para shadcn/ui
```

---

## 🌐 APIs utilizadas (100% gratuitas, sem chave)

### Open-Meteo — Clima
```
GET https://api.open-meteo.com/v1/forecast
  ?latitude={lat}&longitude={lon}
  &current=temperature_2m,apparent_temperature,...
  &hourly=temperature_2m,weather_code,...
  &daily=temperature_2m_max,sunrise,sunset,...
  &wind_speed_unit=kmh&forecast_days=7&timezone=auto
```

### Open-Meteo Geocoding — Busca de cidades
```
GET https://geocoding-api.open-meteo.com/v1/search
  ?name={cidade}&count=8&language=pt&format=json
```

### Nominatim — Reverse geocoding (coordenadas → cidade)
```
GET https://nominatim.openstreetmap.org/reverse
  ?lat={lat}&lon={lon}&format=json&accept-language=pt
```

---

## 💡 Regras das dicas inteligentes

| Condição | Dica | Prioridade |
|----------|------|-----------|
| Temp > 30°C | Hidratação | Alta |
| Temp < 10°C | Casaco obrigatório | Alta |
| Temp < 5°C | Risco de geada | Alta |
| UV > 8 | Protetor solar FPS 50+ | Alta |
| Chuva > 5mm | Guarda-chuva obrigatório | Alta |
| Vento > 50km/h | Cuidado com objetos | Alta |
| UV 6-8 | Protetor solar FPS 30+ | Média |
| Umidade < 30% | Hidratar pele | Média |
| 18-25°C sem chuva | Atividade ao ar livre | Média |
| Sensação ±5°C da real | Alerta de sensação | Média |
| Frio + ar seco | Risco de resfriado | Média |
| Umidade > 80% | Usar roupas ventiladas | Baixa |
| Vento 30-50km/h | Roupas não suficientes | Baixa |
| Garoa leve | Guarda-chuva compacto | Baixa |
| 20-28°C, dia, sem chuva | Bom para passeio | Baixa |

---

## 🚢 Deploy

### Vercel (recomendado)

```bash
# Instale a CLI da Vercel
npm i -g vercel

# Deploy
vercel

# Produção
vercel --prod
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy --build
```

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t climanow .
docker run -p 3000:3000 climanow
```

---

## ⚡ Performance

- React Query com staleTime de 10 min (evita requests desnecessários)
- Next.js fetch com `next: { revalidate: 600 }` para ISR
- Animações respeitam `prefers-reduced-motion`
- Fontes com `display: swap` para evitar FOUT
- Imagens em formato AVIF/WebP via next/image
- Bundle splitado automaticamente pelo App Router

**Lighthouse alvo: > 90** em todas as categorias.

---

## 📱 PWA

O app inclui `manifest.json` para instalação como PWA em Android e iOS.
Para service worker completo, instale `next-pwa`:

```bash
npm install next-pwa
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feat/nova-funcionalidade`
3. Commit: `git commit -m 'feat: adiciona X'`
4. Push: `git push origin feat/nova-funcionalidade`
5. Abra um Pull Request

---

## 📄 Licença

MIT © ClimaNow
