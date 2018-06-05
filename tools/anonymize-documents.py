#https://selenium-python.readthedocs.io/getting-started.html

import os
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

driver = webdriver.Firefox()

os.chdir("..")
plugin_path = os.path.join(os.path.abspath(os.curdir), "plugin")

driver.install_addon(plugin_path, temporary=True)

driver.get("http://localhost/test.html")

