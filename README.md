# Inventory Management System

A full-stack inventory management application for tracking products, customers, and
orders. The React frontend talks to a FastAPI REST backend backed by PostgreSQL.

## Features

- **Products** — full CRUD with unique SKU enforcement and validation against negative
  price or quantity
- **Archive & restore** — products are soft-deleted via an `is_active` flag, viewable on a
  dedicated archive page, with restore or permanent-delete options
- **Low-stock alerts** — surfaces every product that drops below 5 units
- **Customers** — CRUD with unique email enforcement
- **Orders** — multi-item orders that validate available stock, deduct inventory
  automatically, and compute the order total from current product prices
- **Dashboard** — summary cards for inventory at a glance

## Tech Stack

| Layer    | Technology                                     |
| -------- | ---------------------------------------------- |
| Frontend | React 19, Vite, Tailwind CSS, React Router, Axios |
| Backend  | FastAPI, SQLAlchemy, Pydantic, Uvicorn         |
| Database | PostgreSQL 15                                  |
| Infra    | Docker, Docker Compose                         |
