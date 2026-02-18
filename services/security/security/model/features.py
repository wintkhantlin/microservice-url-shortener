import re
import numpy as np
import requests
import tldextract
from urllib.parse import urlparse

def extract_features(url):
    url = str(url).strip()
    features = []
    
    try:
        parsed = urlparse(url)
        ext = tldextract.extract(url)
        domain = f"{ext.domain}.{ext.suffix}"
        
        features.append(len(url))
        features.append(len(domain))
        features.append(1 if re.match(r'^\d{1,3}(\.\d{1,3}){3}$', ext.domain) else 0)
        features.append(len(ext.suffix))
        features.append(len(ext.subdomain.split('.')) if ext.subdomain else 0)
        features.append(1 if parsed.scheme == 'https' else 0)
        
        features.append(sum(c.isalpha() for c in url) / len(url) if len(url) > 0 else 0)
        features.append(sum(c.isdigit() for c in url) / len(url) if len(url) > 0 else 0)
        features.append((len(url) - sum(c.isalnum() for c in url)) / len(url) if len(url) > 0 else 0)
        
        try:
            resp = requests.get(url, timeout=3, verify=False)
            content = resp.text.lower()
            
            features.append(0)
            features.append(1 if '<title>' in content else 0)
            features.append(1 if 'favicon' in content else 0)
            features.append(1 if 'type="password"' in content else 0)
            features.append(1 if 'type="submit"' in content else 0)
            features.append(1 if '<iframe' in content else 0)
            features.append(len(content.splitlines()))
            
        except:
            features.append(1)
            features.append(0)
            features.append(0)
            features.append(0)
            features.append(0)
            features.append(0)
            features.append(0)
            
    except Exception as e:
        print(f"Error extracting features: {e}")
        return np.zeros((1, 16), dtype=np.float32)
        
    return np.array([features], dtype=np.float32)
