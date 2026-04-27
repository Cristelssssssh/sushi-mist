"""Backend tests for Kyoto Sushi API: /api/menu and /api/orders."""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://whatsapp-meal-order.preview.emergentagent.com').rstrip('/')


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- /api/menu ----------
class TestMenu:
    def test_menu_returns_10_items_with_required_fields(self, api):
        r = api.get(f"{BASE_URL}/api/menu", timeout=20)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 10
        required = {"id", "category", "name_es", "name_en", "desc_es", "desc_en", "price", "image"}
        for item in data:
            missing = required - set(item.keys())
            assert not missing, f"Missing fields {missing} on item {item.get('id')}"
            assert isinstance(item["price"], (int, float))


# ---------- /api/orders ----------
class TestOrders:
    VALID_PAYLOAD = {
        "customer_name": "TEST_Kenji",
        "customer_phone": "+5352473962",
        "address": "TEST Calle Kyoto 1",
        "notes": "TEST note",
        "items": [
            {"id": "sake-nigiri", "name": "Sake Nigiri", "price": 6.50, "qty": 2},
            {"id": "tonkotsu-ramen", "name": "Tonkotsu Ramen", "price": 12.90, "qty": 1},
        ],
        "total": 25.90,
    }

    def test_create_order_valid(self, api):
        r = api.post(f"{BASE_URL}/api/orders", json=self.VALID_PAYLOAD, timeout=20)
        assert r.status_code == 200, r.text
        data = r.json()
        # No mongo _id leakage
        assert "_id" not in data
        assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
        assert data["status"] == "pending"
        assert "created_at" in data
        assert data["total"] == 25.90
        assert len(data["items"]) == 2
        assert data["items"][0]["id"] == "sake-nigiri"
        assert data["customer_name"] == "TEST_Kenji"

    def test_create_order_empty_items_returns_400(self, api):
        bad = {**self.VALID_PAYLOAD, "items": [], "total": 0}
        r = api.post(f"{BASE_URL}/api/orders", json=bad, timeout=20)
        assert r.status_code == 400

    def test_list_orders_sorted_desc_no_id_leak(self, api):
        # Ensure at least one order exists
        api.post(f"{BASE_URL}/api/orders", json=self.VALID_PAYLOAD, timeout=20)
        r = api.get(f"{BASE_URL}/api/orders", timeout=20)
        assert r.status_code == 200
        orders = r.json()
        assert isinstance(orders, list)
        assert len(orders) >= 1
        for o in orders:
            assert "_id" not in o
            assert "id" in o
            assert "created_at" in o
        # Sort desc
        timestamps = [o["created_at"] for o in orders]
        assert timestamps == sorted(timestamps, reverse=True)
