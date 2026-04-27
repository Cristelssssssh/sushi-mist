from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ---------------------- Models ----------------------
class OrderItem(BaseModel):
    id: str
    name: str
    price: float
    qty: int


class OrderCreate(BaseModel):
    customer_name: Optional[str] = ""
    customer_phone: Optional[str] = ""
    address: Optional[str] = ""
    notes: Optional[str] = ""
    items: List[OrderItem]
    total: float


class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str = ""
    customer_phone: str = ""
    address: str = ""
    notes: str = ""
    items: List[OrderItem]
    total: float
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ---------------------- Demo Menu ----------------------
DEMO_MENU = [
    {
        "id": "surimist",
        "category": "sushi",
        "name_es": "Surimist",
        "name_en": "Surimist",
        "desc_es": "Sushi relleno de surimi con vegetales salteados.",
        "desc_en": "Sushi filled with surimi and sautéed vegetables.",
        "price": 2000,
        "image": "",
    },
    {
        "id": "nigiri-surimi",
        "category": "sushi",
        "name_es": "Nigiri de Surimi",
        "name_en": "Surimi Nigiri",
        "desc_es": "Base de arroz con láminas de surimi a la plancha y salsa especial de cebolla con miel.",
        "desc_en": "Rice base topped with grilled surimi slices and a special honey-onion sauce.",
        "price": 1950,
        "image": "",
    },
    {
        "id": "akai-maki",
        "category": "sushi",
        "name_es": "Akai Maki",
        "name_en": "Akai Maki",
        "desc_es": "Roll relleno de surimi suave y jugoso, combinado con un toque de vegetales frescos. Por fuera, arroz japonés.",
        "desc_en": "Roll filled with tender, juicy surimi combined with a touch of fresh vegetables. Coated in Japanese rice.",
        "price": 2500,
        "image": "",
    },
    {
        "id": "gunkan-su",
        "category": "sushi",
        "name_es": "Gunkan Su",
        "name_en": "Gunkan Su",
        "desc_es": "Base de arroz con relleno de surimi en cubos y vegetales salteados.",
        "desc_en": "Rice base with cubed surimi filling and sautéed vegetables.",
        "price": 1950,
        "image": "",
    },
    {
        "id": "kumo-roll",
        "category": "sushi",
        "name_es": "Kumo Roll (Rollo nube)",
        "name_en": "Kumo Roll (Cloud Roll)",
        "desc_es": "Relleno de queso, mayonesa y cebolla (opción caramelizada).",
        "desc_en": "Filled with cheese, mayo and onion (caramelized option available).",
        "price": 1700,
        "image": "",
    },
    {
        "id": "midori-roll",
        "category": "sushi",
        "name_es": "Midori Roll (Rollo Verde)",
        "name_en": "Midori Roll (Green Roll)",
        "desc_es": "Con aguacate, ají, cebollino y pepino en vinagreta. Fresco y saludable.",
        "desc_en": "Avocado, chili, chives and cucumber in vinaigrette. Fresh and healthy.",
        "price": 1850,
        "image": "",
    },
    {
        "id": "sakura-beef-roll",
        "category": "sushi",
        "name_es": "Sakura Beef Roll",
        "name_en": "Sakura Beef Roll",
        "desc_es": "(Sushi de carne) Carne jugosa con aguacate fresco, envuelto en alga nori y arroz japonés.",
        "desc_en": "(Beef sushi) Juicy beef with fresh avocado, wrapped in nori seaweed and Japanese rice.",
        "price": 2200,
        "image": "",
    },
    {
        "id": "wakame-sumo-bowl",
        "category": "bowl",
        "name_es": "Wakame Sumo Bowl",
        "name_en": "Wakame Sumo Bowl",
        "desc_es": "Empanadas de curry y carne prensada acompañadas de arroz, vegetales marinados y alga kombu.",
        "desc_en": "Curry and pressed-beef dumplings served with rice, marinated vegetables and kombu seaweed.",
        "price": 1700,
        "image": "",
    },
]
# ---- SUSHI ----
    {
        "id": "ebi-camaron",
        "category": "sushi",
        "name_es": "Ebi de Camarón",
        "name_en": "Ebi Shrimp",
        "desc_es": "Base de arroz coronada con un camarón abierto en mariposa, abrazado por una cinta de alga nori, brotes de soja crujientes y un hilo de salsa caramelizada de cebolla.",
        "desc_en": "Rice base topped with a butterflied shrimp, wrapped by a nori band, crisp soybean sprouts and a drizzle of caramelized onion sauce.",
        "price": 2000,
        "image": "/menu/ebi-camaron.jpg",
    },
    {
        "id": "temaki",
        "category": "sushi",
        "name_es": "Temaki",
        "name_en": "Temaki",
        "desc_es": "Cono de alga nori relleno de arroz perfumado, vegetales salteados al wok y camarones dorados a la plancha. Se come con la mano, como en Kyoto.",
        "desc_en": "Nori cone filled with fragrant rice, wok-sautéed vegetables and griddle-seared shrimp. Eaten by hand, Kyoto style.",
        "price": 2050,
        "image": "/menu/temaki.jpg",
    },
    {
        "id": "samurai-roll",
        "category": "sushi",
        "name_es": "Samurai Roll",
        "name_en": "Samurai Roll",
        "desc_es": "Roll relleno de atún rojo de cola azul bañado en una salsa con especias tradicionales japonesas. Intenso, umami y profundo como el mar del norte.",
        "desc_en": "Roll filled with bluefin tuna in a traditional Japanese-spiced sauce. Intense, umami and as deep as the northern sea.",
        "price": 2250,
        "image": "/menu/samurai-roll.jpg",
    },
    {
        "id": "onigiri-carne",
        "category": "sushi",
        "name_es": "Onigiri de Carne de Res",
        "name_en": "Beef Onigiri",
        "desc_es": "Cinco onigiri de arroz hechos a mano, rellenos de carne de res mechada y presentados con adornos al gusto del cliente.",
        "desc_en": "Five hand-shaped rice onigiri filled with slow-cooked shredded beef, presented with garnishes tailored to the guest.",
        "price": 2000,
        "image": "/menu/onigiri-carne.jpg",
    },

    # ---- ENTRANTES ----
    {
        "id": "tartar-camarones",
        "category": "entrantes",
        "name_es": "Tartar de Camarones",
        "name_en": "Shrimp Tartare",
        "desc_es": "Vegetales marinados entrelazados con camarones preparados en soja, vinagre de arroz, sal, cebollino fresco y una suave esencia de camarón.",
        "desc_en": "Marinated vegetables woven with shrimp dressed in soy, rice vinegar, salt, fresh chives and a gentle shrimp essence.",
        "price": 1200,
        "image": "/menu/tartar-camarones.jpg",
    },
    {
        "id": "camarones-empanados",
        "category": "entrantes",
        "name_es": "Camarones Empanados",
        "name_en": "Breaded Shrimp",
        "desc_es": "Siete camarones rebozados en pan rallado al estilo tradicional, con orégano, sal marina y especias clásicas. Dorados y crujientes por fuera, jugosos por dentro.",
        "desc_en": "Seven shrimp coated in traditional-style breadcrumbs with oregano, sea salt and classic spices. Golden and crisp outside, juicy within.",
        "price": 1000,
        "image": "/menu/camarones-empanados.jpg",
    },
    {
        "id": "tartar-surimi",
        "category": "entrantes",
        "name_es": "Tartar de Surimi",
        "name_en": "Surimi Tartare",
        "desc_es": "Vegetales marinados entrelazados con surimi en soja, vinagre de arroz, sal y cebollino fresco. Versión suave y cremosa del clásico tartar.",
        "desc_en": "Marinated vegetables woven with surimi in soy, rice vinegar, salt and fresh chives. A gentle, creamy take on the classic tartare.",
        "price": 1200,
        "image": "/menu/tartar-surimi.jpg",
    },
    {
        "id": "empanadas-samosa",
        "category": "entrantes",
        "name_es": "Empanadas Samosa",
        "name_en": "Samosa Dumplings",
        "desc_es": "Cinco empanadas samosa crujientes reposando sobre una cama de alga wakame fresca, acompañadas de su salsa especial de la casa.",
        "desc_en": "Five crisp samosa dumplings resting on a bed of fresh wakame seaweed, served with the house's signature sauce.",
        "price": 950,
        "image": "/menu/empanadas-samosa.jpg",
    },

    # ---- CALIENTES ----
    {
        "id": "arroz-frito-res",
        "category": "calientes",
        "name_es": "Arroz Frito de Res",
        "name_en": "Beef Fried Rice",
        "desc_es": "Arroz salteado al wok con carne de res mechada agridulce, tortilla en tiras finas, brotes de soja, un hilo de aceite de sésamo, vegetales crujientes y especias tradicionales.",
        "desc_en": "Wok-tossed rice with sweet-and-sour shredded beef, thin omelet ribbons, soybean sprouts, a drizzle of sesame oil, crisp vegetables and traditional spices.",
        "price": 2450,
        "image": "/menu/arroz-frito-res.jpg",
    },
    {
        "id": "arroz-frito-camarones",
        "category": "calientes",
        "name_es": "Arroz Frito de Camarones",
        "name_en": "Shrimp Fried Rice",
        "desc_es": "Arroz salteado al wok con camarones dorados a la plancha, tortilla en tiras, brotes de soja, aceite de sésamo, vegetales y especias tradicionales japonesas.",
        "desc_en": "Wok-tossed rice with griddle-seared shrimp, shredded omelet, soybean sprouts, sesame oil, vegetables and traditional Japanese spices.",
        "price": 2450,
        "image": "/menu/arroz-frito-camarones.jpg",
    },
    {
        "id": "arroz-frito-surimi",
        "category": "calientes",
        "name_es": "Arroz Frito de Surimi",
        "name_en": "Surimi Fried Rice",
        "desc_es": "Arroz salteado al wok con surimi en delicados cubos, tortilla, brotes de soja, aceite de sésamo, vegetales crujientes y especias japonesas.",
        "desc_en": "Wok-tossed rice with delicate surimi cubes, omelet, soybean sprouts, sesame oil, crisp vegetables and Japanese spices.",
        "price": 2450,
        "image": "/menu/arroz-frito-surimi.jpg",
    },
    {
        "id": "arroz-frito-atun",
        "category": "calientes",
        "name_es": "Arroz Frito con Atún Rojo",
        "name_en": "Bluefin Tuna Fried Rice",
        "desc_es": "Arroz salteado al wok con láminas de atún rojo de cola azul al natural, tortilla, brotes de soja, aceite de sésamo, vegetales y especias tradicionales. Un lujo del océano.",
        "desc_en": "Wok-tossed rice with natural bluefin tuna slices, omelet, soybean sprouts, sesame oil, vegetables and traditional spices. An ocean luxury.",
        "price": 2450,
        "image": "/menu/arroz-frito-atun.jpg",
    },
    {
        "id": "bushi-green-noodles",
        "category": "calientes",
        "name_es": "Bushi Green Noodles",
        "name_en": "Bushi Green Noodles",
        "desc_es": "Fideos verdes al té matcha bañados en una cremosa pasta de queso y coronados con cebolla y ají caramelizados. Umami, dulce y terroso a la vez.",
        "desc_en": "Matcha-green noodles coated in a creamy cheese sauce, crowned with caramelized onion and chili. Umami, sweet and earthy all at once.",
        "price": 2100,
        "image": "/menu/bushi-green-noodles.jpg",
    },

    # ---- MARISCOS ----
    {
        "id": "mist-blue",
        "category": "mariscos",
        "name_es": "Mist Blue",
        "name_en": "Mist Blue",
        "desc_es": "Atún rojo de cola azul sellado a la plancha y encebollado lentamente, donde la cebolla se funde con el jugo del pescado.",
        "desc_en": "Bluefin tuna seared on the griddle and slow-cooked with onion, letting the onion melt into the fish's own juices.",
        "price": 1950,
        "image": "/menu/mist-blue.jpg",
    },
    {
        "id": "perla-roja",
        "category": "mariscos",
        "name_es": "Perla Roja",
        "name_en": "Red Pearl",
        "desc_es": "Atún rojo de cola azul ahumado suavemente y curado en vinagre de arroz. Sabor profundo, ligeramente ácido y aromático a madera.",
        "desc_en": "Bluefin tuna gently smoked and cured in rice vinegar. Deep, lightly acidic flavor with a woody aroma.",
        "price": 1900,
        "image": "/menu/perla-roja.jpg",
    },

    # ---- RAMEN ----
    {
        "id": "ramen-carne",
        "category": "ramen",
        "name_es": "Ramen de Carne",
        "name_en": "Beef Ramen",
        "desc_es": "Fideos Wai Wai nadando en un caldo de alga wakame con brotes de soja, soja tradicional, cebolleta fresca y carne agridulce que se deshace en la boca.",
        "desc_en": "Wai Wai noodles in a wakame seaweed broth with soybean sprouts, traditional soy, fresh scallions and melt-in-your-mouth sweet-and-sour beef.",
        "price": 2300,
        "image": "/menu/ramen-carne.jpg",
    },
    {
        "id": "ramen-camarones",
        "category": "ramen",
        "name_es": "Ramen de Camarones",
        "name_en": "Shrimp Ramen",
        "desc_es": "Fideos Wai Wai en caldo de alga wakame con brotes de soja, soja tradicional, cebolleta fresca y camarones jugosos salteados. Un abrazo del mar.",
        "desc_en": "Wai Wai noodles in wakame broth with soybean sprouts, traditional soy, fresh scallions and juicy sautéed shrimp. A hug from the sea.",
        "price": 2350,
        "image": "/menu/ramen-camarones.jpg",
    },

    # ---- BEBIDAS ----
    {
        "id": "refresco-limon",
        "category": "bebidas",
        "name_es": "Refresco de Limón",
        "name_en": "Lemon Soda",
        "desc_es": "Refresco frío de limón, burbujeante y refrescante.",
        "desc_en": "Chilled lemon soda, bubbly and refreshing.",
        "price": 400,
        "image": "/menu/refresco-limon.jpg",
    },
    {
        "id": "refresco-cola",
        "category": "bebidas",
        "name_es": "Refresco de Cola",
        "name_en": "Cola Soda",
        "desc_es": "Refresco de cola clásico, bien frío.",
        "desc_en": "Classic cola soda, served ice-cold.",
        "price": 400,
        "image": "/menu/refresco-cola.jpg",
    },
    {
        "id": "refresco-naranja",
        "category": "bebidas",
        "name_es": "Refresco de Naranja",
        "name_en": "Orange Soda",
        "desc_es": "Refresco de naranja, dulce y cítrico.",
        "desc_en": "Sweet citrusy orange soda.",
        "price": 400,
        "image": "/menu/refresco-naranja.jpg",
    },

    # ---- POSTRES ----
    {
        "id": "flan-caramelo",
        "category": "postres",
        "name_es": "Flan de Caramelo",
        "name_en": "Caramel Flan",
        "desc_es": "Flan suave de huevo bañado en caramelo oscuro casero. Clásico, sedoso y nostálgico.",
        "desc_en": "Silky egg flan drizzled with homemade dark caramel. Classic, smooth and nostalgic.",
        "price": 450,
        "image": "/menu/flan-caramelo.jpg",
    },

# ---------------------- Routes ----------------------
@api_router.get("/")
async def root():
    return {"message": "Kyoto Sushi API"}


@api_router.get("/menu")
async def get_menu():
    return DEMO_MENU


@api_router.post("/orders", response_model=Order)
async def create_order(payload: OrderCreate):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    order = Order(
        customer_name=payload.customer_name or "",
        customer_phone=payload.customer_phone or "",
        address=payload.address or "",
        notes=payload.notes or "",
        items=payload.items,
        total=payload.total,
    )
    doc = order.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.orders.insert_one(doc)
    return order


@api_router.get("/orders", response_model=List[Order])
async def list_orders():
    orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    for o in orders:
        if isinstance(o.get("created_at"), str):
            o["created_at"] = datetime.fromisoformat(o["created_at"])
    return orders


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
