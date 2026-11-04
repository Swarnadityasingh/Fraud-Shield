from app.database import test_database_connection

if __name__ == "__main__":
    try:
        test_database_connection()
        print("PostgreSQL connection successful!")
    except Exception as error:
        print(f"Database connection failed: {error}")
