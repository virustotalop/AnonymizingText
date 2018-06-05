#https://selenium-python.readthedocs.io/getting-started.html

import os
import pyautogui
import time
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Firefox()

os.chdir("..")
plugin_path = os.path.join(os.path.abspath(os.curdir), "plugin")

driver.install_addon(plugin_path, temporary=True)

driver.get("http://localhost/test.html")

os.chdir("tools")

data_element = driver.find_element_by_id("test-data")
data_element.clear()

time.sleep(5)

docs_dir = os.path.join(os.getcwd(), "docs")
original_dir = os.path.join(docs_dir, "original")
anonymized_dir = os.path.join(docs_dir, "anonymized")

pyautogui.PAUSE = 1
pyautogui.FAILSAFE = True

for file in os.listdir(original_dir):
	read_file = open(os.path.join(original_dir, file), "r", encoding="utf-8")
	str = read_file.read()
	data_element.clear()
	data_element.send_keys(str)
	read_file.close()
	pyautogui.moveTo(100, 150) #Will need to be changed later
	pyautogui.rightClick()
	pyautogui.press('up')
	pyautogui.press('enter')
	anonymized_text = data_element.get_attribute("value")
	#print(anonymized_text)
	out_file = open(os.path.join(anonymized_dir, file), "w", encoding="utf-8")
	out_file.write(anonymized_text)
	out_file.close()
	#break
	