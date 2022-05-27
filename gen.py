import os

f = open('lines.txt')

lines = f.readlines()

for line in lines:
    line = line.strip().strip("\"").strip()
    url = line
    filename = line.split("/")[-1].replace("-", " ")
    fontname = filename.split(".")[0].replace("-", " ")
    print(filename, fontname)
    outputfile_name = "{}.css".format(fontname)
    template = """
@font-face {{
    font-family: "{}";
    src: url("{}");
}}
"""
    output = template.format(fontname, url)
    of = open(outputfile_name, "w")
    of.write(output)