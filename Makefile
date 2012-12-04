REPORTER = spec

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
	  -u tdd \
		--reporter $(REPORTER) \
		$(filter-out $@,$(MAKECMDGOALS))

test-w:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		--growl \
		-u tdd \
		--watch

test-cov: lib-cov
	@INSTINCT_COV=1 $(MAKE) test REPORTER=html-cov > public/coverage.html

lib-cov:
	@jscoverage lib lib-cov

.PHONY: test test-w
