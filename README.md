# 🌙 Luna Negra — Jessica · El Oráculo

**Luna Negra** es una aplicación web de tarot virtual con una estética dark mística. **Jessica**, la oráculo, guía al usuario a través de una experiencia interactiva completa: desde el saludo inicial hasta la interpretación final de las cartas, pasando por la selección de tema, preguntas de perfil, barajado animado y tirada personalizada.

Sin frameworks, sin dependencias externas, sin IA. Solo HTML, CSS y JavaScript vanilla con las 78 cartas del Tarot Rider-Waite y sus interpretaciones escritas a mano.

---

## 🧭 Flujo de la experiencia

```
Bienvenida → Nombre → Tema → Preguntas de perfil → Barajado → Tirada → Lectura
```

1. **Saludo** — Jessica pide tu nombre o apodo.
2. **Tema** — Elegís entre Amor, Dinero, Salud o Prosperidad.
3. **Perfil** — Respondés 3 preguntas según el tema (tu situación, prioridad, horizonte).
4. **Barajado** — Animación mientras las cartas se mezclan; podés escribir tu pregunta.
5. **Tirada** — Las cartas se revelan una por una en la posición correspondiente.
6. **Lectura** — Interpretación completa con resumen, contexto, cartas y veredicto.

---

## 🃏 Mazo completo — 78 cartas del Tarot Rider-Waite

| Tipo | Cantidad |
|------|----------|
| **Arcanos Mayores** | 22 (El Loco, El Mago, La Sacerdotisa, La Emperatriz, El Emperador, El Sumo Sacerdote, Los Enamorados, El Carro, La Fuerza, El Ermitaño, La Rueda de la Fortuna, La Justicia, El Colgado, La Muerte, La Templanza, El Diablo, La Torre, La Estrella, La Luna, El Sol, El Juicio, El Mundo) |
| **Arcanos Menores — Bastos (Fuego)** | 14 (As al Rey) |
| **Arcanos Menores — Copas (Agua)** | 14 (As al Rey) |
| **Arcanos Menores — Espadas (Aire)** | 14 (As al Rey) |
| **Arcanos Menores — Oros (Tierra)** | 14 (As al Rey) |

Cada carta incluye:
- Nombre, número, palo y glifo
- Palabras clave
- Interpretación **al derecho** e **invertida** para cada tema (general, amor, dinero, salud, prosperidad)

---

## 🎯 Tipos de tirada

La tirada se elige automáticamente según la longitud de tu pregunta:

| Tirada | Cartas | Descripción | Cuándo se usa |
|--------|--------|-------------|---------------|
| **Tres Cartas** | 3 | Pasado — Presente — Futuro | Preguntas cortas (< 25 caracteres) |
| **Las Siete Casas** | 7 | Una carta por cada día de la semana | Preguntas medianas o vacías |
| **Cruz Celta** | 10 | Lectura completa en dos columnas (5 + 5) | Preguntas largas (> 80 caracteres) |

### Posiciones de la Cruz Celta
1. **Presente** — El centro del asunto
2. **Reto** — El obstáculo que cruza tu presente
3. **Subconsciente** — Lo que sentís sin animarte a decir
4. **Pasado lejano** — Origen de la situación
5. **Pasado reciente** — Lo recién vivido
6. **Futuro cercano** — Hacia dónde empuja la rueda
7. **Vos misma** — Tu actitud interna
8. **Entorno** — Cómo te ven los demás
9. **Esperanza · Miedo** — La misma energía en dos caras
10. **Resultado** — El desenlace probable

### Las Siete Casas (por días)
1. **Lunes · Raíz** — Origen del tema
2. **Martes · Cruce** — Lo que hay que atravesar
3. **Miércoles · Voz** — Qué decir y qué callar
4. **Jueves · Acción** — Decisión a tomar
5. **Viernes · Persona** — Quién se cruza en tu camino
6. **Sábado · Prueba** — La prueba antes del cierre
7. **Domingo · Cierre** — Cómo termina la ronda

---

## 🎨 Diseño visual

- **Paleta**: Negro profundo, violeta, dorado y crema
- **Tipografía**: Cinzel (títulos) + Cormorant Garamond (cuerpo) — Google Fonts
- **Ambientación**: Partículas flotantes doradas, viñeta oscura, animaciones de entrada
- **Efectos**: Pulso del retrato de Jessica, flip de cartas 3D, destellos al revelar
- **Responsive**: Adaptado a desktop y móviles (< 560px)

---

## 🔈 Sonido ambiente

Generado por **Web Audio API** (sin archivos externos):
- 3 osciladores en armonía (110 Hz, 138.59 Hz, 220 Hz)
- Modulación por LFO para un efecto envolvente
- Botón de toggle en la esquina superior derecha

---

## 📤 Compartir lectura

- **Web Share API** en dispositivos compatibles
- **Portapapeles** como fallback
- Incluye nombre, tema y arcanos mayores de la tirada

---

## 🚀 Requisitos y uso

Solo necesitás un navegador moderno (Chrome, Firefox, Safari, Edge).

```bash
# Abrí el archivo directamente (no requiere servidor)
start index.html
```

O subí los archivos a cualquier hosting estático (Netlify, Vercel, GitHub Pages, etc.).

---

## 🗂 Estructura del proyecto

```
luna-negra/
├── index.html       # Página principal (6 pantallas)
├── styles.css       # Estilos dark mística (394 líneas)
├── deck.js          # Dataset 78 cartas + interpretaciones (974 líneas)
├── game.js          # Lógica del juego y flujo (670 líneas)
├── README.md        # Documentación
├── LICENSE          # Licencia MIT
└── .gitignore       # Ignorados de Git
```

---

## 🛠 Stack

| Tecnología | Uso |
|------------|-----|
| HTML5 | Estructura semántica con 6 pantallas modales |
| CSS3 | Variables, Gradients, Animations, Grid/Flexbox, Media Queries, Clamp |
| JavaScript (ES2020+) | IIFE, modular, closures, destructuring, arrow functions |
| Web Audio API | Sonido ambiente generativo con osciladores y LFO |
| Web Share API | Compartir lecturas nativamente |

**0 dependencias externas.** Solo Google Fonts (Cinzel + Cormorant Garamond) precargadas desde el HTML.

---

## 🧠 ¿Cómo funciona la interpretación?

No usa ninguna API de IA. Todas las interpretaciones están escritas a mano en `deck.js`:

1. Se seleccionan N cartas al azar del mazo de 78
2. Cada carta tiene 45% de probabilidad de salir invertida
3. Para la lectura se toma el texto correspondiente al tema elegido (amor/dinero/salud/prosperidad) y a la orientación (derecha/invertida)
4. El texto se personaliza con el nombre del usuario (~34% de las cartas)
5. Un `judgeTheme()` evalúa el ánimo general de la tirada según arcanos positivos/negativos y su posición en el spread
6. Las respuestas de perfil se inyectan como contexto en el resumen

---

## 🔮 Ejemplo de interpretación

> **Sobre Amor:** leí 7 cartas, 5 al derecho y 2 invertidas. 2 son Arcanos Mayores — el destino habla alto en esta tirada. El amor viene bien en esta tirada. Si estás construyendo, seguí. Si dudás, hay base.

Cada carta se despliega con:
- **Posición** (ej: Martes · Cruce)
- **Nombre de la carta** (ej: La Estrella — Derecha)
- **Significado de la posición** (ej: Lo que tenés que atravesar para avanzar)
- **Palabras clave** (esperanza, guía, serenidad, fe)
- **Interpretación personalizada** (ej: "Después de la tormenta, claridad. Confiá. — mirá, Lara.")

---

## 📄 Licencia

MIT — Ver archivo [LICENSE](LICENSE).

---