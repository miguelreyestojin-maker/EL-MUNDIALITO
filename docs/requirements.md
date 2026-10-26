# Especificación de Requerimientos - Plataforma "Torneo Relámpago"

## 1. Visión General
Desarrollar una plataforma web full-stack optimizada para dispositivos móviles y de escritorio para la gestión en tiempo real de un torneo de fútbol de eliminación directa ejecutado en un solo día.

---

## 2. Estructura de Categorías y Formatos
El sistema gestiona 3 categorías independientes con un selector principal:
* **Fútbol 1 (Mini fútbol / Infantil):** 16 equipos. Formato: Octavos (8 partidos) → Cuartos → Semifinales -> (partido por el tercer lugar) → Final.
* **Fútbol 2 (Fútbol normal):** 16 equipos. Formato: Octavos (8 partidos) → Cuartos → Semifinales -> (partido por el tercer lugar) → Final.
* **Fútbol 3 (Fútbol grande):** 4 equipos. Formato: Semifinales (2 partidos) -> (partido por el tercer lugar) → Final.

---

## 3. Roles y Módulos de Acceso

### A. Vista Pública / Espectadores (Sin autenticación)
* Visualización del **mapa del árbol de partidos** (bracket interactivo) por categoría en tiempo real.
* Visualización del **ranking / tabla de posiciones** acumulada por categoría.

### B. Módulo de Administración (Admin General)
* **Credenciales por defecto:**
  * **Usuario:** `JTOJIN`
  * **Contraseña:** `Glasswing_fut26`
* Alta, edición y registro de equipos por categoría.
* Asignación manual de enfrentamientos para la primera ronda (octavos/semis según la categoría).
* Gestión de permisos y asignación de partidos a Visores de Cancha.

### C. Panel del Visor de Canchas (Staff en Campo)
* Interfaz táctil optimizada para teléfonos móviles.
* Selección de cancha y partido asignado.
* Control manual de marcador y tarjetas en tiempo real.
* Botón modal de confirmación **"FINALIZAR PARTIDO"**.

---

## 4. Reglas y Lógica de Negocio de los Partidos

### A. Estados del Partido
1. **Programado (`scheduled`):** Equipos asignados, pendiente de inicio.
2. **En Vivo (`in_progress`):** Marcador y contadores activos para edición en tiempo real.
3. **Finalizado (`completed`):** Datos bloqueados (solo lectura), declaración de ganador e integración automática en el árbol.

### B. Avance en el Árbol (Brackets) y Desempates
* **Ganador Directo:** El equipo con más goles al marcar `completed` avanza automáticamente a la siguiente ronda.
* **Manejo de Empates (Penales):**
  * Si el tiempo reglamentario termina empatado, el visor activa la sección **"Tanda de Penales"**.
  * Se registra el resultado de penales (ej. `4 - 3`).
  * El marcador reglamentario permanece para las estadísticas, pero el ganador de penales avanza en el árbol.

### C. Registro de Eventos (Visor)
* Contadores con `+` y `-` para corrección rápida de goles, tarjetas amarillas y rojas.
* Confirmación requerida mediante modal al presionar **"FINALIZAR PARTIDO"**.

### D. Criterios de Desempate en Ranking
1. **Diferencia de Goles (DG):** $\text{GF} - \text{GC}$
2. **Goles a Favor (GF)**
3. **Fair Play (Disciplina):**
   * Amarilla = +1 pt penalización
   * Roja = +3 pts penalización
   *(Menor puntaje obtiene mejor posición)*
4. **Menor cantidad de Goles en Contra (GC)**

---

## 5. Requerimientos Técnicos
* **Framework:** Next.js (App Router) + TypeScript.
* **Estilos:** Tailwind CSS.
* **Base de Datos & Realtime:** Supabase (Sincronización en tiempo real vía suscripciones).