# Regenerate index.js

js/index.js : Makefile gen_index.sh $(wildcard chapter_??/*.js)
	bash gen_index.sh > js/index.js
	cat js/index.js
