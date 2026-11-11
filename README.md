# LoanComparator (Comparador de Préstamos)

Aplicación web interactiva moderna desarrollada con **React**, **TypeScript** y **Vite** diseñada para comparar ofertas de préstamos bancarios de manera clara, transparente y detallada. Especialmente adaptada para el análisis financiero (con énfasis en el mercado de El Salvador), permite evaluar tasas de interés, seguros de deuda y de propiedad, comisiones iniciales y mensuales, así como la **Tasa de Interés Efectiva (TIE)** y el costo total real de cada financiamiento.

---

## Características Principales

- **Gestión Completa de Ofertas:** Agrega, edita y elimina ofertas de diferentes bancos o instituciones financieras.
- **Visualización Dual:** Alterna entre una vista de **Tarjetas** detalladas o una **Tabla comparativa** completa.
- **Métricas Avanzadas:** 
  - Cálculo automático de cuota base mensual (sistema francés).
  - Incorporación de seguros de deuda (saldo deudor) y seguros de propiedad.
  - Estimación de comisiones de apertura y mantenimiento mensual.
  - Cálculo de la **Tasa de Interés Efectiva (TIE)** estimada.
- **Tabla de Amortización:** Visualiza el desglose mes a mes de cada préstamo (saldo inicial, amortización de capital, intereses, seguros y saldo final).
- **Exportación de Datos:** Exporta tus comparativas y cálculos a formatos **CSV** o genera un informe profesional en **PDF** (usando jsPDF).
- **Persistencia Local:** Los datos se guardan automáticamente en el navegador (`localStorage`), con opción de restaurar las ofertas bancarias de ejemplo en cualquier momento.
- **Filtrado por Tipo:** Filtra rápidamente entre préstamos Hipotecarios, Personales, Vehiculares, Comerciales y otros.

---

## Tecnologías Utilizadas

- **React 19** / **React DOM**
- **TypeScript** para tipado estático seguro.
- **Vite** como empaquetador y entorno de desarrollo ultra rápido.
- **Lucide React** para iconos modernos.
- **jsPDF** y **jspdf-autotable** para la generación de reportes en PDF.
- **Oxlint** para control de calidad y linting.

---

## Instalación y Uso

Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior recomendada) y un gestor de paquetes como `npm`, `pnpm` o `yarn`.

1. **Clona el repositorio e instala las dependencias:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd loanComparator
   npm install  # o pnpm install
   ```

2. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev  # o pnpm dev
   ```
   La aplicación estará disponible en `http://localhost:5173`.

3. **Construye para producción:**
   ```bash
   npm run build
   ```

4. **Ejecuta el linter:**
   ```bash
   npm run lint
   ```

---

## Licencia

Este proyecto es de código abierto y está disponible bajo los términos de la licencia MIT.

## Pruebalo 
  URL del sitio: https://luismolinad.github.io/comparadorPrestamos/
