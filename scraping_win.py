import time

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By

main_path = "file:///W:/seminar/python/cn.html"
def get_url(param_dict):
  param = "?sin_l=0"
  for key in param_dict.keys():
    param += ("&" + key + "=" + param_dict[key])
  return main_path + param

def scraping_unit(param_dict):
  driver.get(get_url(param_dict))
  driver.find_element(By.ID, "calc").click()
  time.sleep(2)
  valuesText = driver.find_element(By.ID, "values").text
  valuesStringArray = valuesText.split(",")
  values = []
  for value in valuesStringArray:
    values.append(float(value))
  print(values)


service = Service(executable_path='./chromedriver.exe')
driver = webdriver.Chrome(service=service)

scraping_unit({"N":"1000"})


driver.quit()