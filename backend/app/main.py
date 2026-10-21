from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, Base, get_db
from . import models, schemas
from .models import Order, OrderItem, Product, Customer

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Inventory System Running"}


# ---------------- PRODUCTS ---------------- #

@app.post("/products")
def create_product(
    product: schemas.ProductCreate,
    db: Session = Depends(get_db)
):

    existing_product = db.query(models.Product).filter(
        models.Product.sku == product.sku
    ).first()

    if existing_product:
        raise HTTPException(
            status_code=400,
            detail="SKU already exists"
        )

    if product.quantity < 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity cannot be negative"
        )

    if product.price < 0:
        raise HTTPException(
            status_code=400,
            detail="Price cannot be negative"
        )

    new_product = models.Product(
        name=product.name,
        sku=product.sku,
        price=product.price,
        quantity=product.quantity,
        is_active=True
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product

@app.get("/products")
def get_products(
    db: Session = Depends(get_db)
):
    products = db.query(models.Product).filter(
        models.Product.is_active == True
    ).all() 

    return products

@app.get("/products/low-stock")
def get_low_stock_products(
    db: Session = Depends(get_db)
):
    products = db.query(models.Product).filter(
        models.Product.is_active == True,
        models.Product.quantity < 5
    ).all()

    return products

@app.get("/products/archived")
def get_archived_products(
    db: Session = Depends(get_db)
):
    products = db.query(models.Product).filter(
        models.Product.is_active == False
    ).all()

    return products


@app.get("/products/{product_id}")
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


@app.put("/products/{product_id}")
def update_product(
    product_id: int,
    updated_product: schemas.ProductUpdate,
    db: Session = Depends(get_db)
):
    product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    product.name = updated_product.name
    product.sku = updated_product.sku
    product.price = updated_product.price
    product.quantity = updated_product.quantity

    db.commit()
    db.refresh(product)

    return product


@app.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    product.is_active = False

    db.commit()

    return {
        "message": "Product archived successfully"
    }


@app.put("/products/{product_id}/restore")
def restore_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    product.is_active = True

    db.commit()
    db.refresh(product)

    return {
        "message": "Product restored successfully"
    }

@app.delete("/products/{product_id}/permanent")
def permanently_delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = db.query(models.Product).filter(
        models.Product.id == product_id,
        models.Product.is_active == False
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Archived product not found"
        )

    db.query(OrderItem).filter(
        OrderItem.product_id == product_id
    ).delete()

    db.delete(product)

    db.commit()

    return {
        "message": "Product permanently deleted"
    }


# ---------------- CUSTOMERS ---------------- #

@app.post("/customers")
def create_customer(
    customer: schemas.CustomerCreate,
    db: Session = Depends(get_db)
):
    existing_customer = db.query(models.Customer).filter(
        models.Customer.email == customer.email
    ).first()

    if existing_customer:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_customer = models.Customer(
        full_name=customer.full_name,
        email=customer.email,
        phone=customer.phone
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    return new_customer


@app.get("/customers")
def get_customers(
    db: Session = Depends(get_db)
):
    return db.query(models.Customer).all()


@app.get("/customers/{customer_id}")
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):
    customer = db.query(models.Customer).filter(
        models.Customer.id == customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    return customer


@app.delete("/customers/{customer_id}")
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db)
):
    customer = db.query(models.Customer).filter(
        models.Customer.id == customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    db.delete(customer)
    db.commit()

    return {"message": "Customer deleted successfully"}


# ---------------- ORDERS ---------------- #

@app.post("/orders")
def create_order(
    order: schemas.OrderCreate,
    db: Session = Depends(get_db)
):

    customer = db.query(Customer).filter(
        Customer.id == order.customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    total_amount = 0

    new_order = Order(
        customer_id=order.customer_id,
        total_amount=0
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    for item in order.items:

        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product {item.product_id} not found"
            )

        if product.quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {product.name}"
            )

        product.quantity -= item.quantity

        item_total = product.price * item.quantity

        total_amount += item_total

        order_item = OrderItem(
            order_id=new_order.id,
            product_id=product.id,
            quantity=item.quantity,
            price=product.price
        )

        db.add(order_item)

    new_order.total_amount = total_amount

    db.commit()
    db.refresh(new_order)

    return new_order


@app.get("/orders")
def get_orders(
    db: Session = Depends(get_db)
):
    return db.query(Order).all()


@app.get("/orders/{order_id}")
def get_order(
    order_id: int,
    db: Session = Depends(get_db)
):

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return {
        "id": order.id,
        "customer_id": order.customer_id,
        "customer_name": order.customer.full_name,
        "total_amount": order.total_amount,
        "items": [
            {
                "product_id": item.product_id,
                "product_name": item.product.name,
                "quantity": item.quantity,
                "price": item.price
            }
            for item in order.items
        ]
    }


@app.delete("/orders/{order_id}")
def delete_order(
    order_id: int,
    db: Session = Depends(get_db)
):

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    # Delete all order items linked to this order
    db.query(OrderItem).filter(
        OrderItem.order_id == order_id
    ).delete()

    # Delete the order itself
    db.delete(order)

    db.commit()

    return {"message": "Order deleted successfully"}