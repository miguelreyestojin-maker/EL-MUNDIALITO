# Guía de Diseño y Sistema de Tokens - "Torneo Relámpago" (Edición Especial FIFA / Estética Lúdica)

## 1. Concepto Estético
- **Concepto:** *Cancha Festiva / Estilo Oficial FIFA World Cup & Education Fund*. Transición total de modo oscuro a un diseño luminoso, fresco, juvenil y accesible.
- **Fondo General (`canvas`):** `#efefeb` (Crema claro / papel ecológico de alta calidad).
- **Superficies y Tarjetas:** Tarjetas blancas limpias y nítidas (`#ffffff`) con ligeras sombras suaves y bordes sutiles (`border-black/10`), simulando tarjetas físicas coleccionables o calcomanías organizadas.
- **Acentos Visuales:** 
  - **Azul Principal (`#3f88d9`):** Usado en la navegación, títulos principales, bordes activos de categorías y elementos de marca.
  - **Coral / Rojo Vivo (`#e16044`):** Usado para estados "En Vivo", insignias parpadeantes, llamadas a la acción secundarias y tarjetas rojas de disciplina.
  - **Verde Deportivo (`#0aab36`):** Usado para indicar ganadores, líderes del ranking, elementos de éxito y acentos de campo.
- **Toques Gráficos (Doodles / Estilo Manual):** Integración sutil de elementos gráficos decorativos inspirados en la estética de arte popular juvenil (estrellas dibujadas a mano, silbatos, corazones y trazos de contorno).

---

## 2. Tipografía

### Display (Encabezados y Números Grandes)
- **Fuente:** `Bebas Neue` (o tipografía condensada de alto impacto).
- **Estilo:** Mayúsculas con tracking amplio (`tracking-wider`).
- **Uso:** Títulos principales, marcadores de partidos, nombres de categorías y botones de acción.

### Texto Principal
- **Fuente:** `Barlow` (Pesos: 400 / 500 / 600 / 700).
- **Uso:** Cuerpos de texto, tablas, nombres de equipos y etiquetas de estado.

### Marcadores y Contadores
- **Regla:** Aplicación obligatoria de la propiedad `tabular-nums` en todos los dígitos de marcadores para evitar saltos visuales durante actualizaciones en tiempo real.

---

## 3. Paleta de Colores y Tokens CSS

| Token | Valor Hex / Clase | Aplicación / Uso |
| :--- | :--- | :--- |
| `--bg-canvas` | `#efefeb` | Fondo general de toda la aplicación (Crema claro). |
| `--color-primary-blue` | `#3f88d9` | Azul principal, barra superior, elementos activos de navegación. |
| `--color-accent-coral` | `#e16044` | Estado "En Vivo", alertas, botones de acción destructiva o cierre. |
| `--color-success-green` | `#0aab36` | Ganadores, posiciones líderes, indicadores positivos. |
| `--bg-surface-card` | `#ffffff` | Fondo de las tarjetas de partidos, paneles de categorías y modales. |
| `--border-card` | `rgba(0, 0, 0, 0.08)` | Bordes limpios y sutiles para tarjetas sobre fondo claro. |

---

## 4. Componentes Clave

### A. Barra Superior (Navbar)
- Fondo blanco o translúcido claro con sombra muy ligera.
- Logo oficial con acentos coloridos, título **"TORNEO RELÁMPAGO"** en azul `#3f88d9`.
- Accesos directos: **Público**, **Cancha**, **Admin** (con la sección activa resaltada en azul).

### B. Pestañas de Categoría (CategoryTabs)
- Tres bloques blancos estilizados con el nombre en `Bebas Neue` y subtítulo.
- La categoría seleccionada se resalta con un borde de color y un sutil halo dinámico.

### C. Tarjeta de Partido (MatchCard)
- **Ancho fijo:** `224px`.
- **Fondo:** Blanco limpio (`#ffffff`) con sombra elegante.
- **Cabecera:** Nombre de cancha + píldora de estado (`Programado` en coral, `EN VIVO` parpadeante, `Finalizado`).
- **Filas de Equipos:** Nombre del equipo, mini-contador de tarjetas y marcador numérico grande en `tabular-nums`.
- **Estados Visuales:** El equipo perdedor se atenúa con opacidad; los partidos en vivo llevan borde o indicador coral destacado.

### D. Árbol de Eliminatorias (Bracket)
- Columnas organizadas por rondas (Octavos, Cuartos, Semifinal, Final) sobre el fondo `#efefeb`.
- Conectores limpios y legibles entre llaves.

### E. Tabla de Ranking (RankingTable)
- Tabla compacta con fondo blanco: Posición, Equipo, GF, GC, Tarjetas Amarillas, Tarjetas Roja.
- Los 3 primeros lugares resaltados con los colores institucionales (verde neón/deportivo y azul).

### F. Control de Cancha / Staff (VisorControl)
- Panel móvil de control con diseño claro y táctil.
- Marcador gigante numérico.
- Botones grandes y accesibles para `+ GOL`, control de tarjetas y botón principal de **"FINALIZAR PARTIDO"**.

### G. Panel Admin (AdminDashboard)
- Formularios limpios, tablas ordenadas y gestión fluida de equipos y visores.