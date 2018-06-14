import os

docs = "docs"
original = os.path.join(docs, "original")
anonymized = os.path.join(docs, "anonymized")

if not os.path.exists(docs):
	os.makedirs(docs)
if not os.path.exists(original):
	os.makedirs(original)
if not os.path.exists(anonymized):
	os.makedirs(anonymized)