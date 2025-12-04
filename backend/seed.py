from datetime import date, timedelta

from database import SessionLocal
from models import User, Order

# ---------------------------
# FIXED USER DATA (with roles)
# ---------------------------
FIXED_USERS = [
    {"name": "Admin User",     "email": "admin@example.com",  "role": "admin"},
    {"name": "Support Agent",  "email": "agent@example.com",  "role": "agent"},
    {"name": "Alice Tan",      "email": "alicetan@example.com", "role": "customer"},
    {"name": "Bob Lim",        "email": "boblim@example.com",   "role": "customer"},
    {"name": "Charlie Lee",    "email": "charlielee@example.com", "role": "customer"},
    {"name": "Daniel Ng",      "email": "danielng@example.com", "role": "customer"},
    {"name": "Emily Wong",     "email": "emilywong@example.com", "role": "customer"},
    {"name": "Fiona Chong",    "email": "fionachong@example.com", "role": "customer"},
    {"name": "Grace Koh",      "email": "gracekoh@example.com", "role": "customer"},
    {"name": "Hannah Goh",     "email": "hannahgoh@example.com", "role": "customer"},
    {"name": "Ivan Chan",      "email": "ivanchan@example.com", "role": "customer"},
    {"name": "Jacob Teo",      "email": "jacobteo@example.com", "role": "customer"},
]

# ---------------------------
# FIXED ORDER DATA
# ---------------------------
FIXED_ORDERS = [
    {"order_number": "ORD-1001", "status": "Processing",        "days_delta": 5},
    {"order_number": "ORD-1002", "status": "Shipped",           "days_delta": 3},
    {"order_number": "ORD-1003", "status": "Delivered",         "days_delta": -7},
    {"order_number": "ORD-1004", "status": "Out for delivery",  "days_delta": 1},
    {"order_number": "ORD-1005", "status": "Processing",        "days_delta": 10},
    {"order_number": "ORD-1006", "status": "Shipped",           "days_delta": 4},
    {"order_number": "ORD-1007", "status": "Delivered",         "days_delta": -2},
    {"order_number": "ORD-1008", "status": "Processing",        "days_delta": 8},
    {"order_number": "ORD-1009", "status": "Shipped",           "days_delta": 2},
    {"order_number": "ORD-1010", "status": "Delivered",         "days_delta": -14},
]


def run_seed():
    db = SessionLocal()
    try:
        print("🗑 Wiping existing data...")

        db.query(Order).delete()
        db.query(User).delete()
        db.commit()

        print("✔ Deleted old data")

        print("\n🌱 Seeding users (admin, agent, customers)...")
        user_objects = []
        for u in FIXED_USERS:
            user_obj = User(
                name=u["name"],
                email=u["email"],
                password="password123",
                role=u.get("role", "customer"),
            )
            db.add(user_obj)
            user_objects.append(user_obj)

        db.commit()

        # refresh to get IDs
        for u in user_objects:
            db.refresh(u)

        # Only customers should own orders
        customer_users = [u for u in user_objects if u.role == "customer"]

        print("🌱 Seeding orders for customers...")
        for i, order_info in enumerate(FIXED_ORDERS):
            # cycle only through customer accounts
            user = customer_users[i % len(customer_users)]

            eta = date.today() + timedelta(days=order_info["days_delta"])

            order = Order(
                order_number=order_info["order_number"],
                status=order_info["status"],
                estimated_delivery=eta,
                customer_name=user.name,
                user=user,
            )
            db.add(order)

        db.commit()

        print("\n✅ Seeding complete!")
        print(f"Total users: {db.query(User).count()}")
        print(f"Total orders: {db.query(Order).count()}")

        print("\nExample customer with order:")
        print("  Email: alicetan@example.com")
        print("  Password: password123")
        print("  Example order: ORD-1001")

    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
