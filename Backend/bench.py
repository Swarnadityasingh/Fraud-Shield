import concurrent.futures
import statistics
import time
from fastapi.testclient import TestClient
from app.main import app

with TestClient(app) as client:

  for route in app.routes:
    if getattr(route, "path", "") == "/predict/fraud":
      for dep in getattr(route, "dependant", None).dependencies:
        orig_call = dep.call
        if (
            "user" in orig_call.__name__.lower()
            or "current" in orig_call.__name__.lower()
        ):

          class MockUser:
            id = 4
            email = "test@fraudshield.local"
            is_active = True

          app.dependency_overrides[orig_call] = lambda: MockUser()

  r0 = client.post("/predict/fraud", json={"features": {}})
  missing = r0.json().get("detail", {}).get("missing_features", [])

  cat_cols = {
      "ProductCD",
      "card4",
      "card6",
      "P_emaildomain",
      "R_emaildomain",
      "M1",
      "M2",
      "M3",
      "M4",
      "M5",
      "M6",
      "M7",
      "M8",
      "M9",
      "id_12",
      "id_15",
      "id_16",
      "id_23",
      "id_27",
      "id_28",
      "id_29",
      "id_30",
      "id_31",
      "id_33",
      "id_34",
      "id_35",
      "id_36",
      "id_37",
      "id_38",
      "DeviceType",
      "DeviceInfo",
  }
  features_dict = {f: (None if f in cat_cols else 0) for f in missing}
  payload = {"features": features_dict}

  # Verify 200 OK
  check = client.post("/predict/fraud", json=payload)
  if check.status_code != 200:
    print("Check failed:", check.status_code, check.text)
    exit(1)

  TOTAL_REQUESTS = 300
  CONCURRENCY = 20

  def hit(_):
    t0 = time.perf_counter()
    client.post("/predict/fraud", json=payload)
    return (time.perf_counter() - t0) * 1000

  t_start = time.perf_counter()
  with concurrent.futures.ThreadPoolExecutor(max_workers=CONCURRENCY) as ex:
    times = list(ex.map(hit, range(TOTAL_REQUESTS)))
  elapsed = time.perf_counter() - t_start

  times.sort()
  print(f"Total Requests: {TOTAL_REQUESTS} | Concurrency: {CONCURRENCY}")
  print(f"P50 Latency:    {statistics.median(times):.2f} ms")
  print(f"P95 Latency:    {times[int(0.95 * len(times))]:.2f} ms")
  print(f"Throughput:     {TOTAL_REQUESTS / elapsed:.2f} RPS")
