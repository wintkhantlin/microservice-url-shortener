from .predictor import PhishingDetector

try:
    from .trainer import PhishingModelTrainer
except ImportError:
    # Training dependencies (pandas, etc.) might be missing in production
    PhishingModelTrainer = None

__all__ = ["PhishingDetector", "PhishingModelTrainer"]
