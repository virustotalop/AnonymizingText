import json
import os

#Dirty hack since file support is lacking in webextensions and documentation for it is poor

openedfile = open("thesaurus.json", "r")
json = json.load(openedfile)

js = "//This is a hack for file support in webextensions, will likely switch to indexdb later \n"
js += "var thesaurus = new Map();"
js += "\n"
keys = json.keys()

outfile = open("thesaurus.js", "w")

for key in keys:
    #print(key)
    js += "thesaurus.set(\"" + key + "\", \"" + json[key] + "\"); \n" 

outfile.write(js)
outfile.close()
openedfile.close()
os.rename("thesaurus.js", "../plugin/thesaurus.js")
