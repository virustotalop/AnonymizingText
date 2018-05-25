import json

dict = {}

key = None
openedfile = open("thesaurus.dat", "r")
lines = openedfile.readlines()
for line in lines:
	if "|" in line:
		if key is None:
			if "(" in line:
				continue

			split = line.split('|')
			key = split[0]
		else:
			split = line.split('|')
			dict[key] = split[1].replace("\n", "")
			key = None
openedfile.close()
json = json.dumps(dict)
print(json)
outfile = open("thesaurus.json", "w")
outfile.write(json)
outfile.close()
