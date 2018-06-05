import os
import math
from textblob import TextBlob

docs_dir = os.path.join(os.getcwd(), "docs")
original_dir = os.path.join(docs_dir, "original")
anonymized_dir = os.path.join(docs_dir, "anonymized")

changed_words = 0
document_difference = 0
documents = 0	

def length_difference(original,changed):
	return int(math.fabs(len(original) - len(changed)))

def bag_of_words(words):
	dictionary = dict()
	for word in words:
		if word not in dictionary:
			dictionary[word] = 1
		else:
			dictionary[word] =  dictionary[word] + 1
	return dictionary

def bag_of_words_difference(original,changed):
	difference = 0
	for key in changed:
		if key not in original:
			difference += changed[key]
		elif original[key] != changed[key]:
			difference += int(math.fabs(original[key] - changed[key]))
	
	global changed_words
	changed_words += difference
	
	

for file_name in os.listdir(original_dir):
	original_file = open(os.path.join(original_dir, file_name), "r", encoding="utf-8")
	anonymized_file = open(os.path.join(anonymized_dir, file_name), "r", encoding="utf-8")
	
	original_text = original_file.read()
	anonymized_text = anonymized_file.read()
	
	original_file.close()
	anonymized_file.close()
	
	original_blob = TextBlob(original_text)
	original_words = original_blob.words
	
	anonymized_blob = TextBlob(anonymized_text)
	anonymized_words = anonymized_blob.words
	
	#print(original_words)
	#print(anonymized_words)
	
	original_dict = bag_of_words(original_words)
	anonymized_dict = bag_of_words(anonymized_words)
	
	#print(original_dict)
	#print(anonymized_dict)
	
	bag_of_words_difference(original_dict, anonymized_dict)
	document_difference += length_difference(original_text, anonymized_text)
	documents += 1
	
	#break
print(str(changed_words) + " changed words")
changed_words_percentage = "%.2f" % ((documents / changed_words) * 100)
print(changed_words_percentage + "% of words changed out of " + str(documents) + " documents")
print("With a character difference of " + str(document_difference))
character_difference_percentage = "%.2f" % ((documents / document_difference) * 100)
print(character_difference_percentage + "% of document length changed out of " + str(documents) + " documents")