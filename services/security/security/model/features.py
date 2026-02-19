import re
import numpy as np
import requests
import tldextract
import socket
from urllib.parse import urlparse

session = requests.Session()
session.headers.update({"User-Agent": "Mozilla/5.0"})

def is_ip(host):
    try:
        socket.inet_aton(host)
        return 1
    except:
        return 0

def extract_features(url):
    url = str(url).strip()
    features = []

    try:
        # 1. Fetch URL first to get the final destination (last redirect location)
        try:
            r = session.get(url, timeout=2, allow_redirects=True)
            final_url = r.url
            html = r.text.lower()
            is_unreachable = 0
        except:
            final_url = url
            html = ""
            is_unreachable = 1

        # 2. Extract Lexical Features from Final URL
        parsed = urlparse(final_url)
        ext = tldextract.extract(final_url)
        host = parsed.hostname or ""
        domain = f"{ext.domain}.{ext.suffix}"

        url_len = len(final_url)
        domain_len = len(domain)
        sub_count = len(ext.subdomain.split(".")) if ext.subdomain else 0
        suffix_len = len(ext.suffix)

        alpha_ratio = sum(c.isalpha() for c in final_url) / url_len if url_len else 0
        digit_ratio = sum(c.isdigit() for c in final_url) / url_len if url_len else 0
        special_ratio = (url_len - sum(c.isalnum() for c in final_url)) / url_len if url_len else 0

        features += [
            url_len,
            domain_len,
            is_ip(host),
            suffix_len,
            sub_count,
            1 if parsed.scheme == "https" else 0,
            alpha_ratio,
            digit_ratio,
            special_ratio
        ]

        # 3. Add IsUnreachable and Content Features
        has_title = 1 if "<title>" in html else 0
        has_favicon = 1 if "favicon" in html else 0
        has_password = 1 if 'type="password"' in html else 0
        has_submit = 1 if 'type="submit"' in html else 0
        has_iframe = 1 if "<iframe" in html else 0
        line_count = html.count("\n")

        features += [
            is_unreachable,
            # redirect_count removed
            has_title,
            has_favicon,
            has_password,
            has_submit,
            has_iframe,
            line_count
        ]

    except:
        return np.zeros((1, 16), dtype=np.float32)

    return np.array([features], dtype=np.float32)
