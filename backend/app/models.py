from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    sku = Column(String, unique=True, nullable=False)

    price = Column(Float, nullable=False)

    quantity = Column(Integer, nullable=False)

    # NEW FIELD
    is_active = Column(Boolean, default=True)


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String, nullable=False)

    email = Column(String, unique=True, nullable=False)

    phone = Column(String, nullable=False)


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(Integer, ForeignKey("customers.id"))

    total_amount = Column(Float, nullable=False)

    customer = relationship("Customer")

    items = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan"
    )


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)

    order_id = Column(Integer, ForeignKey("orders.id"))

    product_id = Column(Integer, ForeignKey("products.id"))

    quantity = Column(Integer, nullable=False)

    price = Column(Float, nullable=False)

    order = relationship(
        "Order",
        back_populates="items"
    )

    product = relationship("Product")