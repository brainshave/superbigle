# Regenerate index.html

index.html : Makefile gen_index.sh $(wildcard lib/*.js) $(wildcard chapter_??/*.js)
	bash gen_index.sh > index.html
