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
        "id": "sake-nigiri",
        "category": "nigiri",
        "name_es": "Sake Nigiri",
        "name_en": "Salmon Nigiri",
        "desc_es": "Salmón fresco sobre arroz avinagrado, dos piezas.",
        "desc_en": "Fresh salmon over vinegared rice, two pieces.",
        "price": 6.50,
        "image": "https://images.pexels.com/photos/31286785/pexels-photo-31286785.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
        "id": "maguro-nigiri",
        "category": "nigiri",
        "name_es": "Maguro Nigiri",
        "name_en": "Tuna Nigiri",
        "desc_es": "Atún rojo de aleta, corte tradicional, dos piezas.",
        "desc_en": "Bluefin tuna, traditional cut, two pieces.",
        "price": 7.20,
        "image": "https://images.pexels.com/photos/31415308/pexels-photo-31415308.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    },
    {
        "id": "philadelphia-roll",
        "category": "rolls",
        "name_es": "Philadelphia Roll",
        "name_en": "Philadelphia Roll",
        "desc_es": "Salmón, queso crema y aguacate. 8 piezas.",
        "desc_en": "Salmon, cream cheese and avocado. 8 pieces.",
        "price": 9.80,
        "image": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=900&q=80",
    },
    {
        "id": "dragon-roll",
        "category": "rolls",
        "name_es": "Dragon Roll",
        "name_en": "Dragon Roll",
        "desc_es": "Tempura de camarón, aguacate y salsa unagi. 8 piezas.",
        "desc_en": "Shrimp tempura, avocado and unagi sauce. 8 pieces.",
        "price": 11.50,
        "image": "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=900&q=80",
    },
    {
        "id": "tonkotsu-ramen",
        "category": "ramen",
        "name_es": "Tonkotsu Ramen",
        "name_en": "Tonkotsu Ramen",
        "desc_es": "Caldo cremoso de cerdo, chashu, huevo marinado y nori.",
        "desc_en": "Creamy pork broth, chashu, marinated egg and nori.",
        "price": 12.90,
        "image": "https://images.unsplash.com/photo-1623341214825-9f4f963727da?auto=format&fit=crop&w=900&q=80",
    },
    {
        "id": "miso-ramen",
        "category": "ramen",
        "name_es": "Miso Ramen",
        "name_en": "Miso Ramen",
        "desc_es": "Caldo de miso rojo, brotes de bambú, maíz y huevo.",
        "desc_en": "Red miso broth, bamboo shoots, corn and egg.",
        "price": 11.40,
        "image": "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&w=900&q=80",
    },
    {
        "id": "gyoza",
        "category": "sides",
        "name_es": "Gyoza (6 pzs)",
        "name_en": "Gyoza (6 pcs)",
        "desc_es": "Empanadillas japonesas de cerdo a la plancha.",
        "desc_en": "Pan-fried Japanese pork dumplings.",
        "price": 5.60,
        "image": "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=900&q=80",
    },
    {
        "id": "edamame",
        "category": "sides",
        "name_es": "Edamame",
        "name_en": "Edamame",
        "desc_es": "Vainas de soja al vapor con sal marina.",
        "desc_en": "Steamed soybean pods with sea salt.",
        "price": 3.50,
        "image": "https://images.unsplash.com/photo-1564834744159-ff0ea41ba4b9?auto=format&fit=crop&w=900&q=80",
    },
    {
        "id": "matcha-latte",
        "category": "drinks",
        "name_es": "Matcha Latte",
        "name_en": "Matcha Latte",
        "desc_es": "Té verde matcha ceremonial con leche.",
        "desc_en": "Ceremonial matcha green tea with milk.",
        "price": 4.20,
        "image": "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=900&q=80",
    },
    {
        "id": "ramune",
        "category": "drinks",
        "name_es": "Ramune Soda",
        "name_en": "Ramune Soda",
        "desc_es": "Refresco japonés tradicional con canica.",
        "desc_en": "Traditional Japanese marble soda.",
        "price": 3.80,
        "image": "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=900&q=80",
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
