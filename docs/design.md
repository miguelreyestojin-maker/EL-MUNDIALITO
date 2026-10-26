# Guía de Diseño y Sistema de Tokens - "Torneo Relámpago"

## 1. Concepto Estético
* **Concepto:** *Noche de cancha iluminada*.
* **Fondo:** Verde muy oscuro con auras radiales sutiles que simulan reflectores sobre el césped.
* **Superficies:** Tarjetas de vidrio esmerilado (*glassmorphism*) con `backdrop-blur: 18px` y bordes blancos translúcidos al 12% (`border-white/12`).
* **Acento Principal:** Verde neón eléctrico para estados de victoria, líderes de ranking y marcas importantes, acompañado de un halo de luz suave (*glow*) en elementos activos.

---

## 2. Tipografía

### Display (Encabezados y Números Grandes)
* **Fuente:** `Bebas Neue`
* **Estilo:** Mayúsculas con tracking amplio (`tracking-wider`).
* **Uso:** Títulos principales, marcadores de partidos, nombres de categorías y botones de acción.

### Texto Principal
* **Fuente:** `Barlow` (Pesos: 400 / 500 / 600 / 700).
* **Uso:** Cuerpos de texto, tablas, nombres de equipos y etiquetas de estado.

### Marcadores y Contadores
* **Regla:** Aplicación de propiedad `tabular-nums` (fuentes monoespaciadas para dígitos) en todos los marcadores y contadores para evitar desplazamientos visuales durante cambios en vivo.

---

## 3. Paleta de Colores y Tokens

| Token | Valor Hex / Clase | Aplicación / Uso |
| :--- | :--- | :--- |
| `--color-primary-neon` | `#10B981` / `#00FF85` | Acento principal, ganadores, primer lugar, halos de luz (*glow*). |
| `--color-live-red` | `#EF4444` | Estado "En Vivo", indicador parpadeante, acciones destructivas. |
| `--color-card-yellow` | `#F59E0B` | Contador de tarjetas amarillas de disciplina. |
| `--color-card-red` | `#DC2626` | Contador de tarjetas rojas de disciplina. |
| `--bg-dark-pitch` | `#05130B` | Fondo principal (verde ultra oscuro estilo cancha nocturna). |
| `--bg-surface-glass` | `rgba(255, 255, 255, 0.05)` | Contenedores de vidrio esmerilado con blur de 18px. |
| `--border-glass` | `rgba(255, 255, 255, 0.12)` | Bordes sutiles de las tarjetas de vidrio. |

---

## 4. Componentes Clave

### A. Barra Superior (Navbar)
* Cristal de vidrio esmerilado fijo en la parte superior.
* 3 accesos: **Público**, **Cancha**, **Admin**.
* Indicador de sección activa tipo píldora destacada.

### B. Pestañas de Categoría (CategoryTabs)
* Tres bloques de vidrio con nombre en `Bebas Neue` y descripción corta.
* La categoría activa se rellena con borde/acento verde neón y sombra resplandeciente (*neon glow*).

### C. Tarjeta de Partido (MatchCard)
* **Ancho fijo:** `224px`.
* **Cabecera:** Nombre de cancha + píldora de estado (`Programado`, `EN VIVO` parpadeante, `Finalizado`).
* **Filas de Equipos:** Dos filas con nombre del equipo, mini-contador de tarjetas y marcador numérico grande.
* **Estados Visuales:** El equipo perdedor se atenúa (`opacity-50`); los partidos "En Vivo" llevan un anillo de luz rojo alrededor de la tarjeta.

### D. Árbol de Eliminatorias (Bracket)
* Columnas organizadas por rondas (Octavos, Cuartos, Semifinal, Final).
* Distribución vertical con alturas proporcionales derivadas de la primera ronda.

### E. Tabla de Ranking (RankingTable)
* Tabla compacta: Posición, Equipo, GF, GC, Tarjetas Amarillas, Tarjetas Rojas.
* Los 3 primeros lugares resaltados con indicadores verde neón.

### F. Control de Cancha / Staff (VisorControl)
* Vista móvil de dos paneles lado a lado.
* Marcador gigante (`8rem`).
* Botón **"+ GOL"** ancho por equipo.
* Contadores individuales para tarjetas amarillas y rojas.
* Botón rojo a todo el ancho: **"FINALIZAR PARTIDO"**.
* Panel emergente de penales si el marcador reglamentario queda empatado.

### G. Panel Admin (AdminDashboard)
* Formulario de alta de equipos por categoría.
* Lista de equipos inscritos con indicador de estado ("asignado" / "pendiente").
* Selector de cruces de partidos por ronda y asignación de visores/canchas.