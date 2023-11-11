import subprocess
str = input("input file name >>")

f_html_w = open(str + ".html", "w", encoding="UTF-8")
f_html_r = open("base.html", "r", encoding="UTF-8")
f_js_w = open(str + ".js", "w", encoding="UTF-8")
f_js_r = open("base.js", "r", encoding="UTF-8")

f_html_w.write(f_html_r.read())
f_js_w.write(f_js_r.read())

f_html_w.close()
f_html_r.close()
f_js_w.close()
f_js_r.close()

subprocess.run("clip", input="<li><a href='./" + str + ".html'>" + str + "</a></li>", text=True)