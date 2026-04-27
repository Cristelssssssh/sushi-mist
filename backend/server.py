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
