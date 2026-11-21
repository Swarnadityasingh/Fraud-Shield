"""Read-only check of the configured PostgreSQL connection."""


if __name__ == "__main__":
    from app.database import engine, test_database_connection as check_connection

    if engine.dialect.name != "postgresql":
        raise SystemExit("Configure a PostgreSQL DATABASE_URL to run this check.")
    try:
        check_connection()
    except Exception as error:
        raise SystemExit(f"PostgreSQL connection failed ({type(error).__name__}).") from None
    print("PostgreSQL connection successful.")
