import json

dict = {}

openedfile = open("thesaurus.txt", "r")
lines = openedfile.readlines()
for line in lines:
    split = line.split(',')
    dict[split[0]] = split[1]

openedfile.close()
json = json.dumps(dict)
print(json)
outfile = open("thesaurus.json", "w")
outfile.write(json)
outfile.close()
