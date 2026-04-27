# Kyoto Ame — Sushi Delivery (Cuba)

## Original problem statement
Restaurante de delivery con pedido vía WhatsApp al número Cuba +53 52473962.
Estilo "Kyoto lluvia". Loader de sushi recibiendo mordiscos ("Preparando tu experiencia…"). Personaje chef tradicional japonés que reacciona al carrito (sonríe, aprueba, hace reverencia, "¡Excelente elección!"). Lluvia de Kyoto + linternas. Carrito con sushi volando. Botón de WhatsApp que vibra y brilla en verde. ES + EN. Pedidos guardados + redirección a WhatsApp.

## Architecture
- Backend: FastAPI + MongoDB (motor). Routes: `/api/menu`, `/api/orders` (POST/GET).
- Frontend: React 19 + Tailwind + framer-motion + lucide-react + sonner.
- WhatsApp: client-side `wa.me/5352473962?text=<formatted order>` opened after order is persisted.

## User personas
- **Cliente final (Cuba)**: explora menú, agrega platos, completa formulario, envía pedido a WhatsApp.
- **Dueño del restaurante**: recibe el pedido formateado en WhatsApp; ve historial vía `/api/orders`.

## Core requirements (static)
- Pedido por WhatsApp al número +5352473962
- Estética Kyoto lluvia (oscura, cálida, lluvia animada, linternas)
- Loader de sushi con mordidas, mensaje "Preparando tu experiencia…"
- Chef mascota animado con estados idle / smile / approve / bow
- Carrito con sushi volando + botón WhatsApp animado (pulse verde)
- Idiomas ES/EN
- Persistencia en MongoDB

## Implemented (Dec 2025)
- Backend: GET /api/menu (10 platos demo), POST /api/orders (valida items vacíos), GET /api/orders (sorted desc, sin _id leak)
- Frontend completo: Hero, MenuGrid con filtros (all/nigiri/rolls/ramen/sides/drinks), Cart drawer con inc/dec/remove, Checkout con validación, OrderConfirmation con chef bowing + auto-open wa.me
- KyotoRain canvas (rain + lantern glows) overlay
- ChefMascot SVG con 4 moods reactivos
- SushiLoader SVG con 3 bocados animados
- FlyingItem animation card→cart
- I18nProvider ES/EN con dictionary
- Sonner para toasts de validación
- 100% backend tests, 100% frontend tests passed (testing_agent_v3 iteration 1)

## Backlog
- P1: Admin dashboard `/admin` para ver/marcar pedidos como "preparando/enviado/entregado"
- P1: Calcular total en backend (no confiar en cliente) y validar contra menú
- P2: Sonido suave al agregar al carrito (toggle on/off)
- P2: Imágenes locales optimizadas en lugar de Pexels
- P2: Personalizable (panel para que el dueño edite menú/precios sin tocar código)
- P2: Cupones / códigos de descuento
- P2: Persistir carrito en localStorage

## Next tasks list
- Editor de menú en panel admin
- Cálculo seguro del total en backend
- Push notification / sonido al recibir pedido (lado del dueño)
