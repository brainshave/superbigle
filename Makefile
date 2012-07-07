# Regenerate index.html

# index.html : Makefile gen_index.sh $(wildcard lib/*.js) $(wildcard chapter_??/*.js) $(wildcard */*.c)
#		bash gen_index.sh > index.html


js/index.js : Makefile gen_index.sh $(wildcard chapter_??/*.js)
	bash gen_index.sh > js/index.js
	cat js/index.js
