from fastapi import FastAPI
from routes.routes import router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
app = FastAPI(title="AI Email Sender")

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.mount("/", StaticFiles(directory=frontend_dist_path, html=True), name="frontend")
app.include_router(router, prefix="/api")
frontend_dist_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))

if os.path.isdir(frontend_dist_path):
    app.mount("/", StaticFiles(directory=frontend_dist_path, html=True), name="frontend")
else:
    message='nothing just error for not having build  method'