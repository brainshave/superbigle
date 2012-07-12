# Regenerate index.js

js/bigle/index.js : Makefile gen_index.sh $(wildcard chapter_??/*.js)
	bash gen_index.sh > $@
	cat $@

clean:
	rm js/bigle/index.js
